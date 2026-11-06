<?php
declare(strict_types=1);
ini_set('display_errors','0');
header('Cache-Control: no-store, private');header('X-Content-Type-Options: nosniff');header('X-Robots-Tag: noindex, nofollow');header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
require __DIR__.'/shop-core.php';
function respond(array $data,int $code=200):void {http_response_code($code);header('Content-Type: application/json; charset=utf-8');echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function adminOnly():void {if(!isset($_SESSION['admin'])||time()-$_SESSION['admin']>3600)throw new ShopError('login_required',401);}
function twoFactorEnabled(array $admin):bool {return ($admin['twoFactorEnabled']??true)!==false;}
function recoveryCodes():array {$out=[];for($i=0;$i<8;$i++)$out[]=bin2hex(random_bytes(8));return $out;}
function passwordRecoveryCode():string {return implode('-',str_split(strtoupper(bin2hex(random_bytes(16))),8));}
function passwordRecoveryHash(string $code):string {return hash('sha256',strtoupper(preg_replace('/[\s-]+/','',$code)));}
function checkRecoverySecondFactor(array &$admin,string $code):bool {
    if(!twoFactorEnabled($admin))return true;
    $step=EjderShop::verifyOtp($admin['secret'],$code,$admin['lastOtp']);
    if($step!==null){$admin['lastOtp']=$step;return true;}
    $index=array_search(hash('sha256',$code),$admin['recovery'],true);
    if($index===false)return false;
    unset($admin['recovery'][$index]);$admin['recovery']=array_values($admin['recovery']);return true;
}
function dataIn():array {if((int)($_SERVER['CONTENT_LENGTH']??0)>100000)throw new ShopError('too_large',413);$raw=file_get_contents('php://input',false,null,0,100001);if(strlen($raw)>100000)throw new ShopError('too_large',413);try{$v=json_decode($raw,true,16,JSON_THROW_ON_ERROR);}catch(Throwable $e){throw new ShopError('invalid_json');}if(!is_array($v))throw new ShopError('invalid_json');return $v;}
try {
    ini_set('session.use_strict_mode','1');ini_set('session.use_only_cookies','1');session_name('__Host-ejder_shop');session_set_cookie_params(['lifetime'=>0,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);session_start();
    if(!isset($_SESSION['csrf']))$_SESSION['csrf']=bin2hex(random_bytes(32));
    if(isset($_SESSION['admin'])&&time()-$_SESSION['admin']>3600){unset($_SESSION['admin']);session_regenerate_id(true);}
    $shop=new EjderShop(dirname(__DIR__).'/EJDER_SHOP_DATA');
    if(isset($_SESSION['admin'])){
        $valid=$shop->transact(fn(&$db)=>$db['admin']!==null&&($_SESSION['adminVersion']??1)===($db['admin']['authVersion']??1));
        if(!$valid){session_regenerate_id(true);$_SESSION=['csrf'=>bin2hex(random_bytes(32))];}
    }
    $action=$_GET['action']??'catalog';if(!is_string($action))throw new ShopError('not_found',404);
    $get=['catalog','status','admin','image'];$post=['login','logout','setup-start','setup-finish','twofactor-start','twofactor-finish','password-reset','password-recovery','save-product','save-settings','upload','quote','request','event','request-status'];
    if(!in_array($action,array_merge($get,$post),true))throw new ShopError('not_found',404);
    if(($_SERVER['REQUEST_METHOD']??'GET')!==(in_array($action,$get,true)?'GET':'POST'))throw new ShopError('method_not_allowed',405);
    if(in_array($action,$post,true)){
        if(($_SERVER['HTTP_ORIGIN']??'')!=='https://ejderstudio.com'||!hash_equals($_SESSION['csrf'],(string)($_SERVER['HTTP_X_CSRF_TOKEN']??'')))throw new ShopError('forbidden',403);
        $ip=(string)($_SERVER['REMOTE_ADDR']??'');$limit=in_array($action,['login','setup-start','setup-finish','twofactor-start','twofactor-finish','password-reset','password-recovery'],true)?10:120;
        $limited=$shop->transact(function(&$db)use($ip,$action,$limit){return EjderShop::limited($db,hash_hmac('sha256',$action.'|'.$ip,$db['secret']),$limit,900);});if($limited)throw new ShopError('retry_later',429);
    }
    $setupConfig=dirname(__DIR__).'/EJDER_CONFIG/shop-setup.php';$config=is_file($setupConfig)?require $setupConfig:[];if(!is_array($config))$config=[];
    $setupTwoFactor=($config['password_only_setup']??false)!==true;
    $canSetup=isset($config['token_hash'],$config['expires'])&&time()<(int)$config['expires'];
    if($action==='catalog')respond($shop->transact(fn(&$db)=>['products'=>EjderShop::publicProducts($db),'settings'=>$db['settings'],'paymentsReady'=>false]));
    if($action==='status')respond($shop->transact(fn(&$db)=>['csrf'=>$_SESSION['csrf'],'authenticated'=>isset($_SESSION['admin']),'configured'=>$db['admin']!==null,'setupAvailable'=>$db['admin']===null&&$canSetup,'twoFactorRequired'=>$db['admin']===null?$setupTwoFactor:twoFactorEnabled($db['admin'])]));
    if($action==='image'){
        $id=EjderShop::text($_GET['id']??'',32);$allowed=isset($_SESSION['admin'])||$shop->transact(function(&$db)use($id){foreach(EjderShop::publicProducts($db) as $p)if(in_array($id,$p['images'],true))return true;return false;});if(!$allowed)throw new ShopError('not_found',404);
        $bytes=$shop->readImage($id);header('Content-Type: image/jpeg');header('Content-Length: '.strlen($bytes));echo $bytes;exit;
    }
    if($action==='admin'){adminOnly();respond($shop->transact(fn(&$db)=>['products'=>array_values($db['products']),'requests'=>array_values($db['requests']),'stats'=>$db['stats'],'settings'=>$db['settings'],'security'=>['twoFactorEnabled'=>twoFactorEnabled($db['admin']),'passwordRecoveryReady'=>!empty($db['admin']['passwordRecoveryHash'])]]));}
    if($action==='upload'){
        adminOnly();$file=$_FILES['image']??null;if(!$file||$file['error']!==UPLOAD_ERR_OK||!is_uploaded_file($file['tmp_name']))throw new ShopError('invalid_image');$id=$shop->saveImage($file['tmp_name']);respond(['id'=>$id]);
    }
    $in=dataIn();
    if($action==='setup-start'||$action==='setup-finish'){
        $token=EjderShop::text($in['token']??'',128);if(!$canSetup||!hash_equals((string)$config['token_hash'],hash('sha256',$token)))throw new ShopError('setup_unavailable',403);
        if($shop->transact(fn(&$db)=>$db['admin']!==null))throw new ShopError('already_configured',409);
        if($action==='setup-start'){
            $_SESSION['setup']=['secret'=>$setupTwoFactor?EjderShop::base32(random_bytes(20)):null,'twoFactorRequired'=>$setupTwoFactor,'issued'=>time()];
            respond(['secret'=>$_SESSION['setup']['secret'],'twoFactorRequired'=>$setupTwoFactor]);
        }
        $pending=$_SESSION['setup']??null;if(!$pending||time()-$pending['issued']>900)throw new ShopError('setup_expired',403);
        if(($pending['twoFactorRequired']??true)!==$setupTwoFactor)throw new ShopError('setup_expired',403);
        $pass=$in['password']??'';if(!is_string($pass)||strlen($pass)<12||strlen($pass)>72||$pass!==($in['repeat']??null))throw new ShopError('invalid_password');
        $step=$setupTwoFactor?EjderShop::verifyOtp($pending['secret'],EjderShop::text($in['otp']??'',6)):-1;if($step===null)throw new ShopError('invalid_otp');
        $recovery=$setupTwoFactor?recoveryCodes():[];$passwordRecovery=passwordRecoveryCode();
        $shop->transact(function(&$db)use($pass,$pending,$step,$recovery,$setupTwoFactor,$passwordRecovery){if($db['admin']!==null)throw new ShopError('already_configured',409);$db['admin']=['twoFactorEnabled'=>$setupTwoFactor,'password'=>password_hash($pass,PASSWORD_DEFAULT),'secret'=>$pending['secret'],'lastOtp'=>$step,'recovery'=>array_map(fn($c)=>hash('sha256',$c),$recovery),'passwordRecoveryHash'=>passwordRecoveryHash($passwordRecovery),'authVersion'=>1];});
        session_regenerate_id(true);$_SESSION=['csrf'=>bin2hex(random_bytes(32)),'admin'=>time(),'adminVersion'=>1];respond(['ok'=>true,'csrf'=>$_SESSION['csrf'],'recovery'=>$recovery,'passwordRecovery'=>$passwordRecovery]);
    }
    if($action==='login'){
        $pass=$in['password']??'';if(!is_string($pass)||strlen($pass)>72)throw new ShopError('invalid_login',401);$code=EjderShop::text($in['otp']??'',32);
        $ok=$shop->transact(function(&$db)use($pass,$code){$a=$db['admin'];if(!$a||!password_verify($pass,$a['password']))return false;if(twoFactorEnabled($a)){$step=EjderShop::verifyOtp($a['secret'],$code,$a['lastOtp']);$recoveryIndex=array_search(hash('sha256',$code),$a['recovery'],true);if($step===null&&$recoveryIndex===false)return false;if($step!==null)$db['admin']['lastOtp']=$step;else{unset($db['admin']['recovery'][$recoveryIndex]);$db['admin']['recovery']=array_values($db['admin']['recovery']);}}if(password_needs_rehash($a['password'],PASSWORD_DEFAULT))$db['admin']['password']=password_hash($pass,PASSWORD_DEFAULT);return $a['authVersion']??1;});
        if(!$ok)throw new ShopError('invalid_login',401);session_regenerate_id(true);$_SESSION=['csrf'=>bin2hex(random_bytes(32)),'admin'=>time(),'adminVersion'=>$ok];respond(['ok'=>true,'csrf'=>$_SESSION['csrf']]);
    }
    if($action==='password-recovery'){
        adminOnly();$pass=$in['password']??'';$otp=EjderShop::text($in['otp']??'',32);
        if(!is_string($pass)||strlen($pass)>72)throw new ShopError('invalid_login',401);
        $code=$shop->transact(function(&$db)use($pass,$otp){
            $a=$db['admin'];if(!$a||!password_verify($pass,$a['password'])||!checkRecoverySecondFactor($a,$otp))throw new ShopError('invalid_login',401);
            $code=passwordRecoveryCode();$a['passwordRecoveryHash']=passwordRecoveryHash($code);$db['admin']=$a;return $code;
        });respond(['passwordRecovery'=>$code]);
    }
    if($action==='password-reset'){
        $code=EjderShop::text($in['code']??'',128);$otp=EjderShop::text($in['otp']??'',32);$pass=$in['password']??'';$repeat=$in['repeat']??null;
        $newCode=$shop->transact(function(&$db)use($code,$otp,$pass,$repeat){
            $a=$db['admin'];$digest=$a['passwordRecoveryHash']??'';
            if(!$a||!is_string($digest)||strlen($digest)!==64||!hash_equals($digest,passwordRecoveryHash($code)))throw new ShopError('invalid_reset',403);
            if(!is_string($pass)||strlen($pass)<12||strlen($pass)>72||$pass!==$repeat)throw new ShopError('invalid_password');
            if(!checkRecoverySecondFactor($a,$otp))throw new ShopError('invalid_reset',403);
            $newCode=passwordRecoveryCode();$a['password']=password_hash($pass,PASSWORD_DEFAULT);$a['passwordRecoveryHash']=passwordRecoveryHash($newCode);$a['authVersion']=($a['authVersion']??1)+1;$db['admin']=$a;return $newCode;
        });
        session_regenerate_id(true);$_SESSION=['csrf'=>bin2hex(random_bytes(32))];respond(['ok'=>true,'csrf'=>$_SESSION['csrf'],'passwordRecovery'=>$newCode]);
    }
    if($action==='twofactor-start'){
        adminOnly();$pass=$in['password']??'';if(!is_string($pass)||strlen($pass)>72)throw new ShopError('invalid_login',401);
        $hash=$shop->transact(function(&$db)use($pass){$a=$db['admin'];if(!$a||!password_verify($pass,$a['password']))throw new ShopError('invalid_login',401);if(twoFactorEnabled($a))throw new ShopError('two_factor_enabled',409);return $a['password'];});
        $_SESSION['twofactor']=['secret'=>EjderShop::base32(random_bytes(20)),'issued'=>time(),'passwordHash'=>$hash];
        respond(['secret'=>$_SESSION['twofactor']['secret']]);
    }
    if($action==='twofactor-finish'){
        adminOnly();$pending=$_SESSION['twofactor']??null;if(!$pending||time()-$pending['issued']>900)throw new ShopError('setup_expired',403);
        $step=EjderShop::verifyOtp($pending['secret'],EjderShop::text($in['otp']??'',6));if($step===null)throw new ShopError('invalid_otp');
        $recovery=recoveryCodes();$version=$shop->transact(function(&$db)use($pending,$step,$recovery){$a=$db['admin'];if(!$a||!hash_equals($pending['passwordHash'],$a['password']))throw new ShopError('login_required',401);if(twoFactorEnabled($a))throw new ShopError('two_factor_enabled',409);$db['admin']['twoFactorEnabled']=true;$db['admin']['secret']=$pending['secret'];$db['admin']['lastOtp']=$step;$db['admin']['recovery']=array_map(fn($c)=>hash('sha256',$c),$recovery);return $db['admin']['authVersion']??1;});
        session_regenerate_id(true);$_SESSION=['csrf'=>bin2hex(random_bytes(32)),'admin'=>time(),'adminVersion'=>$version];respond(['ok'=>true,'csrf'=>$_SESSION['csrf'],'recovery'=>$recovery]);
    }
    if($action==='logout'){$_SESSION=[];session_destroy();setcookie('__Host-ejder_shop','',['expires'=>time()-3600,'path'=>'/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);respond(['ok'=>true]);}
    if($action==='save-product'){
        adminOnly();$p=EjderShop::product($in);foreach($p['images'] as $id)if(!is_file($shop->imagePath($id)))throw new ShopError('invalid_image');
        $saved=$shop->transact(function(&$db)use($p,$in){$old=$db['products'][$p['id']]??null;if($old&&($in['revision']??null)!==$old['revision'])throw new ShopError('changed_elsewhere',409);if(!$old&&count($db['products'])>=200)throw new ShopError('catalog_full');if($old&&!array_key_exists('prices',$in)&&isset($old['prices'])){$p['prices']=$old['prices'];$p['prices'][$p['currency']]=$p['price'];}if($old&&!array_key_exists('sizePricesByCurrency',$in)&&isset($old['sizePricesByCurrency'])){$p['sizePricesByCurrency']=$old['sizePricesByCurrency'];$p['sizePricesByCurrency'][$p['currency']]=$p['sizePrices'];}$p['revision']=($old['revision']??0)+1;$db['products'][$p['id']]=$p;return $p;});respond(['product'=>$saved]);
    }
    if($action==='save-settings'){
        adminOnly();$s=['name'=>EjderShop::text($in['name']??'',150),'address'=>EjderShop::text($in['address']??'',700),'email'=>EjderShop::text($in['email']??'',254),'deliveryTr'=>EjderShop::text($in['deliveryTr']??'',500),'deliveryDe'=>EjderShop::text($in['deliveryDe']??'',500),'requestsOpen'=>($in['requestsOpen']??false)===true];
        if($s['email']!==''&&!filter_var($s['email'],FILTER_VALIDATE_EMAIL))throw new ShopError('invalid_email');
        if($s['requestsOpen']&&(!$s['name']||!$s['email']||!$s['address']||!$s['deliveryTr']||!$s['deliveryDe']))throw new ShopError('shop_details_required');
        $shop->transact(function(&$db)use($s){$db['settings']=$s;});respond(['ok'=>true]);
    }
    if($action==='quote')respond($shop->transact(fn(&$db)=>EjderShop::quote($db,$in['items']??[],$in['currency']??null)));
    if($action==='request'){
        $key=EjderShop::text($in['key']??'',64);if(!preg_match('/^[a-f0-9-]{20,64}$/D',$key))throw new ShopError('invalid_key');
        $name=EjderShop::text($in['name']??'',120);$email=EjderShop::text($in['email']??'',254);$country=$in['country']??'';$note=EjderShop::text($in['note']??'',1500);
        if(!$name||!filter_var($email,FILTER_VALIDATE_EMAIL)||!in_array($country,['DE','TR'],true)||($in['consent']??false)!==true)throw new ShopError('contact_required');if(!empty($in['website']))throw new ShopError('invalid_request');
        $result=$shop->transact(function(&$db)use($in,$key,$name,$email,$country,$note,$ip){
            if(!$db['settings']['requestsOpen'])throw new ShopError('orders_closed',409);
            $digest=hash_hmac('sha256',$key,$db['secret']);foreach($db['requests'] as $r)if($r['key']===$digest){if($r['email']!==$email)throw new ShopError('invalid_key');return ['id'=>$r['id'],'duplicate'=>true];}
            $q=EjderShop::quote($db,$in['items']??[],$in['currency']??null);
            if(($in['expectedTotal']??null)!==$q['total']||($in['currency']??null)!==$q['currency'])throw new ShopError('price_changed',409);
            if(count($db['requests'])>=10000)throw new ShopError('orders_closed',503);
            $id='EJ-'.gmdate('ymd').'-'.strtoupper(bin2hex(random_bytes(4)));
            $db['requests'][$id]=['id'=>$id,'key'=>$digest,'created'=>gmdate('c'),'status'=>'new','paid'=>false,'name'=>$name,'email'=>$email,'country'=>$country,'note'=>$note,'consentAt'=>gmdate('c'),'language'=>($in['language']??'')==='de'?'de':'tr']+$q;
            foreach($q['items'] as $line){if(!isset($db['stats'][$line['id']]))$db['stats'][$line['id']]=['views'=>0,'favorites'=>0,'requestedUnits'=>0];$db['stats'][$line['id']]['requestedUnits']+=$line['qty'];}
            return ['id'=>$id,'duplicate'=>false];
        });respond($result,201);
    }
    if($action==='event'){
        $id=EjderShop::text($in['id']??'',64);$kind=$in['kind']??'';if(!in_array($kind,['views','favorites'],true))throw new ShopError('invalid_event');
        if(empty($_SESSION['events'][$kind][$id])){$shop->transact(function(&$db)use($id,$kind){$p=$db['products'][$id]??null;if(!$p||$p['status']==='draft')throw new ShopError('not_found',404);if(!isset($db['stats'][$id]))$db['stats'][$id]=['views'=>0,'favorites'=>0,'requestedUnits'=>0];$db['stats'][$id][$kind]++;});$_SESSION['events'][$kind][$id]=true;}respond(['ok'=>true]);
    }
    if($action==='request-status'){
        adminOnly();$id=EjderShop::text($in['id']??'',40);$status=$in['status']??'';if(!in_array($status,['new','contacted','confirmed','production','shipped','cancelled'],true))throw new ShopError('invalid_status');
        $shop->transact(function(&$db)use($id,$status){if(!isset($db['requests'][$id]))throw new ShopError('not_found',404);$db['requests'][$id]['status']=$status;$db['requests'][$id]['updated']=gmdate('c');});respond(['ok'=>true]);
    }
    throw new ShopError('not_found',404);
}catch(ShopError $e){respond(['error'=>$e->getMessage()],$e->status);}catch(Throwable $e){error_log('EJDER shop server failure: '.get_class($e));respond(['error'=>'server_error'],503);}
