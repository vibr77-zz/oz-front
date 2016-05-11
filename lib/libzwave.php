<?php


function GetCommandClass($xml,$nodeid,$cmdclass){
	
	 $db = mysql_connect(HOST,USER, PASSWORD)or die("cannot connect to Mysql Database"); 
				     mysql_select_db(DATABASE)or die("cannot select Database");
		$QUERY="select zwave_config from tbl_zwave_config order by config_time desc limit 0,1";
                              $RESULT_SELECT=mysql_query($QUERY);
			
                              if($RESULT_SELECT!= FALSE) {
                              		$row = mysql_fetch_row($RESULT_SELECT);
                              		$time_start = microtime(true);
                              		//$xml = simplexml_load_string();
                              		$processed_string = str_replace("xmlns=", "ns=", $row[0]); 
																	$xml = simplexml_load_string($processed_string);

                              		$result = $xml->xpath('//Node[@id="'.$nodeid.'"]/CommandClasses/CommandClass[@id="'.$cmdclass.'"]/Value');
															//		echo "<pre>";
                              	   return    $result;
                              		
                              		$time_end = microtime(true);
                              		$time = $time_end - $time_start;
                              		//echo $time;
                              }
	return NULL;
	
}


?>