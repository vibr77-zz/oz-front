<?php
/***********************************
*
*
************************************/

require_once("../config.php");
include("../lib/ZwaveServer.php");

if (!isset($_SESSION["Username"])) {
       header("HTTP/1.0 401 Forbidden",true,401);
	   exit(0);
}
session_write_close();
$zwaveServer = new ZwaveServer($zw_host, $zw_port);
	
/* Methods :

1/ GET :
- setHeatingZoneStatus(Zone,Status)
- setHeatingMode(Mode)
- getHeatingMode()
- getHeatingZoneStatus()
- HeatingDeleteZone(zone_id)
- getHeatingSchedule(Zone)
- CreateNewZone()
- getHeatingZoneList()

2/ POST : 
- addHeatingVirtualDevice
- deleteHeatingvDevice
- getHeatingListofvDevice
- setHeatingZoneDetails
- setHeatingScheduleFullDay
- setHeatingScheduleQuarter
 */
		 
if (isset($_GET["Operation"])){

	switch ($_GET["Operation"]) {
		
		case  "setHeatingZoneMode":

			$collection = new MongoCollection($db, 'HeatingZone');
			$res=$collection->update(array('_id'=>new MongoId($_GET["zone_id"])),array('$set'=>array('mode'=>intval($_GET["mode"]))));

			$ar=array(	'method'=>'setHeatingZoneMode',
						'zone_id'=>$_GET["zone_id"],
						'mode'=>intval($_GET["mode"])
						);
			
			$req= json_encode($ar);
			$log->lwrite($req);
			$zwaveServer->send($req);	
    		$resp=$zwaveServer->read();
    		echo json_encode($resp);
			$log->lwrite("setHeatingZoneMode(Zone=".$_GET["zone_id"].",mode=".$_GET["mode"].")");
			break;

		case  "setHeatingZoneStatus":

			$collection = new MongoCollection($db, 'HeatingZone');
			$res=$collection->update(array('_id'=>new MongoId($_GET["zone_id"])),array('$set'=>array('status'=>intval($_GET["status"]))));

			$ar=array(	'method'=>'setHeatingZoneStatus',
						'zone_id'=>$_GET["zone_id"],
						'status'=>intval($_GET["status"])
						);
			
			$req= json_encode($ar);
			$log->lwrite($req);
			$zwaveServer->send($req);	
    		$resp=$zwaveServer->read();
    		echo json_encode($resp);
			$log->lwrite("setHeatingZoneStatus(Zone=".$_GET["zone_id"].",Status=".$_GET["status"].")");
			
			break;
		
		case "setHeatingMainMode":
			/* Global Heating Mode for All Zone */
			
			$log->lwrite("setHeatingMainMode(Mode=".$_GET["mode"].")");

			$collection = new MongoCollection($db, 'Heating');
			$res=$collection->update(array('heating'=>1),array('$set'=>array('heating'=>1,'mode'=>intval($_GET["mode"]))),array('upsert'=>true));

			//$res=$collection->update(array('heating'=>1),array('$set'=>array('mode'=>intval($_GET["mode"])),array('upsert'=>true)));
			
			$ar=array('method'=>'setHeatingMainMode',
					'mode'=>intval($_GET["mode"])
					);
			$req= json_encode($ar);
			$log->lwrite($req);
			$zwaveServer->send($req);	
    		$resp=$zwaveServer->read();
    		echo json_encode($resp);
			
			break;
		
		case "getHeatingMode":
			$log->lwrite("getHeatingMode()");
			
			$collection = new MongoCollection($db, 'Heating');
			$cursor=$collection->find();
			echo json_encode(iterator_to_array($cursor, false));
			break;
		
		case "HeatingDeleteZone":
			$collection = new MongoCollection($db, 'HeatingZone');
			$res=$collection->remove(array('_id'=>new MongoId($_GET["zone_id"])),array('justOne'=>true));
			$collection = new MongoCollection($db, 'HeatingSchedule');
			$res=$collection->remove(array('zone_id'=>$_GET["zone_id"]));
			break;
		
		case "getHeatingSchedule":
		  	$collection = new MongoCollection($db, 'HeatingSchedule');
			$cursor=$collection->find(array('zone_id'=>$_GET["zone_id"]));
			echo json_encode(iterator_to_array($cursor, false));
			break;
		
		case "setNewZone": /* instead of CreateNewZone*/
			$collection = new MongoCollection($db, 'HeatingZone');
			$cursor = $collection->find();
			$i=($cursor->count())+1;

			$new_zone=array('title'=>'New zone '.$i,'creation_date'=>new MongoDate());
			$res=$collection->insert($new_zone);
			
		  	echo json_encode("1");
			break;
		
		case "getHeatingZone":
			$log->lwrite("getHeatingZoneList()");
			$collection = new MongoCollection($db, 'HeatingZone');
			$cursor = $collection->find();
			echo json_encode(iterator_to_array($cursor, false));
			break;
	}
}

