<?php

include('connection.php');

if( isset($_GET['login']) && isset($_GET['email']) && isset($_GET['password']) ){

	$login = $_GET['login'];
	$email = $_GET['email'];
	$password = $_GET['password'];

	$sql_login = "SELECT * FROM USERS WHERE login = '".$login."'" or die ("ERROR: ".mysqli_error());
	$result_login  = mysqli_query($link, $sql_login) or die (mysqli_error($link));
	$getUser_RecordCount_login = mysqli_num_rows($result_login);

	$sql_email = "SELECT * FROM USERS WHERE email = '".$email."'" or die ("ERROR: ".mysqli_error());
	$result_email  = mysqli_query($link, $sql_email) or die (mysqli_error($link));
	$getUser_RecordCount_email = mysqli_num_rows($result_email);

	if ($getUser_RecordCount_login > 0){
		echo 'login_exist';
	}

	else if ($getUser_RecordCount_email > 0){
		echo 'email_exist';
	}

	else {
		$add_sql = "INSERT INTO USERS (login,email,password) VALUES ('".$login."','".$email."','".$password."')" or die ("ERROR: ".mysqli_error());
		$add_result = mysqli_query($link, $add_sql) or die (mysqli_error($link));
		echo 'success';
	}
}
mysqli_close($link);

?>