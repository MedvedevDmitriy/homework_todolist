<?php

include('connection.php');

if( isset($_GET['login']) && isset($_GET['password']) ) {

	$login = $_GET['login'];
	$password = $_GET['password'];

	$sql = "SELECT * FROM USERS WHERE login = '".$login."' AND password = '".$password."'" or die ("ERROR: ".mysqli_error());
	$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
	$getUser_result =  mysqli_fetch_assoc($result);
	$getUser_RecordCount = mysqli_num_rows($result);

	if ($getUser_RecordCount < 1){
		echo '0';
	} 
	else {
		$id = $getUser_result['id'];
		$login = $getUser_result['login'];
		$obj = (object) [ "id" => $id, "login" => $login ];
		$jsonObj = json_encode($obj, JSON_FORCE_OBJECT);
		echo $jsonObj;
	}
}
mysqli_close($link);

?>