if (!isset($_POST["Operation"])){
	$m->close();
	return;
}

switch ($_POST["Operation"]) {
	case "addHeatingVirtualDevice":
		$collection = new MongoCollection($db, 'HeatingZone');
		$res = $collection->update(array('_id'=>new MongoId($_POST["zone_id"])),
								   array('$addToSet'=>array('vdevice_id'=>$_POST["vdevice_id"])),
								   array('upsert'=>true));
		$log->lwrite("res :".json_encode($res));
		break;
		
		$res="<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>addHeatingVirtualDevice</method><results><status>1</status></results></response>";	 
		echo $res;
		break;
		
	case "deleteHeatingvDevice":
		$log->lwrite("deleteHeatingvDevice(Zone=".$_POST["Zone"].",Device_id=".$_POST["Device_id"].")");
		$collection = new MongoCollection($db, 'HeatingZone');
		$res = $collection->update(array('_id'=>new MongoId($_POST["zone_id"])),
								   array('$pull'=>array('vdevice_id'=>$_POST["vdevice_id"])),
								   array('upsert'=>true));
		$log->lwrite("res :".json_encode($res));
		echo json_encode("OK");
		break;
		
	case "setHeatingZoneDetails":
		$collection = new MongoCollection($db, 'HeatingZone');
		$res=$collection->update(array('_id'=>new MongoId($_POST['zone_id'])),array('title'=>$_POST["title"]));
		echo json_encode("1");	
		break;
	
	case "setHeatingScheduleFullDay":
		$log->lwrite("setHeatingScheduleFullDay(xml)");
		
		$xml = simplexml_load_string($_POST["Content"]);
		$result=$xml->xpath('//q');
		foreach ($result as $q) {
			$log->lwrite("setHeatingScheduleQuarter($q)");
			$arr=explode("-", $q->attributes()->id);
			$min=$arr[2]*15;
		
			$collection = new MongoCollection($db, 'HeatingSchedule');
			$new_quarter=array('zone_id'=>$_POST["zone_id"],
							'dow'=>intval($arr[0]),
							'hour'=>intval($arr[1]),
							'min'=>intval($min),
							'status'=>intval($q),
							'creation_date'=>new MongoDate());
		
			$res=$collection->update(array('zone_id'=>$_POST["zone_id"],'dow'=>intval($arr[0]),'hour'=>intval($arr[1]),'min'=>intval($min)),$new_quarter,array('upsert'=>true));	
		}
		echo json_encode("1");	
		break;
	
	case "setHeatingScheduleQuarter":
		$log->lwrite("setHeatingScheduleQuarter(|)");
		
		$arr=explode("-", $_POST["Key"]);
		$min=$arr[2]*15;
		$collection = new MongoCollection($db, 'HeatingSchedule');
		$new_quarter=array('zone_id'=>$_POST["zone_id"],
							'dow'=>intval($arr[0]),
							'hour'=>intval($arr[1]),
							'min'=>intval($min),
							'status'=>intval($_POST["Mode"]),
							'creation_date'=>new MongoDate());
		
		$res=$collection->update(array('zone_id'=>$_POST["zone_id"],'dow'=>intval($arr[0]),'hour'=>intval($arr[1]),'min'=>intval($min)),$new_quarter,array('upsert'=>true));
		echo json_encode("1");
		break;
	}
$m->close();
?>
