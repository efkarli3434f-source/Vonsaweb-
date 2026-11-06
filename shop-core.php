<?php
declare(strict_types=1);
// Shared server-side rules. No client-submitted price or role is trusted.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {http_response_code(404); exit;}
// Private folders live next to the site folder (preferred). Hosting plans whose domain points at the
// webspace root cannot write there; then a folder inside the site is used, blocked by .htaccess and
// holding only PHP files that answer 404. Existing data next to the site always wins.
function ejderPrivateDir(string $name): string {
    $outside=dirname(__DIR__).'/'.$name; $inside=__DIR__.'/'.$name;
    if (@is_dir($outside)) return $outside;
    if (@is_dir($inside)) return $inside;
    return @is_writable(dirname(__DIR__)) ? $outside : $inside;
}
function ejderConfigFile(string $file): string {
    foreach ([dirname(__DIR__), __DIR__] as $base) { $path=$base.'/EJDER_CONFIG/'.$file; if (@is_file($path)) return $path; }
    return dirname(__DIR__).'/EJDER_CONFIG/'.$file;
}
// Same-site check for state-changing requests: the live domain (with or without www) or the host serving this request.
function ejderOriginAllowed(): bool {
    $origin=(string)($_SERVER['HTTP_ORIGIN'] ?? ''); $host=strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    $allowed=['https://ejderstudio.com','https://www.ejderstudio.com'];
    if ($host!=='' && preg_match('/^[a-z0-9.-]+(:[0-9]{1,5})?$/',$host)) $allowed[]='https://'.$host;
    return in_array($origin,$allowed,true);
}
final class ShopError extends RuntimeException {public int $status; public function __construct(string $code,int $status=400){parent::__construct($code);$this->status=$status;}}
final class EjderShop {
    private string $dir;
    private const PREFIX="<?php http_response_code(404); exit; ?>\n";
    public function __construct(string $dir){
        $this->dir=$dir;
        if (!is_dir($dir) && !mkdir($dir,0700,true) && !is_dir($dir)) throw new ShopError('storage_unavailable',503);
        if (!is_file($dir.'/.htaccess') && file_put_contents($dir.'/.htaccess',"Require all denied\n")===false) throw new ShopError('storage_unavailable',503);
    }
    // The first 12-model case list becomes the current catalogue once, unless the owner edited it.
    private const LEGACY_CASE_MODELS=['Google Pixel 9','Huawei Pura 80 Pro','Motorola Edge 60 Pro','Samsung Galaxy S24','Samsung Galaxy S26 Ultra','Xiaomi 17','Xiaomi 17 Ultra','Xiaomi Redmi Note 13 5G','iPhone 16','iPhone 16 Pro Max','iPhone 17','iPhone 17 Pro Max'];
    private static function upgradeCaseModels(array &$db): void {
        if (!isset($db['products']) || !is_array($db['products'])) return;
        $current=null;
        foreach ($db['products'] as $key=>$p) {
            if (!is_array($p) || ($p['type']??'')!=='case' || !is_array($p['models']??null)) continue;
            $models=$p['models'];sort($models,SORT_STRING);
            if ($models!==self::LEGACY_CASE_MODELS) continue;
            if ($current===null) {
                $seed=json_decode((string)@file_get_contents(__DIR__.'/shop-seed.json'),true);
                $current=is_array($seed)&&is_array($seed['case']['models']??null)?array_values(array_filter($seed['case']['models'],'is_string')):[];
            }
            if (count($current)>count($models)) $db['products'][$key]['models']=$current;
        }
    }
    public function transact(callable $fn){
        $lock=fopen($this->dir.'/lock.php','c+b');if(!$lock||!flock($lock,LOCK_EX)) throw new ShopError('storage_unavailable',503);
        try {
            $path=$this->dir.'/store.php';$raw=is_file($path)?file_get_contents($path):false;
            if($raw!==false){if(strncmp($raw,self::PREFIX,strlen(self::PREFIX))!==0)throw new ShopError('storage_invalid',503);$db=json_decode(substr($raw,strlen(self::PREFIX)),true,32,JSON_THROW_ON_ERROR);}
            else $db=['version'=>1,'secret'=>bin2hex(random_bytes(32)),'admin'=>null,'products'=>json_decode(file_get_contents(__DIR__.'/shop-seed.json'),true,16,JSON_THROW_ON_ERROR),'requests'=>[],'rate'=>[], 'stats'=>[],'settings'=>['requestsOpen'=>false,'email'=>'','name'=>'','address'=>'','deliveryTr'=>'','deliveryDe'=>'']];
            $before=json_encode($db);self::upgradeCaseModels($db);$result=$fn($db);
            if($before!==json_encode($db)||$raw===false){
                $data=self::PREFIX.json_encode($db,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
                if(strlen($data)>20000000)throw new ShopError('storage_full',503);
                $tmp=$path.'.'.bin2hex(random_bytes(8)).'.php';
                if(file_put_contents($tmp,$data,LOCK_EX)!==strlen($data)){@unlink($tmp);throw new ShopError('storage_unavailable',503);}
                chmod($tmp,0600);if(!rename($tmp,$path)){@unlink($tmp);throw new ShopError('storage_unavailable',503);}
            }
            return $result;
        }finally{flock($lock,LOCK_UN);fclose($lock);}
    }
    public static function text($v,int $max=150):string {if(!is_string($v)||strlen($v)>$max*4||preg_match('//u',$v)!==1)throw new ShopError('invalid_text');return trim(preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f]/u','',$v));}
    public static function strings($v,int $max=30):array {if(!is_array($v)||count($v)>$max)throw new ShopError('invalid_options');$out=[];foreach($v as $s){$s=self::text($s,50);if($s!=='')$out[]=$s;}return array_values(array_unique($out));}
    public static function cents($v,bool $nullable=false):?int {if($nullable&&$v===null)return null;if(!is_int($v)||$v<1||$v>100000000)throw new ShopError('invalid_price');return $v;}
    public static function product(array $p):array {
        $id=$p['id']??'';if(!is_string($id)||!preg_match('/^[a-z0-9-]{3,64}$/D',$id))throw new ShopError('invalid_product');
        $type=$p['type']??'';if(!in_array($type,['shirt','hoodie','case','mug','cushion','tote','poster','keychain','giftbox'],true))throw new ShopError('invalid_type');
        $status=$p['status']??'draft';if(!in_array($status,['draft','showcase','published'],true))throw new ShopError('invalid_status');
        $titleTr=self::text($p['titleTr']??'',120);$titleDe=self::text($p['titleDe']??'',120);if($titleTr===''||$titleDe==='')throw new ShopError('title_required');
        $price=self::cents($p['price']??null,true);if($status==='published'&&$price===null)throw new ShopError('price_required');
        $currency=$p['currency']??'EUR';if(!in_array($currency,['EUR','TRY'],true))throw new ShopError('invalid_currency');
        $sizes=self::strings($p['sizes']??[]);$colors=self::strings($p['colors']??[]);$models=self::strings($p['models']??[]);
        if(in_array($type,['shirt','hoodie'],true)&&!$sizes)throw new ShopError('sizes_required');
        if($type==='case'&&!$models)throw new ShopError('models_required');
        $sizePrices=[];if(!is_array($p['sizePrices']??[]))throw new ShopError('invalid_price');foreach(($p['sizePrices']??[]) as $size=>$value){if(!in_array((string)$size,$sizes,true))throw new ShopError('invalid_size');$sizePrices[(string)$size]=self::cents($value);}
        $prices=[];$rawPrices=$p['prices']??[];
        if(!is_array($rawPrices)||array_diff(array_keys($rawPrices),['EUR','TRY']))throw new ShopError('invalid_currency');
        foreach(['EUR','TRY'] as $code)$prices[$code]=self::cents($rawPrices[$code]??null,true);
        $prices[$currency]=$price;
        $sizePricesByCurrency=[];$rawSizes=$p['sizePricesByCurrency']??[];
        if(!is_array($rawSizes)||array_diff(array_keys($rawSizes),['EUR','TRY']))throw new ShopError('invalid_currency');
        foreach(['EUR','TRY'] as $code){
            $entries=$rawSizes[$code]??[];if(!is_array($entries))throw new ShopError('invalid_price');$clean=[];
            foreach($entries as $size=>$value){if(!in_array((string)$size,$sizes,true))throw new ShopError('invalid_size');$clean[(string)$size]=self::cents($value);}
            if($code!==$currency&&$clean&&$prices[$code]===null)throw new ShopError('price_required');
            $sizePricesByCurrency[$code]=$code===$currency?$sizePrices:$clean;
        }
        $images=self::strings($p['images']??[],6);foreach($images as $img)if(!preg_match('/^[a-f0-9]{32}$/D',$img))throw new ShopError('invalid_image');
        $fallback=$p['fallback']??$type;if(!preg_match('/^(?:shirt|hoodie|case|mug|cushion|tote|poster|keychain|giftbox|case-[a-z0-9-]+)$/D',$fallback))throw new ShopError('invalid_image');
        $rank=$p['rank']??0;if(!is_int($rank)||$rank<0||$rank>10000)throw new ShopError('invalid_rank');
        return compact('id','type','status','titleTr','titleDe','price','currency','sizes','colors','models','sizePrices','prices','sizePricesByCurrency','images','fallback','rank')+['descriptionTr'=>self::text($p['descriptionTr']??'',3000),'descriptionDe'=>self::text($p['descriptionDe']??'',3000),'revision'=>0];
    }
    public static function publicProducts(array $db):array {$out=array_values(array_filter($db['products'],fn($p)=>in_array($p['status'],['showcase','published'],true)));usort($out,fn($a,$b)=>($a['rank']<=>$b['rank'])?:strcmp($a['id'],$b['id']));return $out;}
    public static function unitPrice(array $p,string $currency,string $size=''):?int {
        if($currency===$p['currency'])return $p['sizePrices'][$size]??$p['price'];
        if(($p['prices'][$currency]??null)===null)return null;
        return $p['sizePricesByCurrency'][$currency][$size]??$p['prices'][$currency];
    }
    public static function quote(array $db,array $items,$selectedCurrency=null):array {
        if($selectedCurrency!==null&&!in_array($selectedCurrency,['EUR','TRY'],true))throw new ShopError('invalid_currency');
        if(!$items||count($items)>30)throw new ShopError('invalid_cart');$out=[];$currency=null;$total=0;
        foreach($items as $line){
            if(!is_array($line))throw new ShopError('invalid_cart');$id=self::text($line['id']??'',64);$p=$db['products'][$id]??null;
            if(!$p||$p['status']!=='published'||$p['price']===null)throw new ShopError('product_unavailable',409);
            $qty=$line['qty']??0;if(!is_int($qty)||$qty<1||$qty>99)throw new ShopError('invalid_quantity');
            $selected=[];foreach(['size'=>'sizes','color'=>'colors','model'=>'models'] as $key=>$opts){$v=self::text($line[$key]??'',50);if(($p[$opts]&&!in_array($v,$p[$opts],true))||(!$p[$opts]&&$v!==''))throw new ShopError('invalid_'.$key);$selected[$key]=$v;}
            $lineCurrency=$selectedCurrency??$p['currency'];
            if($currency!==null&&$currency!==$lineCurrency)throw new ShopError('mixed_currency');$currency=$lineCurrency;
            $unit=self::unitPrice($p,$currency,$selected['size']);if($unit===null)throw new ShopError('currency_unavailable',409);
            $subtotal=$unit*$qty;$total+=$subtotal;
            $out[]=['id'=>$id,'titleTr'=>$p['titleTr'],'titleDe'=>$p['titleDe'],'qty'=>$qty,'unit'=>$unit,'subtotal'=>$subtotal,'revision'=>$p['revision']]+$selected;
        }
        return ['items'=>$out,'currency'=>$currency,'total'=>$total,'shippingIncluded'=>false];
    }
    public static function limited(array &$db,string $key,int $limit,int $window):bool {
        $now=time();foreach($db['rate'] as $k=>$v)if($v['until']<$now)unset($db['rate'][$k]);
        if(!isset($db['rate'][$key]))$db['rate'][$key]=['n'=>0,'until'=>$now+$window];
        if($db['rate'][$key]['n']>=$limit)return true;$db['rate'][$key]['n']++;return false;
    }
    public static function base32(string $bytes):string {$bits='';foreach(str_split($bytes) as $b)$bits.=str_pad(decbin(ord($b)),8,'0',STR_PAD_LEFT);$out='';foreach(str_split($bits,5) as $b)$out.='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[bindec(str_pad($b,5,'0'))];return $out;}
    public static function otp(string $secret,int $counter):string {
        $bits='';foreach(str_split($secret) as $c){$n=strpos('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',$c);if($n===false)throw new ShopError('invalid_secret');$bits.=str_pad(decbin($n),5,'0',STR_PAD_LEFT);}
        $bytes='';foreach(str_split($bits,8) as $b)if(strlen($b)===8)$bytes.=chr(bindec($b));
        $hash=hash_hmac('sha1',pack('N2',0,$counter),$bytes,true);$offset=ord($hash[19])&15;$v=unpack('N',substr($hash,$offset,4))[1]&0x7fffffff;return str_pad((string)($v%1000000),6,'0',STR_PAD_LEFT);
    }
    public static function verifyOtp(string $secret,string $code,int $last=-1):?int {if(!preg_match('/^[0-9]{6}$/D',$code))return null;$c=(int)floor(time()/30);foreach([$c,$c-1,$c+1] as $step)if($step>$last&&hash_equals(self::otp($secret,$step),$code))return $step;return null;}
    public function imagePath(string $id):string {if(!preg_match('/^[a-f0-9]{32}$/D',$id))throw new ShopError('invalid_image');return $this->dir.'/image-'.$id.'.php';}
    public function saveImage(string $tmp):string {
        if(!function_exists('imagecreatefromstring')||!is_file($tmp)||filesize($tmp)>6000000)throw new ShopError('image_upload_unavailable');
        $info=@getimagesize($tmp);if(!$info||!in_array($info['mime'],['image/jpeg','image/png','image/webp'],true)||$info[0]*$info[1]>24000000)throw new ShopError('invalid_image');
        $src=@imagecreatefromstring(file_get_contents($tmp));if(!$src)throw new ShopError('invalid_image');
        $ratio=min(1,1600/max($info[0],$info[1]));$w=max(1,(int)round($info[0]*$ratio));$h=max(1,(int)round($info[1]*$ratio));$dest=imagecreatetruecolor($w,$h);imagefill($dest,0,0,imagecolorallocate($dest,255,255,255));imagecopyresampled($dest,$src,0,0,0,0,$w,$h,$info[0],$info[1]);
        ob_start();imagejpeg($dest,null,86);$jpg=ob_get_clean();imagedestroy($src);imagedestroy($dest);
        $id=bin2hex(random_bytes(16));if(file_put_contents($this->imagePath($id),self::PREFIX.$jpg,LOCK_EX)===false)throw new ShopError('storage_unavailable',503);chmod($this->imagePath($id),0600);return $id;
    }
    public function readImage(string $id):string {$p=$this->imagePath($id);if(!is_file($p))throw new ShopError('not_found',404);$raw=file_get_contents($p);return substr($raw,strlen(self::PREFIX));}
}
