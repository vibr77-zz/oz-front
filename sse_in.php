<?php
require_once("config.php");
session_write_close();

if(isset($_GET['message'],$_GET['key'])){
	$timer=file_get_contents('/var/www/oz/data/subscription_time');
	$delta=time()-$timer;
	if ($delta<900){
		$collection = new MongoCollection($db, 'DeviceSse');
		$cursor = $collection->find();
		$i=($cursor->count())+1;
			
		$new_event=array('key'=>$_GET['key'],'val'=>$_GET['message'],'ts'=>time());
		$collection->insert($new_event);
		
	}
}

$m->close();
?>