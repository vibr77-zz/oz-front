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

/* Methods :

1/ GET :
-getListofCamera
-getCameraDetails

2/ POST :
-createCamera
-deleteCamera
-setCameraDetails
*/

if (isset($_GET["Operation"])){
	switch ($_GET["Operation"]) {
		case "getCamera":
			$collection = new MongoCollection($db, 'Camera');
			$cursor = $collection->find();
			$arr=array();
			if ($cursor->count()>0){
				foreach ($cursor as $res) {
					$collection_2= new MongoCollection($db, 'Room');
					$cursor_2 = $collection_2->find(array('_id'=>new MongoId($res["room_id"])));
					foreach ($cursor_2 as $res_2) {
						$res['zone']=$res_2["title"];
					}
					
					array_push($arr, $res);
				}
			}	
			
		
			echo json_encode($arr);
			//echo json_encode(iterator_to_array($cursor, false));
			$log->lwrite("Get Camera Res:".json_encode($arr));
			break;

		case "getCameraDetails":
			$collection = new MongoCollection($db, 'Camera');
			$cursor = $collection->find(array('_id'=>new MongoId($_GET["cam_id"])));
			echo json_encode(iterator_to_array($cursor, false));
			break;
	}
}elseif(isset($_POST["Operation"])){
	switch ($_POST["Operation"]) {
		case "createCamera" :
			$collection = new MongoCollection($db, 'Camera');
			$new_camera=array('title'=>'New Camera');
			$collection->insert($new_camera);
			echo "<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>deleteCamera</method><results><status>OK</status></results></response>";
			break;

		case "deleteCamera":
			$collection = new MongoCollection($db, 'Camera');
			$res=$collection->remove(array('_id'=>new MongoId($_POST["cam_id"])),array('justOne'=>true));
			echo "<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>deleteCamera</method><results><status></status></results></response>";
			break;

		case "setCameraDetails":
			$collection = new MongoCollection($db, 'Camera');
			foreach ($_POST as $key => $value) {
				if ($key=="Operation" || $key=="back_color" || $key=="cam_id" || is_array($value))
					continue;
				$camera_details[$key]=$value;
			}
			$collection->update(array('_id'=>new MongoId ($_POST["cam_id"])),array('$set'=>$camera_details));
			echo "<?xml version=\"1.0\" encoding=\"utf-8\"?><response><method>setCameraDetails</method><results><status>OK</status></results></response>";
			break;
	}
}
$m->close();
