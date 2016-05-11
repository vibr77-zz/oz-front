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
-getVirtualDeviceStates
-getVirtualDevicesList
-getUserLocationDevicesList
-AddDevice
-RemoveDevice
-GetNodeAssociationGroup
-RequestAllConfigParams
-lConfigParams
-CheckRequestAllConfigParamsComplete
-addAssociation
-removeAssociation
-getDeviceValueHashTable
-getDeviceHashTable
-getvDeviceHashTable
-getZwaveConfig
-getDeviceConfig
-getDeviceDetailInfo
-getNumGroups
-getDevicesMeterList
-getDevicesList
-getDevicesXml
-getDevicesMeterXml

2/ POST : 
-setVirtualDeviceActionEntry
-setVirtualWsActionEntry
-getVirtualDeviceProperties
-setVirtualDeviceStateTitle
-deleteVirtualDevice
-deleteVirtualDeviceState
-createVirtualDeviceState
-createVirtualDevice
-getStateEntryDetails
-ExecuteVirtualDeviceState
-deleteVirtualDeviceEntry
-GetValueID
-GetAllLastValueID
-GetDeviceLastValueID
-GetLastValueID
-SetReleaseButton
-SetValueID
-SetValueLabel
-GetConfigParamValue
-SetConfigParam
-getNodeState
-RefreshNodeInfo
-RequestNodeDynamic
-UpdateNodeInfo
-Command
-Multilevel

 */

function lean_config( $xml, $cmd_num ) {
	$cmdclass=$xml->xpath('//Node/CommandClasses/CommandClass[@id="'.$cmd_num.'"]'); // Manufacturer Specific
	foreach ($cmdclass as $result) {
		unset($result[0]);
	}

}

