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

1/ GET :
-getConfigFromZwaveDaemon


2/ POST : 
-setVirtualDeviceActionEntry


 */


if (isset($_GET["Operation"])){
	$log->lwrite("GET Method:".$_GET["Operation"]);
	switch ($_GET["Operation"]){
		case "getReportValues":
			$collection = new MongoCollection($db, 'DeviceEvent');
			$cursor=$collection->find(array('device_id'=> 38,'command_class_int'=>50,'instance'=>1,'indx'=>8));
			$cursor->sort(array('_id' => 1));
			$array_return=array();

			foreach ($cursor as $res) {
				$tmp=null;
				$tmp["value"]=intval($res['value']);
				$tmp["period"]=$res['event_time'];
					//$res['entry']=iterateSpellEntry($scene_id, (string) $res["_id"]);
				array_push($array_return,$tmp);
			}
	
			echo json_encode($array_return);;	
		break;
	}
}

$m->close();
?>