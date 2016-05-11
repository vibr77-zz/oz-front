<?php

require_once("../config.php");

if (isset($_GET["Operation"])){	
	
	switch ($_GET["Operation"]) {
		case "SessionCheck":
			if (isset($_SESSION["Username"])){
				echo "OK";
				$m->close();
				return;
			}else{
				header("HTTP/1.0 401 Forbidden",true,401);
				$m->close();
				return;
			}
		break;

		case "Login":
			if (isset($_GET["txtUsername"]) && isset($_GET["txtPassword"])) {
				$collection = new MongoCollection($db, 'User');
			
				$mquery = array('email' => $_GET["txtUsername"],'password'=>sha1($_GET["txtPassword"]));

				$cursor = $collection->find($mquery);
				if ($cursor->count()>0){
					foreach ($cursor as $res) {
    					$_SESSION["user_id"] =  $res["email"];
		 				$_SESSION["Username"] = $res["fname"];
		 				$valid = true;
    					$collection->update(array('_id'=>$res["_id"]),array('$set'=>array("last_successfull_loging"=>new MongoDate())));
						$collection->update(array('_id'=>$res["_id"]),array('$unset'=>array("error_loging" => 1)));
					}
				}else{
					
					$collection->update(
										array('email'=>$_GET["txtUsername"]),
										array('$set'=>array("last_error_loging"=>new MongoDate()),
											  '$inc'=>array("error_loging" =>1))
										);
					header("HTTP/1.0 401 Forbidden",true,401);
					$m->close();
					return;
				}

 				if (isset($_SESSION["Username"])){
	  				echo "OK";
	  				$m->close();
	  				return;
	  			}	
			}else{
				header("HTTP/1.0 401 Forbidden",true,401);
			}	
		break;
		
		case "Logout":
			unset($_SESSION["Username"]);
    		setcookie('SignedIn','',time()-3600);
    		$m->close();
    		return;
		break;
	}
}

?>
