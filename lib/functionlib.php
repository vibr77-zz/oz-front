<?php

function getInternalPointer(){
	$settings = parse_ini_file('../dbconfig.ini.php');
	$dbh = new PDO("mysql:host=".$settings['db_host'].";dbname=".$settings['db_name'], $settings['db_login'], $settings['db_pass']);
	$SQL_SELECT="select param_value from tbl_system_params where param_domain='INTERNAL' and param_name='POINTER'";
	$sth = $dbh->prepare($SQL_SELECT);
	$sth->execute();
	if ($sth){
		$row =  $sth->fetch(PDO::FETCH_ASSOC);
		$pointer=$row['param_value'];
		$pointer++;
	}
	
	$SQL_UPDATE="update tbl_system_params set param_value=:pointer where param_domain='INTERNAL' and param_name='POINTER'";
	$sth = $dbh->prepare($SQL_UPDATE);
	$sth->bindParam(':pointer', $pointer, PDO::PARAM_STR);
	$sth->execute();

return $pointer;
}



?>