if (isset($_GET["Operation"])){
	$log->lwrite("GET Method:".$_GET["Operation"]);
	switch ($_GET["Operation"]) {
		case "getDeviceEvents":
			$collection = new MongoCollection($db, 'DeviceEvent');
			$cursor = $collection->find(array('device_id'=>intval($_GET["device_id"])))->sort(array('event_time'=>-1))->limit(100);
			echo json_encode(iterator_to_array($cursor, false));
		 	break;

		case "getWallEvents":
			$collection = new MongoCollection($db, 'DeviceEvent');
			$cursor = $collection->find()->sort(array('event_time'=>-1))->limit(100);
			echo json_encode(iterator_to_array($cursor, false));
		 	break;

		case "getDevicesXml":
			$ar=array('method'=>'getConfig');
			$req= json_encode($ar);
			$zwaveServer->send($req);
        	$resp=$zwaveServer->read();
        	echo $resp;
        	/*
			$collection = new MongoCollection($db, 'ZwaveConfig');
			$cursor = $collection->find(array('type'=>'zwave_full'))->sort(array('_id'=>-1))->limit(1);

			foreach($cursor as $res)
				echo $res['zwave_config'];*/
			
			break;
		
		case "getConfigFromZwaveDaemon":
		 	$ar=array(  'method'=>'WriteConfig');
      		$req= json_encode($ar);
      		$log->lwrite($req);

        	$zwaveServer->send($req);
        	$resp=$zwaveServer->read();
        	echo json_encode($resp);
        return;

		case "setBeaconExitRegion":
		 	$log->lwrite("setBeaconExitRegion()");
		 	$xml_req="<?xml version=\"1.0\" encoding=\"utf-8\"?><request><method>setBeaconExitRegion</method><params>";
			foreach($_GET as $key=>$value){
				$xml_req.="<".$key.">".$value."</".$key.">";
  				$log->lwrite("	$key=$value");
			}
			$xml_req.="</params></request>";
			$zwaveServer->send($xml_req);
			$log->lwrite("Zwave return:".$zwaveServer->read());
		 	break;
		 
		case "setBeaconEnterRegion":
		 	$log->lwrite("setBeaconEnterRegion()");
		 	$xml_req="<?xml version=\"1.0\" encoding=\"utf-8\"?><request><method>setBeaconEnterRegion</method><params>";
			foreach($_GET as $key=>$value){
				$xml_req.="<".$key.">".$value."</".$key.">";
  				$log->lwrite("	$key=$value");
			}
			$xml_req.="</params></request>";
			$zwaveServer->send($xml_req);
			$log->lwrite("Zwave return:".$zwaveServer->read());
		 	break;
		 
		case "getImageCollection":
			$collection = new MongoCollection($db, 'RefObject');
			$cursor = $collection->find(array('object_type'=>'image'));
			echo json_encode(iterator_to_array($cursor, false));
		  	break;

		case "GetNodeAssociationGroup": // working todo change in the model device_id par device_id
		  	$collection = new MongoCollection($db, 'DeviceAssociation');
			$cursor = $collection->find(array('node_id'=>$_GET["device_id"]));
			echo json_encode(iterator_to_array($cursor, false));
		 	break;
	
		case "getNumGroups":
		  		
			$nodeid=$_GET["device_id"];
			$req="<?xml version=\"1.0\" encoding=\"utf-8\"?><request><method>getNumGroups</method><params><nodeid>".$nodeid."</nodeid></params></request>";
				
			$zwaveServer->send($req);
			$ret=$zwaveServer->read();
		  		
			$i_numgrp=3;
			$res="<?xml version=\"1.0\" encoding=\"utf-8\"?><request><method>getNumGroups</method><response><numgroups>".$i_numgrp."</numgroups></response></request>";
			echo $res;
		 	break;

		case "RequestAllConfigParams":
			$ar=array(	'method'=>'RequestAllConfigParams',
						'nodeid'=>$_GET["device_id"]
						
						);
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
		  	break;
		case "getHealNetworkNode":
			$log->lwrite("HealNetworkNode()");
			$ar=array(	'method'=>'HealNetworkNode',
						'device_id'=>$_GET["device_id"],
						'doRR'=>'true');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
		  	break;
		
		case "getHealNetwork":
			$log->lwrite("HealNetwork()");
			$ar=array(	'method'=>'HealNetwork','doRR'=>'true');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
		  	break;

		case "getDevicesStatus":
			//$log->lwrite("HealNetwork()");
			$ar=array(	'method'=>'getDevicesStatus');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
		  	break;

		case "setDeviceAssociation":
			$ar=array(	'method'=>'setDeviceAssociation',
						'device_id'=>$_GET["device_id"],
						'group_id'=>$_GET["group_id"],
						'target_device_id'=>$_GET["target_device_id"],
						);
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
			break;
		
		case "removeAssociation":
			$ar=array(	'method'=>'removeDeviceAssociation',
						'device_id'=>$_GET["device_id"],
						'group_id'=>$_GET["group_id"],
						'target_device_id'=>$_GET["target_device_id"],
						);
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo $zwaveServer->read();
			break;
			
		case "getDeviceControllerCommandState":
			$ar=array('method'=>'getDeviceControllerCommandState');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo json_encode($zwaveServer->read());
		  	break;	
		case "getAddDeviceControllerCommand":
			$ar=array('method'=>'getAddDeviceControllerCommand');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo json_encode($zwaveServer->read());
		  	break;
		case "getRemoveDeviceControllerCommand":
			$ar=array('method'=>'getRemoveDeviceControllerCommand');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo json_encode($zwaveServer->read());
		  	break;
		case "getCancelDeviceControllerCommand":
			$ar=array('method'=>'getCancelDeviceControllerCommand');
			$req= json_encode($ar);
	    	$zwaveServer->send($req);
	    	echo json_encode($zwaveServer->read());
		  	break;




		case "getAllConfigParams":
		  	$cmdclass="0x".dechex(112);
		  	$collection = new MongoCollection($db, 'Camera');
			$cursor = $collection->find(array('device_id'=>$_GET["device_id"],'command_class'=>$cmdclass));
			echo json_encode(iterator_to_array($cursor, false));
		  	break;
		    
		case "getRoomsList":
		  	/* To be moved to Site_ctr.php */
		  	$collection_room=new MongoCollection($db, 'Room');
			$rooms = $collection_room->find()->sort(array('sorder' => 1));
			echo json_encode(iterator_to_array($rooms, false));
			break;

		case "getDeviceValueHashTable": // Replace to getDevicePanel	
			$collection = new MongoCollection($db, 'Panel');
			if (isset($_GET["device_id"])){
				$regex = new MongoRegex("/^".$_GET["device_id"]."-/i");
				$cursor = $collection->find(array('value_id'=> $regex));
			}else{
				$cursor = $collection->find();
			}
			echo json_encode(iterator_to_array($cursor, false));
			break;
				
		case "getDeviceHashTable":
			$collection = new MongoCollection($db, 'Device');
			$cursor = $collection->find();
			echo json_encode(iterator_to_array($cursor, false));
			break;
				
		case "getZwaveConfig":
			$ar=array('method'=>'getConfig');
			$req= json_encode($ar);
			$zwaveServer->send($req);
        	$resp=$zwaveServer->read();
        	echo $resp;
        	/*
		 	$collection = new MongoCollection($db, 'ZwaveConfig');
			$cursor = $collection->find(array('type'=>'zwave_lean'))->sort(array('config_time'=>-1))->limit(1);
			foreach($cursor as $res)
				echo $res['zwave_config'];
			*/
		 	break;	
 
		case "getDeviceDetailInfo": // OK GOOD
			$nodeid=$_GET["device_id"];
			
			/*$collection = new MongoCollection($db, 'ZwaveConfig');
			$cursor = $collection->find(array('type'=>'zwave_full'))->sort(array('config_time'=>-1))->limit(1);

			foreach($cursor as $res);
				$processed_string = str_replace("xmlns=", "ns=", $res['zwave_config']); 
			*/
			$ar=array('method'=>'getConfig');
			$req= json_encode($ar);
			$zwaveServer->send($req);
        	$resp=$zwaveServer->read();
        	$processed_string = str_replace("xmlns=", "ns=", $resp); 
			
			$xml = simplexml_load_string($processed_string);
			
	  		$result = $xml->xpath('./Node[@id="'.$nodeid.'"]');
			foreach ($result as $node){
			  foreach($node->attributes() as $key=> $val){
				 $ar_return[$key]=strval($val);
				 $log->lwrite("login res : ".$val);
			  }
			}
			$result = $xml->xpath('./Node[@id="'.$nodeid.'"]/Manufacturer');
			foreach ($result as $Manufacturer){
				foreach($Manufacturer->attributes() as $key=> $val){
			  		$ar_return[$key]=strval($val);
			  	}
			}
			$result = $xml->xpath('./Node[@id="'.$nodeid.'"]/Manufacturer/Product');
			foreach ($result as $Product){
			  	foreach($Product->attributes() as $key=> $val){
			  		$ar_return[$key]=strval($val);
			  }
			}
			
			$collection = new MongoCollection($db, 'Device');
			$cursor = $collection->find(array('device_id'=> $nodeid));
			foreach ($cursor as $res) {
				 $ar_return=array_merge($ar_return,$res);
			}
			
			$ar=array(	'method'=>'getDeviceStatus',
						'device_id'=>$nodeid,
						);
			$req= json_encode($ar);
			//$log->lwrite($req);

	    	$zwaveServer->send($req);
	    	$resp=$zwaveServer->read();
	    	$log->lwrite("method response:$resp");
	    	$ar_resp=json_decode($resp,true);
	    	unset($ar_resp["method"]);
	    	unset($ar_resp["status"]);
	    	unset($ar_resp["_id"]);
	    	//$log->lwrite("method array resp 1:".json_encode($ar_resp));

	    	$ar_return=array_merge($ar_return,$ar_resp);
			echo $res= json_encode($ar_return);
			//$log->lwrite("method array resp:$res");
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
		$ar=array(	'method'=>'setDeviceConfigParam',
						'device_id'=>$_POST["device_id"],
						'instance'=>$_POST["instance"],
						'index'=>$_POST["index"],
						'valuetype'=>$_POST["type"],
						'value'=>$_POST["value"]);
		$req= json_encode($ar);
		$log->lwrite($req);

	    $zwaveServer->send($req);
	    echo $zwaveServer->read();
	    $log->lwrite($req);
    	break;

	case "requestNodeState":
		$ar=array(	'method'=>'RequestNodeState',
					'device_id'=>$_POST["device_id"]);
					
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	echo $zwaveServer->read();
		break; 

	case "refreshDeviceInfo":
		$ar=array(	'method'=>'refreshDeviceInfo',
					'device_id'=>$_POST["device_id"]);
					
		$req= json_encode($ar);
		$zwaveServer->send($req);
		echo $zwaveServer->read();
		break; 
		
	case "requestNodeDynamic":
		
		$zwaveServer->send($MSG);
    	$zwaveServer->read();
    	$ar=array(	'method'=>'RequestNodeDynamic',
					'device_id'=>$_POST["device_id"]);
					
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	echo $zwaveServer->read();
		break;

	case "setPressButton":
		$ar=array(	'method'=>'PressButton',
					'nodeid'=>$_POST["device_id"],
					'commandclass'=>$_POST["CmdClass"],
					'instance'=>$_POST["Instance"],
					'index'=>$_POST["Index"]);
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	echo $zwaveServer->read();
		break;

	case "setReleaseButton":
		$log->lwrite("ReleaseButton");
		$ar=array(	'method'=>'SetValueID',
					'nodeid'=>$_POST["device_id"],
					'commandclass'=>$_POST["CmdClass"],
					'instance'=>$_POST["Instance"],
					'index'=>$_POST["Index"]);
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	echo $zwaveServer->read();		
    	break;

    case "setValueID": //OK
		$log->lwrite("setValueID");
		$ar=array(	'method'=>'setValueID',
					'device_id'=>$_POST["device_id"],
					'commandclass'=>$_POST["commandclass"],
					'instance'=>$_POST["instance"],
					'index'=>$_POST["index"],
					'valuetype'=>$_POST["type"],
					'value'=>$_POST["value"]);

		$req= json_encode($ar);
		$log->lwrite("setValueID request=".$req);
    	$resp=$zwaveServer->send($req);	
    	echo json_encode($resp);
    	break;

 	case "setValueLabel": //OK 
 		$log->lwrite("SetValueLabel");
		$ar=array(	'method'=>'setValueLabel',
					'device_id'=>$_POST["device_id"],
					'commandclass'=>$_POST["commandclass"],
					'instance'=>$_POST["instance"],
					'index'=>$_POST["index"],
					'label'=>$_POST["label"]);
					
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	$resp=$zwaveServer->read();
    	echo json_encode($resp);	
    	break;

	case "getDeviceLastValueID":
		$find_cond_array=array();
		if (isset($_POST['device_id']))
			$find_cond_array['device_id']=intval($_POST['device_id']);
		if (isset($_POST['command_class']))
			$find_cond_array['command_class']=$_POST['command_class'];
		if (isset($_POST['instance']))
			$find_cond_array['instance']=intval($_POST['instance']);
		if (isset($_POST['indx']))
			$find_cond_array['indx']=intval($_POST['indx']);

		$collection = new MongoCollection($db, 'DeviceLastEvent');
		$cursor = $collection->find($find_cond_array);
		$arr=array();
		if ($cursor->count()>0){
			foreach ($cursor as $res) {
				$key=$res['device_id']."-".hexdec($res['command_class'])."-".$res['instance']."-".$res['indx'];
				$res['key']=$key;
				array_push($arr, $res);
			}
		}		
		echo $res=json_encode($arr);
		break;

	case "setDeviceValueHashProperty": // OK GOOD
		$collection = new MongoCollection($db, 'Panel');
		$res=$collection->update(array('value_id'=>$_POST['value_id']),
								 array('$set'=>array($_POST['fkey']=>$_POST['fval'])),
								 array('upsert'=> true));
		
		echo "<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>setDeviceValueHashProperty</method><results><status>OK</status></results></response>";
		break;
		
	case "UpdateNodeInfo":
    	$log->lwrite("UpdateNodeInfo");
		$ar=array(	'method'=>'UpdateNodeInfo',
					'nodeid'=>$_POST["device_id"],
					'nodezone'=>$_POST["location"],
					'nodename'=>$_POST["name"]
					);
							
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	$resp=$zwaveServer->read();
    	echo json_encode($resp);

    	$ar=array(	'method'=>'WriteConfig');
							
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	$zwaveServer->read();	

    	$ar=array(	'method'=>'GetConfig');
							
		$req= json_encode($ar);
    	$zwaveServer->send($req);
    	$zwaveServer->read();	
    	//echo json_encode($resp);

      	$collection = new MongoCollection($db, 'Device');	
		$collection->update(array('device_id'=>$_POST['device_id']),array('$set'=>array('image'=>$_POST['image'],'visible'=>$_POST['visible'])),
					array('upsert'=>true));
		break;
	 	
}
$m->close();
?>
