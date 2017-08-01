<?php

$db_host="localhost";
$username="root";
$password="";
$db_name="main";
$port=3307;

$link=mysqli_connect($db_host,$username,$password,$db_name,$port) or die ("cannot connect");

if (!$link) {
	die("ERROR: ".mysqli_error($link));
}

?>