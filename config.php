<?php

require_once("lib/logclass.php");
session_start();
error_reporting(E_ALL);

//z-wave server settings
define("ZWAVE_HOST", "127.0.0.1");
define("ZWAVE_PORT", 8888);
define('ROOT_PATH','/var/www/oz/');
//define('ROOT_PATH','/Users/vincent/Sites/oz3');
//Database settings

//Cookie expire after a month
define("EXPIRE", time() + 60 * 60 * 24 * 30);

//Page settings

define("URI", $_SERVER["SERVER_NAME"]);

//skip login if chosen to keep signed in
/*if (isset($_COOKIE["SignedIn"])) {
    $_SESSION["UserId"] = $_COOKIE["UserId"];
    $_SESSION["Username"] = $_COOKIE["Username"];
}*/

//redrirect to login if user is not logged in
/*
if (!isset($_SESSION["Username"])) {
    if (substr($_SERVER["SCRIPT_NAME"], strrpos($_SERVER["SCRIPT_NAME"], "/") + 1) != "login.php")
        header("location:login.php");
}
*/
$settings = parse_ini_file(ROOT_PATH.'/dbconfig.ini.php');
//$dbh = new PDO("mysql:host=".$settings['db_host'].";dbname=".$settings['db_name'], $settings['db_login'], $settings['db_pass']);


$m = new MongoClient();
$db = $m->selectDB('oz');
$zw_host="127.0.0.1";
$zw_port=8888;
/*
if (!isset($_SESSION['zw_host'])|| !isset($_SESSION['zw_port'])){

	$SQL_SELECT="select * from tbl_system_params where param_domain='ZWAVE_SERVER' and param_name='zwave_host'";
	$sth = $dbh->prepare($SQL_SELECT);
	$sth->execute();
	
	$row =  $sth->fetch(PDO::FETCH_ASSOC);
	$zw_host=$row['param_value'];
	
	$SQL_SELECT="select * from tbl_system_params where param_domain='ZWAVE_SERVER' and param_name='zwave_port'";
	$sth = $dbh->prepare($SQL_SELECT);
	$sth->execute();
	$row =  $sth->fetch(PDO::FETCH_ASSOC);
	$zw_port=$row['param_value'];
	
	$_SESSION['zw_port']=$zw_port;
	$_SESSION['zw_host']=$zw_host;
}else{
	$zw_port=$_SESSION['zw_port'];
	$zw_host=$_SESSION['zw_host'];	
}*/


$LANG ='en_FR';

$log = new Logging();
$log->lfile('/tmp/mylog.txt');

?>
