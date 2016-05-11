<?php

require_once("../config.php");

if (!isset($_SESSION["Username"])) {
    header("HTTP/1.0 401 Forbidden",true,401);
    exit(0);
}

session_write_close();
$collection = new MongoCollection($db, 'Camera');
$cursor = $collection->find(array('_id'=> new MongoId($_GET["cam_id"])));

if ($cursor->count()>0){
    foreach ($cursor as $cam) { 
        $camurl =   "http://".$cam['ip'].":".$cam['port']."/";

        if (isset($_GET["type"]) && $_GET["type"]=="video"){
            $campath =  $cam['path'];
            header('Content-type: multipart/x-mixed-replace; boundary=--myboundary');//"axis-cgi/mjpg/video.cgi";
        }else{
            $campath =  $cam['picture_path'];
            header('Content-type: image/jpeg');
        }
        $userpass = $cam['login'].":".$cam['password'];

        if (isset($_GET["res"])){
            $res=$_GET["res"];
        }else
            $res="320x240";

        while (@ob_end_clean()); 
        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, $camurl .$campath);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'resolution='.$res.'&camera=1');
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY | CURLAUTH_ANYSAFE );
        curl_setopt($ch, CURLOPT_USERPWD, $userpass);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $result = curl_exec($ch);
        echo $result;           
        curl_close($ch);
    }
}
$m->close();
?>