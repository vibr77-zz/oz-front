<?php

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

2/ POST :

*/	
	
					 
if (isset($_GET["Operation"])){	
	switch ($_GET["Operation"]) {
		case "getUserDetails":
			$collection = new MongoCollection($db, 'User');
			$cursor=$collection->find(array('_id'=>new MongoId($_GET["user_id"])));
			$arr=array();
			foreach ($cursor as $res) {
				unset($res['password']);
				array_push($arr, $res);
			}
			echo $res=json_encode($arr);
			break;

		case "setUserObject":
			break;
		case "deleteUserObject":			
			break;

		case "getUsersDetails":
			$collection = new MongoCollection($db, 'User');
			$cursor=$collection->find();
			$arr=array();
			foreach ($cursor as $res) {
				unset($res['password']);
				array_push($arr, $res);
			}
			echo $res=json_encode($arr);
			break;

	}
}elseif(isset($_POST["Operation"])){
	switch ($_POST["Operation"]) {
		case 'createUser':
			$collection = new MongoCollection($db, 'User');
			$new_user=array('lname'=>'New user','fname'=>'New user','email'=>'some@one.com');
			$collection->insert($new_user);
			break;
			
		case 'deleteUser':
			$collection = new MongoCollection($db, 'User');
			$res=$collection->remove(array('_id'=>new MongoId($_POST["user_id"])),array('justOne'=>true));
			break;

		case 'setUserDetails':
			$collection = new MongoCollection($db, 'User');
			foreach ($_POST as $key => $value) {
				if ($key=="Operation" 	|| 
					$key=="back_color" 	|| 
					$key=="user_id" 	|| 
					$key=="password" 	|| 
					$key=="last_successfull_loging" || 
					$key=="last_error_loging" ||
					is_array($value))
					continue;
				$user_details[$key]=$value;
			}
			$collection->update(array('_id'=>new MongoId ($_POST["user_id"])),array('$set'=>$user_details));
			break;
	}
}
$m->close();
?>