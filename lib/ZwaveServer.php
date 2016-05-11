<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ZwaveServer
 *
 * @author conradv
 */
 

require_once("logclass.php");


class ZwaveServer {

    //put your code here
    
	private $response;
	public 	$error;
	public  $error_msg;
	public $url;
	private $log;
    function __construct($host, $port) {
		$error=false;
		$error_msg="";
		set_error_handler(array($this,'ErrorHandler'));
       
		$this->url="http://".$host.":".$port."/";
       	$log = new Logging();
		$log->lfile('/tmp/mylog.txt');
       	$log->lwrite("zwaveServer construct()");
       	$log->lwrite("zwaveServer URL=".$this->url);

	}
	function ErrorHandler($errno, $errstr) { 
        $this->error=true;
		$this->error_msg=$errstr;
		
    } 
	
    function read() {
        return $this->response;
    }

    function send($data) {
    	$log = new Logging();
		$log->lfile('/tmp/mylog.txt');
    	$log->lwrite("zwaveServer URL=".$this->url);
    	$log->lwrite("zwaveServer data=".$data);
    	$this->response="";
		
		$ch = curl_init($this->url);
		curl_setopt($ch, CURLOPT_MUTE, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/xml'));
		curl_setopt($ch, CURLOPT_POSTFIELDS, "$data");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$this->response = curl_exec($ch);
		$log->lwrite("zwaveServer resp=".$$this->response);
		curl_close($ch);

		return $this->url;
	}
}

?>
