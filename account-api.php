<?php
declare(strict_types=1);
// Optional Google customer identity. No admin privileges, payments or file uploads.
ini_set('display_errors', '0');
header('Cache-Control: no-store, private');
header('Pragma: no-cache');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
const EJDER_ORIGIN = 'https://ejderstudio.com';
const EJDER_CALLBACK = EJDER_ORIGIN . '/account-api.php?action=callback';
$configPath = dirname(__DIR__) . '/EJDER_CONFIG/google.php';
if (!@is_file($configPath) && @is_file(__DIR__ . '/EJDER_CONFIG/google.php')) $configPath = __DIR__ . '/EJDER_CONFIG/google.php';
$config = is_file($configPath) ? require $configPath : [];
if (!is_array($config)) $config = [];
$clientId = (string)($config['client_id'] ?? (getenv('EJDER_GOOGLE_CLIENT_ID') ?: ''));
$clientSecret = (string)($config['client_secret'] ?? (getenv('EJDER_GOOGLE_CLIENT_SECRET') ?: ''));
$ready = $clientId !== '' && $clientSecret !== '' && function_exists('curl_init');
function reply(array $data, int $code = 200): void {
    http_response_code($code); header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit;
}
function accountRedirect(string $lang, string $message = ''): void {
    $path = $lang === 'de' ? '/de.html' : '/';
    header('Location: ' . EJDER_ORIGIN . $path . ($message ? '?account=' . rawurlencode($message) : '') . '#/account', true, 303); exit;
}
function googleRequest(string $url, ?array $form = null, ?string $token = null): array {
    $ch = curl_init($url);
    $headers = ['Accept: application/json'];
    if ($token !== null) $headers[] = 'Authorization: Bearer ' . $token;
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 12, CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_FOLLOWLOCATION => false, CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER => $headers, CURLOPT_PROTOCOLS => CURLPROTO_HTTPS]);
    if ($form !== null) {curl_setopt($ch, CURLOPT_POST, true); curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($form));}
    $raw = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if (!is_string($raw) || $code !== 200 || strlen($raw) > 100000) throw new RuntimeException('provider_error');
    $result = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($result) || isset($result['error'])) throw new RuntimeException('provider_error');
    return $result;
}
$action = $_GET['action'] ?? 'status';
if (!is_string($action) || !in_array($action, ['status','start','callback','logout'], true)) reply(['error'=>'not_found'],404);
if ($_SERVER['REQUEST_METHOD'] !== ($action === 'logout' ? 'POST' : 'GET')) reply(['error'=>'method_not_allowed'],405);
if (!$ready && $action === 'status') reply(['ready'=>false,'authenticated'=>false]);
if (!$ready && $action === 'start') accountRedirect(($_GET['lang'] ?? '') === 'de' ? 'de' : 'tr','unavailable');
ini_set('session.use_strict_mode','1'); ini_set('session.use_only_cookies','1');
session_name('__Host-ejder_customer');
session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
session_start();
if (isset($_SESSION['created']) && time() - (int)$_SESSION['created'] > 7200) {$_SESSION=[]; session_regenerate_id(true);}
if (!isset($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32));
if ($action === 'status') reply(['ready'=>$ready,'authenticated'=>isset($_SESSION['user']),'user'=>$_SESSION['user'] ?? null,'csrf'=>$_SESSION['csrf']]);
if ($action === 'logout') {
    $token=$_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (($_SERVER['HTTP_ORIGIN'] ?? '') !== EJDER_ORIGIN || !is_string($token) || !hash_equals($_SESSION['csrf'],$token)) reply(['error'=>'forbidden'],403);
    $_SESSION=[]; session_destroy(); setcookie('__Host-ejder_customer','',['expires'=>time()-3600,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Lax']);
    reply(['ok'=>true]);
}
if ($action === 'start') {
    if (isset($_SESSION['oauth']['issued']) && time()-(int)$_SESSION['oauth']['issued'] < 3) reply(['error'=>'retry_later'],429);
    $state=bin2hex(random_bytes(32));$verifier=rtrim(strtr(base64_encode(random_bytes(48)),'+/','-_'),'=');
    $_SESSION['oauth']=['state'=>$state,'verifier'=>$verifier,'issued'=>time(),'lang'=>($_GET['lang'] ?? '')==='de'?'de':'tr'];
    $params=['client_id'=>$clientId,'redirect_uri'=>EJDER_CALLBACK,'response_type'=>'code','scope'=>'openid email profile','access_type'=>'online',
        'state'=>$state,'code_challenge'=>rtrim(strtr(base64_encode(hash('sha256',$verifier,true)),'+/','-_'),'='),'code_challenge_method'=>'S256','prompt'=>'select_account'];
    header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params),true,302);exit;
}
$pending=$_SESSION['oauth'] ?? null;unset($_SESSION['oauth']);
$state=$_GET['state'] ?? '';$code=$_GET['code'] ?? '';
if (!$ready || !is_array($pending) || !is_string($state) || !hash_equals($pending['state'],$state) || time()-(int)$pending['issued']>600 || !is_string($code) || $code==='' || strlen($code)>4096) reply(['error'=>'invalid_login'],400);
try {
    $tokens=googleRequest('https://oauth2.googleapis.com/token',['code'=>$code,'client_id'=>$clientId,'client_secret'=>$clientSecret,'redirect_uri'=>EJDER_CALLBACK,'grant_type'=>'authorization_code','code_verifier'=>$pending['verifier']]);
    if (!isset($tokens['access_token']) || !is_string($tokens['access_token']) || !preg_match('/^[A-Za-z0-9._~+\/-]+$/D',$tokens['access_token'])) throw new RuntimeException('invalid_token');
    // Identity comes directly from Google's authenticated UserInfo endpoint, never from browser claims.
    $user=googleRequest('https://openidconnect.googleapis.com/v1/userinfo',null,$tokens['access_token']);
    if (empty($user['sub']) || !is_string($user['sub']) || strlen($user['sub'])>255 || ($user['email_verified'] ?? false)!==true || !filter_var($user['email'] ?? '',FILTER_VALIDATE_EMAIL)) throw new RuntimeException('invalid_identity');
    session_regenerate_id(true);$_SESSION=['created'=>time(),'csrf'=>bin2hex(random_bytes(32)),
        'user'=>['id'=>$user['sub'],'email'=>$user['email'],'name'=>substr((string)($user['name'] ?? ''),0,250)]];
    unset($tokens,$user);accountRedirect($pending['lang']);
} catch (Throwable $e) {accountRedirect($pending['lang'],'failed');}
