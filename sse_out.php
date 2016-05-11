<?php
require('config.php');
require_once('lib/sse/libsse.php');
//$GLOBALS['data'] = new SSEData('file',array('path'=>'./data'));
session_write_close();
$sse = new SSE();
//$settings = parse_ini_file('./dbconfig.ini.php');
//$dbh = new PDO("mysql:host=".$settings['db_host'].";dbname=".$settings['db_name'], $settings['db_login'], $settings['db_pass']);


class LatestMessage extends SSEEvent {
	private $cache = 0;
	private $data;
	private $indx=0;
	
	public function update(){
		//$GLOBALS['log']->lwrite(json_encode($this->data));
		return json_encode($this->data);
	}
	
	public function check(){

			if (!isset($_SESSION["Username"])) {
				$this->data = array('eventName'=>'unauthorize','msg'=>htmlentities("401"));
				$this->indx="0";
				return true;
			}
			
			$collection = new MongoCollection($GLOBALS['db'], 'DeviceSse');
			if ($this->indx==0){
				$cursor=$collection->find(array());
				$cursor->sort(array('_id' => -1));
				$cursor->limit(1);
				foreach ($cursor as $res) {
					$this->indx=(string)$res['_id'];
					/*
					$log = new Logging();
					$log->lfile('/tmp/mylog.txt');
					$log->lwrite(" last _id: ".$this->indx);
					*/
					return false;
				}
			}
			//$log = new Logging();
			//$log->lfile('/tmp/mylog.txt');

			//$cursor=$collection->find(array("_id"=>array('$gt',new MongoId($this->indx))));
			//$collection = new MongoCollection($GLOBALS['db'], 'DeviceSse');
			$new_id=new MongoID($this->indx);
			$i=$new_id->getTimestamp();
			
			//$log->lwrite(" message manager: time:".$i);
			
			//$cursor=$collection->find(array("_id"=>array('$gt',new MongoId("5601185f0e79598c207b23d1"))));
			$cursor=$collection->find(array('$query'=>array('ts'=>array('$gt'=>$i))));
			//$log->lwrite("message manager: count:".$cursor->count());
			//$cursor=$collection->find(json_decode("{_id:{'$gte':ObjectId('5601185f0e79598c207b23d1')}}"));
			
			foreach ($cursor as $res) {
			
				
				/*$log = new Logging();
				$log->lfile('/tmp/mylog.txt');
				$log->lwrite("Value inside: ".$res["key"]);
				*/
				$this->data = array('eventName'=>'deviceEvent','msg'=>htmlentities($res["val"]),'time'=>time(),'key'=>$res["key"]);//
				$this->indx=(string)$res['_id'];
				return true;
			}
		
		return false;
		
	}
	
};
$sse->exec_limit = 30;
$sse->addEventListener('',new LatestMessage());
$sse->start();
$m->close();