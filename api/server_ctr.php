<?php
/***********************************
*
*
************************************/

require_once("../config.php");

if (!isset($_SESSION["Username"])) {
	header("HTTP/1.0 401 Forbidden",true,401);
	exit(0);
}
session_write_close();

	
/* Methods :

1/ GET :
-getCameraTemplate
-getListofCamera
-getCameraDetails
2/ POST :
*/

if (isset($_GET["Operation"])){

	switch ($_GET["Operation"]) {
		case "getServerCategoryProperties":
		  	
			$collection = new MongoCollection($db, 'SysObject');
			$cursor=$collection->find(array('object_type'=>$_GET['param_domain']));
			echo json_encode(iterator_to_array($cursor, false));
			break;
	}
}elseif(isset($_POST["Operation"])){
	switch ($_POST["Operation"]) {
		case "setCategoryProperty":

			$collection = new MongoCollection($db, 'SysObject');
			$res=$collection->update(array('object_type'=>$_POST["param_domain"]),
									 array('$set'=>array('object_type'=>$_POST["param_domain"],$_POST["param_name"]=>$_POST["param_value"])),
									 array('upsert'=>true));
			
		break;
	}
}
$m->close();
?>
