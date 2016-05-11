<?php

require_once("../config.php");
include("../lib/ZwaveServer.php");
include("../lib/cmdclass.php");
include("../lib/FreemoteApi.php");


if (!isset($_SESSION["Username"])) {
	header("HTTP/1.0 401 Forbidden",true,401);
	exit(0);
}
session_write_close();

$zwaveServer = new ZwaveServer($zw_host, $zw_port);
	
/* Methods :

1/ GET :
-RunSpell
-MoveAction
-MoveSpell
-deleteSpell
-createSpell
-getSpells

2/ POST :
-getSpellEntry
-deleteSpellEntry
-setSpellEntry
*/	
					 
if (isset($_GET["Operation"])){	
	switch ($_GET["Operation"]) {
		case "executeSpell":
			$log->lwrite("executeSpell(spell_id=".$_GET["spell_id"].")");
			$ar=array(	'method'=>'executeSpell',
						'spell_id'=>$_GET["spell_id"]
						);
			$req= json_encode($ar);
			$log->lwrite($req);

	    	$zwaveServer->send($req);
	    	$resp=$zwaveServer->read();
	    	echo json_encode($resp);
		  	break;
		  	
		case "moveSpell":
		  	//$log->lwrite("MoveScene(way=".$_GET["way"].",sorder=".$_GET["sorder"].")");
					 
			$collection=new MongoCollection($db, 'Spell');

			if ($_POST["way"]=="UP")
				$floors = $collection->find(array('sorder'=>array( '$lt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => -1))->limit(1);
			else
				$floors = $collection->find(array('sorder'=>array( '$gt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => 1))->limit(1);
		
			foreach ($floors as $res)
				$rsorder=$res['sorder'];

			$collection->update(array('sorder'=>intval($rsorder)),array('$set'=>array('sorder'=>999)));
			$collection->update(array('sorder'=>intval($_POST["sorder"])),array('$set'=>array('sorder'=>intval($rsorder))));
			$collection->update(array('sorder'=>999),array('$set'=>array('sorder'=>intval($_POST["sorder"]))));
		  	break;
		  
		case "deleteSpell": // OK
			$collection = new MongoCollection($db,'Spell');
			$res=$collection->remove(array('_id'=>new MongoId($_GET["scene_id"])),array('justOne'=>true));
			$collection = new MongoCollection($db,'SpellEntry');
			$res=$collection->remove(array('scene_id'=>$_GET["scene_id"]));
			break;

		case "createSpell":
			$collection = new MongoCollection($db, 'Spell');
			$cursor = $collection->find();
			$i=($cursor->count())+1;
			$new_spell=array('title'=>'Spell '.$i,'sorder'=>$i);
			$collection->insert($new_spell);
			echo json_encode($new_spell);
			break;

		case "getSpells":
			$collection = new MongoCollection($db, 'Spell');
			$cursor = $collection->find()->sort(array('sorder' => 1));;
			echo json_encode(iterator_to_array($cursor, false));
			break;		
	}
}

if (!isset($_POST["Operation"])){
$m->close();
return;
}

switch ($_POST["Operation"]) {
	
	case "getSpellEntry":
		$array_return=iterateSpellEntry($_POST['scene_id'],'0'); // Scene id, parent
		echo json_encode($array_return);
		break;

	case "setSpell":
		$collection = new MongoCollection($db, 'Spell');
		unset($_POST['Operation']);
		unset($_POST['_id']);
		$res = $collection->update(array('_id'=>new MongoId($_POST['scene_id'])),$_POST);
		break;
	
	case "deleteSpellEntry":
		iterateDeleteSpellEntry($_POST['scene_id'],$_POST['scene_item_id']);
		$collection = new MongoCollection($db, 'SpellEntry');
		$res=$collection->remove(array('_id'=>new MongoId($_POST['scene_item_id'])),array('justOne'=>true));
		break;

	case "setSpellEntry":
		$collection = new MongoCollection($db, 'SpellEntry');
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

			$res = $collection->update(array('_id'=>new MongoId($_POST['scene_item_id']),'scene_id'=>$_POST['scene_id']),$_POST);
			$_POST['_id']=new MongoId($_POST['scene_item_id']);
		}else{
			unset($_POST['is_new']);
			unset($_POST['scene_item_id']);
			$res = $collection->insert($_POST);
		}
		echo json_encode($_POST);
		break;	
}
$m->close();

function startsWith($haystack, $needle) {
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

function endsWith($haystack, $needle) {
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

function iterateSpellEntry($scene_id,$parent_key){
	$log = new Logging();
	$log->lfile('/tmp/mylog.txt');

	$m = new MongoClient();
	$db = $m->selectDB('oz');
	$collection = new MongoCollection($db, 'SpellEntry');
	$cursor=$collection->find(array('scene_id'=> $scene_id,'parent_key'=>$parent_key));
	$cursor->sort(array('_id' => 1));
	$array_return=array();
	foreach ($cursor as $res) {
		if (endsWith($res['type'],'_COND') || endsWith($res['type'],'_COND_ET')){
			$res['entry']=iterateSpellEntry($scene_id, (string) $res["_id"]);
		}
		else if (endsWith($res['type'],'_LOOP') ){
			$res['entry']=iterateSpellEntry($scene_id, (string) $res["_id"]);
		}
		array_push($array_return,$res);
	}
	//$m->close();
	return $array_return;	
}

function iterateDeleteSpellEntry($scene_id,$parent_key){
	$log = new Logging();
	$log->lfile('/tmp/mylog.txt');

	$m = new MongoClient();
	$db = $m->selectDB('oz');
	$log->lwrite("shere scene_id=".$scene_id." parent=".$parent_key);
	$collection = new MongoCollection($db, 'SpellEntry');
	$cursor=$collection->find(array('scene_id'=> $scene_id,'parent_key' =>$parent_key));
	
	foreach ($cursor as $res) {
		if (endsWith($res['type'],'_COND')){
			$log->lwrite("going in : ".json_encode($res));
			$res['entry']=iterateSpellEntry($scene_id, (string) $res["_id"]);
		}
		$collection->remove(array('_id'=>$res['_id']),array('justOne'=>true));
	}
	$m->close();
}

?>
