<?php
	// load the config of MySQL
    include "config.inc.php";

	// connect
	$db = mysql_connect($mysql_host, $mysql_user, $mysql_password) or die('Could not connect: ' . mysql_error()); 
    mysql_select_db($mysql_database) or die('Could not select database');

    // query
    $query = "SET time_zone = '+08:00';"; // set the timezone
    $result = mysql_query($query) or die('Query failed: ' . mysql_error()); 
    $query = "SELECT * FROM highscores ORDER BY score DESC LIMIT 100;";
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());

    for($i = 0; $i < mysql_num_rows($result); $i++)
    {
         $row = mysql_fetch_array($result);
         echo $row['id'] . "\t" . $row['name'] . "\t" . $row['score'] . "\t" . $row['time'] . "\n";
    }
?>