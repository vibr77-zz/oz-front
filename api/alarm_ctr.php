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

$zwaveServer = new ZwaveServer($zw_host, $zw_port);
				 
if (isset($_GET["Operation"])){

	switch ($_GET["Operation"]) {
		case "getAlarm":
			$collection = new MongoCollection($db, 'Alarm');
			$cursor = $collection->find();
			echo json_encode(iterator_to_array($cursor, false));
			break;		
			
		case "setAlarmActivationChange":
			$collection = new MongoCollection($db, 'AlarmEntry');
			$cursor = $collection->find(array('$or' => array(
  													array("type" => "SC_ACTIVATION"),
  													array("type" => "SC_DEACTIVATION")
												)));
			$ret['status']='ko';
			foreach ($cursor as $res) {	
				if (md5($res['code'])==$_GET["Code"]){
					$collection = new MongoCollection($db, 'Alarm');
					if ($res['type']=='SC_ACTIVATION'){
						$res_activation=$collection->update(array('execution_mode'),array('execution_mode'=>1),array('upsert'=>true));
					}else{
						$res_activation=$collection->update(array('execution_mode'),array('execution_mode'=>0),array('upsert'=>true));
					}
				$ret['status']='ok';
				}
			}
			echo json_encode($ret);
			break;

		case "getAlarmEntry":
			$collection = new MongoCollection($db, 'AlarmEntry');
			$regex = new MongoRegex("/".$_GET["prefix"]."$/i");
			$cursor = $collection->find(array('type'=>$regex));
			echo json_encode(iterator_to_array($cursor, false));
			break;			
	}
}

if (!isset($_POST["Operation"]))
	return;

switch ($_POST["Operation"]) {
	case "deleteAlarmEntry":
		$collection = new MongoCollection($db, 'AlarmEntry');
		$res=$collection->remove(array('_id'=>new MongoId($_POST['alarm_item_id'])),array('justOne'=>true));
		break;

	case "setAlarmEntry":
		$collection = new MongoCollection($db, 'AlarmEntry');
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

			$res = $collection->update(array('_id'=>new MongoId($_POST['alarm_item_id'])),$_POST);
			$_POST['_id']=new MongoId($_POST['alarm_item_id']);
		}
		else{
			unset($_POST['is_new']);
			unset($_POST['alarm_item_id']);
			$res = $collection->insert($_POST);
		}
		echo json_encode($_POST);
		break;	   
}

function startsWith($haystack, $needle) {
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

function endsWith($haystack, $needle) {
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

function iterateAlarmEntry($scene_id,$parent_key){
	$log = new Logging();
	$log->lfile('/tmp/mylog.txt');

	$m = new MongoClient();
	$db = $m->selectDB('oz');

	$collection = new MongoCollection($db, 'AlarmEntry');
	$cursor=$collection->find(array('scene_id'=> $scene_id,'parent_key'=>$parent_key));
	$array_return=array();
	foreach ($cursor as $res) {
		if (endsWith($res['type'],'_COND')){
			$res['entry']=iterateSpellEntry($scene_id, (string) $res["_id"]);
		}
		array_push($array_return,$res);
	}
	$m->close();
	return $array_return;	
}

function iterateDeleteAlarmEntry($alarm_item_id,$parent_key){
	$log = new Logging();
	$log->lfile('/tmp/mylog.txt');

	$m = new MongoClient();
	$db = $m->selectDB('oz');

	$collection = new MongoCollection($db, 'AlarmEntry');
	$collection->remove(array('_id'=>new MongoId($alarm_item_id)),array('justOne'=>true));
	$m->close();
	return;
}
$m->close();
?>
