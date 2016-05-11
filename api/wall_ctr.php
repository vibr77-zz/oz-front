<?php
/***********************************
*
*
************************************/

require_once("../config.php");
include("../lib/ZwaveServer.php");

/*if (!isset($_SESSION["Username"])) {
	header("HTTP/1.0 401 Forbidden",true,401);
	exit(0);
}*/
session_write_close();

$zwaveServer = new ZwaveServer($zw_host, $zw_port);
	
/* Methods :

*/

if (isset($_GET["Operation"])){
	$log->lwrite("GET Method:".$_GET["Operation"]);
	switch ($_GET["Operation"]) {
		case "getWallEvents":
			$collection = new MongoCollection($db, 'DeviceEvent');
			$count=intval($_GET["count"]);
			$cursor = $collection->find(array('device_id'=>intval($_GET["device_id"])))->sort(array('event_time'=>-1))->limit($count);
			echo json_encode(iterator_to_array($cursor, false));
		 	break;
	}
}

if (!isset($_POST["Operation"])){
	$m->close();
	return;
}

$log->lwrite("POST Method:".$_POST["Operation"]);

switch ($_POST["Operation"]) {
	case "setDeviceConfigParam":
		
    	break;
}

?>