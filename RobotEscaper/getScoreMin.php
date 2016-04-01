<?php
	// load the config of MySQL
    include "config.inc.php";

	// connect
	$db = mysql_connect($mysql_host, $mysql_user, $mysql_password) or die('Could not connect: ' . mysql_error()); 
    mysql_select_db($mysql_database) or die('Could not select database');

    // query
    $query = "SET time_zone = '+08:00';"; // set the timezone
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());    
    $query = "SELECT score FROM highscores ORDER BY score DESC LIMIT 99,100;"; // get score of the 100th row from 100 rows
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());

    // print
    $row = mysql_fetch_array($result);
    echo $row['score'];
?>