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
-getVirtualDeviceStates
-getVirtualDevicesList
-getVirtualDevicesWithState
2/ POST : 
-MoveVdevice
-setStateEntry
-setVirtualDevice
-deleteVirtualDevice
-deleteState
-createState
-setState
-createVirtualDevice
-getStateEntry
-ExecuteVirtualDeviceState
-deleteStateEntry
 */

if (isset($_GET["Operation"])){
	$log->lwrite("GET Method:".$_GET["Operation"]);
	switch ($_GET["Operation"]){
		case "getVirtualDeviceStates":
			$collection = new MongoCollection($db, 'VdeviceState');
			$cursor = $collection->find(array('vdevice_id'=>$_GET["vdevice_id"]));
			echo json_encode(iterator_to_array($cursor, false));  
			break;
		  
		case "getVirtualDevicesList":
		  	$collection = new MongoCollection($db, 'Vdevice');
		  	$cursor = $collection->find();
			echo json_encode(iterator_to_array($cursor, false));
			break;
		
		case "getVirtualDevicesWithState":
			$log->lwrite("GET getVirtualDevicesWithState starting");
		  	$collection = new MongoCollection($db, 'Vdevice');
			$cursor = $collection->find(array());
			$arr_return=array();
			foreach ($cursor as $res) {
				
				$collection_room=new MongoCollection($db, 'Room');
				$cusror_room=$collection_room->find(array('_id'=>new MongoId($res['room_id'])));
				foreach($cusror_room as $res_room){
					$res['zone']=$res_room['title'];
				}

				$collection_state = new MongoCollection($db, 'VdeviceState');
				$cursor_state = $collection_state->find(array('vdevice_id'=>(string)$res['_id']));
				$arr_state=array();
				foreach($cursor_state as $res_state){
					array_push($arr_state,$res_state);
				}
				
				$res['state']=$arr_state;
				array_push($arr_return,$res);
			}
			echo json_encode($arr_return);
			//$log->lwrite("GET getVirtualDevicesWithState result:".json_encode($arr_return));
			break;
		default:
			$log->lwrite("GET Unknown Method:".$_GET["Operation"]);	
			break;

	}
}else if(isset($_POST["Operation"])){
	$log->lwrite("POST Method:".$_POST["Operation"]);
	switch ($_POST["Operation"]) {
		case "MoveVdevice":
		  	$log->lwrite("MoveScene(way=".$_POST["way"].",sorder=".$_POST["sorder"].")");
			$res="<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>MoveVdevice</method><results>";
			
			$data=array("sorder"=>$_POST["sorder"]);
			if ($_POST["way"]=="UP"){
				$SQL_SELECT="select sorder from tbl_vdevice where sorder<:sorder and room_id=:room_id order by sorder DESC limit 0,1";
			}else{
				$SQL_SELECT="select sorder from tbl_vdevice where sorder>:sorder and room_id=:room_id order by sorder ASC limit 0,1";
			}
			
			$sth = $dbh->prepare($SQL_SELECT);
			$sth->bindParam(':sorder', $_POST["sorder"], PDO::PARAM_INT);
			$sth->bindParam(':room_id', $_POST["room_id"], PDO::PARAM_INT);
			$sth->execute();
			
			$row =  $sth->fetch(PDO::FETCH_ASSOC);
			
			$QUERY_UPDATE_1="update tbl_vdevice set sorder=999 where sorder=:rsorder";
			$QUERY_UPDATE_2="update tbl_vdevice set sorder=:rsorder where sorder=:gsorder";
			$QUERY_UPDATE_3="update tbl_vdevice set sorder=:gsorder where sorder=999";
			
			$sth = $dbh->prepare($QUERY_UPDATE_1);
			$sth->bindParam(":rsorder",$row['sorder'], PDO::PARAM_INT);
			$sth->execute();
			
			$sth = $dbh->prepare($QUERY_UPDATE_2);
			$sth->bindParam(":gsorder",$_POST["sorder"], PDO::PARAM_INT);
			$sth->bindParam(":rsorder",$row['sorder'], PDO::PARAM_INT);
			$sth->execute();
			
			$sth = $dbh->prepare($QUERY_UPDATE_3);
			$sth->bindParam(":gsorder",$_POST["sorder"], PDO::PARAM_INT);
			$sth->execute();
				
		  	$res.="<status>1</status></results></response>";
			echo $res;
		  	break;
	
		case "setStateEntry":
			$collection = new MongoCollection($db, 'VdeviceStateEntry');
			$array_return=array();
			unset($_POST['Operation']);
			unset($_POST['current_coll']);
			unset($_POST['widget_type']);
			unset($_POST['block_color']);
			unset($_POST['sub_coll']);
			
			if ($_POST['is_new']!='true'){
				unset($_POST['is_new']);
				unset($_POST['_id']);
				unset($_POST['entry']);

				$res = $collection->update(array('_id'=>new MongoId($_POST['state_item_id']),'state_id'=>$_POST['state_id']),$_POST);
				$_POST['_id']=new MongoId($_POST['state_item_id']);
			}else{
				unset($_POST['is_new']);
				unset($_POST['state_item_id']);
				$res = $collection->insert($_POST);
			}
			echo json_encode($_POST);
			break; 

		case "setVirtualDevice":
			$collection = new MongoCollection($db, 'Vdevice');
			unset($_POST['Operation']);
			unset($_POST['_id']);
			$res = $collection->update(array('_id'=>new MongoId($_POST['vdevice_id'])),$_POST);
			break;

		case "deleteVirtualDevice":
			$collection = new MongoCollection($db, 'Vdevice');
			$res = $collection->remove(array('_id'=>new MongoId($_POST['vdevice_id'])));

			$collection = new MongoCollection($db, 'VdeviceState');
			$res = $collection->remove(array('vdevice_id'=>$_POST['vdevice_id']));

			$collection = new MongoCollection($db, 'VdeviceStateEntry');
			$res = $collection->remove(array('vdevice_id'=>$_POST['vdevice_id']));
			break;
		
		case "deleteState":

			$collection = new MongoCollection($db, 'VdeviceState');
			$res = $collection->remove(array('_id'=> new MongoId($_POST['state_id'])));

			$collection = new MongoCollection($db, 'VdeviceStateEntry');
			$res = $collection->remove(array('state_id'=>$_POST['state_id']));
			break;

		case "createState":
			$collection = new MongoCollection($db, 'VdeviceState');
			$cursor = $collection->find();
			$i=($cursor->count())+1;
			
			$new_vdevice=array('state_title'=>'State '.$i,'sorder'=>$i,'vdevice_id'=>$_POST["vdevice_id"]);
			$collection->insert($new_vdevice);
			echo json_encode($new_vdevice);
			break;

		case "setState":
			$collection = new MongoCollection($db, 'VdeviceState');
			unset($_POST['Operation']);
			unset($_POST['_id']);
			$res = $collection->update(array('_id'=>new MongoId($_POST['state_id'])),$_POST);
			break;
			
		case "createVirtualDevice":
			$collection = new MongoCollection($db, 'Vdevice');
			$cursor = $collection->find();
			$i=($cursor->count())+1;
			
			$new_vdevice=array('title'=>'Vdevice '.$i,'sorder'=>$i,'room_id'=>$_POST['room_id']);
			$collection->insert($new_vdevice);
			echo json_encode($new_vdevice);
			break;
			
		case "getStateEntry":
			$collection = new MongoCollection($db, 'VdeviceStateEntry');
			$cursor=$collection->find(array('state_id'=>$_POST['state_id']));
			$array_return=array();
			foreach ($cursor as $res) {
				array_push($array_return,$res);
			}
			echo json_encode($array_return);
			break;
		
		case "executeVirtualDeviceState":
			$log->lwrite("executeVirtualDeviceState(vdevice_id=".$_POST["vdevice_id"].")");
			$ar=array(	'method'=>'executeVirtualDeviceState',
						'vdevice_id'=>$_POST["vdevice_id"],
						'state_id'=>$_POST["state_id"],
						);
			$req= json_encode($ar);
			$log->lwrite($req);

	    	$zwaveServer->send($req);
	    	$resp=$zwaveServer->read();
			echo json_encode($resp);
			break;

		case "deleteStateEntry":
			iterateDeleteStateEntry($_POST['state_id'],$_POST['state_item_id']);
			$collection = new MongoCollection($db, 'VdeviceStateEntry');
			$res=$collection->remove(array('state_id'=>new MongoId($_POST['state_id'])));
			break;
		default:
			$log->lwrite("POST Unknown Method:".$_POST["Operation"]);	
			break;
	}
}
$m->close();

function iterateDeleteStateEntry($state_id,$parent_key){
	$log = new Logging();
	$log->lfile('/tmp/mylog.txt');

	$m = new MongoClient();
	$db = $m->selectDB('oz');
	$log->lwrite("shere scene_id=".$state_id." parent=".$parent_key);
	$collection = new MongoCollection($db, 'VdeviceStateEntry');
	$cursor=$collection->find(array('state_id'=> $state_id,'parent_key' =>$parent_key));
	
	foreach ($cursor as $res) {
		if (endsWith($res['type'],'_COND')){
			$log->lwrite("going in : ".json_encode($res));
			$res['entry']=iterateStateEntry($state_id, (string) $res["_id"]);
		}
		$collection->remove(array('_id'=>$res['_id']),array('justOne'=>true));
	}
	$m->close();	
}
?>
