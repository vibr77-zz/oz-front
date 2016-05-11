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
-getCameraTemplate
-getListofCamera
-getCameraDetails
2/ POST :
*/

if (isset($_GET["Operation"])){

	switch ($_GET["Operation"]) {
		case "getSiteItemList":

			$collection_floor = new MongoCollection($db, 'Floor');
			$collection_room=new MongoCollection($db, 'Room');
			$cursor = $collection_floor->find()->sort(array('sorder' => 1));
    		$res=array();
			if ($cursor->count()>0){
				foreach ($cursor as $ar) {
					$log->lwrite("Flood id:".$ar["_id"]);
					$rooms = $collection_room->find(array('floor_id'=>(string) $ar["_id"]))->sort(array('sorder' => 1));
					if ($rooms->count()>0){
						$log->lwrite("Flood id bingo");
						$ar['rooms']=iterator_to_array($rooms,false);
						array_push($res, $ar);
					}
				}
			}

			$log->lwrite("SiteList:".json_encode($res));
			echo json_encode($res);
			break;		
	}
}elseif(isset($_POST["Operation"])){
	switch ($_POST["Operation"]) {
		case "MoveFloor":

		  	$log->lwrite("MoveFloor(way=".$_POST["way"].",sorder=".$_POST["sorder"].")");
			$res="<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>MoveFloor</method><results>";
			
			$collection_floor=new MongoCollection($db, 'Floor');

			if ($_POST["way"]=="UP")
				$floors = $collection_floor->find(array('sorder'=>array( '$lt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => -1))->limit(1);
			else
				$floors = $collection_floor->find(array('sorder'=>array( '$gt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => 1))->limit(1);
		
			foreach ($floors as $res)
				$rsorder=$res['sorder'];

			$floors = $collection_floor->update(array('sorder'=>intval($rsorder)),array('$set'=>array('sorder'=>999)));
			$floors = $collection_floor->update(array('sorder'=>intval($_POST["sorder"])),array('$set'=>array('sorder'=>intval($rsorder))));
			$floors = $collection_floor->update(array('sorder'=>999),array('$set'=>array('sorder'=>intval($_POST["sorder"]))));
			
		  	$res.="<status>1</status></results></response>";
			echo $res;
		  	break;
		
		case "MoveRoom":
		  	$log->lwrite("MoveRoom(way=)");
			$res="<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>MoveRoom</method><results>";
			
			$collection_room=new MongoCollection($db, 'Room');
			//$rooms = $collection_room->find('sorder'=>'s');
			if ($_POST["way"]=="UP")
				$floors = $collection_room->find(array('floor_id'=>$_POST["floor_id"],'sorder'=>array( '$lt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => -1))->limit(1);
			else
				$floors = $collection_room->find(array('floor_id'=>$_POST["floor_id"],'sorder'=>array( '$gt' => intval($_POST["sorder"]))), array('sorder' => 1))->sort(array('sorder' => 1))->limit(1);
		
			foreach ($floors as $res)
				$rsorder=$res['sorder'];
			
			//$log->lwrite("Fuck : ".$rsorder);

			$floors = $collection_room->update(array('floor_id'=>$_POST["floor_id"],'sorder'=>intval($rsorder)),array('$set'=>array('sorder'=>999)));
			$floors = $collection_room->update(array('floor_id'=>$_POST["floor_id"],'sorder'=>intval($_POST["sorder"])),array('$set'=>array('sorder'=>intval($rsorder))));
			$floors = $collection_room->update(array('floor_id'=>$_POST["floor_id"],'sorder'=>999),array('$set'=>array('sorder'=>intval($_POST["sorder"]))));
			/*

			if ($_POST["way"]=="UP"){
				$SQL_SELECT="select sorder from tbl_rooms where sorder<:sorder and floor_id=:floor_id order by sorder DESC limit 0,1";
			}else{
				$SQL_SELECT="select sorder from tbl_rooms where sorder>:sorder ans floor_id=:floor_id order by sorder ASC limit 0,1";
			}
			
			$sth = $dbh->prepare($SQL_SELECT);
			$sth->bindParam(':sorder', $_POST["sorder"], PDO::PARAM_INT);
			$sth->bindParam(':floor_id', $_POST["floor_id"], PDO::PARAM_INT);
			$sth->execute();
			
			$row =  $sth->fetch(PDO::FETCH_ASSOC);
			
			$QUERY_UPDATE_1="update tbl_rooms set sorder=999 where sorder=:rsorder";
			$QUERY_UPDATE_2="update tbl_rooms set sorder=:rsorder where sorder=:gsorder";
			$QUERY_UPDATE_3="update tbl_rooms set sorder=:gsorder where sorder=999";
			
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
				*/
		  	$res.="<status>1</status></results></response>";
			echo $res;
		  	break;

		case 'createFloor':
			$collection = new MongoCollection($db, 'Floor');
			$val = $collection->find(array(), array('sorder' => 1))->sort(array('sorder' => 1))->limit(1);
			$sorder=1;
			foreach ($val as $res)
				$sorder=intval($res['sorder'])+1;
				
			$cursor = $collection->find();
			$i=($cursor->count())+1;
			
			$new_floor=array('title'=>'New Floor '.$i,'sorder'=>$sorder);
			$collection->insert($new_floor);
			break;
		
		case 'createRoom':
			$collection = new MongoCollection($db, 'Room');
			$val = $collection->find(array(), array('sorder' => 1))->sort(array('sorder' => -1))->limit(1);
			$sorder=1;
			foreach ($val as $res)
				$sorder=($res['sorder'])+1;
			$cursor = $collection->find(array('floor_id'=>$_POST["floor_id"]));
			$i=($cursor->count())+1;
			$new_room=array('title'=>'New Room '.$i,'floor_id'=>$_POST["floor_id"],'sorder'=>$sorder);
			$collection->insert($new_room);
			break;

		case 'deleteRoom':
			$collection = new MongoCollection($db, 'Room');
			$res=$collection->remove(array('_id'=>new MongoId($_POST["room_id"])),array('justOne'=>true));
			break;

		case 'deleteFloor':
			$collection = new MongoCollection($db, 'Room');
			$res=$collection->remove(array('floor_id'=>$_POST["floor_id"]));
			
			$collection = new MongoCollection($db, 'Floor');
			$res=$collection->remove(array('_id'=>new MongoId($_POST["floor_id"])));
			break;

		case 'setFloorDetails':
			$collection = new MongoCollection($db, 'Floor');
			foreach ($_POST as $key => $value) {
				if ($key=="Operation" || $key=="back_color" || $key=="floor_id" || is_array($value))
					continue;
				$floor_details[$key]=$value;
			}
			$collection->update(array('_id'=>new MongoId ($_POST["floor_id"])),array('$set'=>$floor_details));
			break;

		case 'setRoomDetails':
			$collection = new MongoCollection($db, 'Room');
			foreach ($_POST as $key => $value) {
				if ($key=="Operation" || $key=="back_color" || $key=="room_id" || is_array($value))
					continue;
				$room_details[$key]=$value;
			}
			$collection->update(array('_id'=>new MongoId ($_POST["room_id"])),array('$set'=>$room_details));
			break;
	}
}
$m->close();
?>