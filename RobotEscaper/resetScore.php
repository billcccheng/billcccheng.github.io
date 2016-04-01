<?php
    // load the config of MySQL
    include "config.inc.php";

	// connect
	$db = mysql_connect($mysql_host, $mysql_user, $mysql_password) or die('Could not connect: ' . mysql_error()); 
    mysql_select_db($mysql_database) or die('Could not select database');

    // query
    $query = "TRUNCATE TABLE highscores;";
    $result = mysql_query($query) or die('Query failed: ' . mysql_error());

    for($i=0; $i<100; $i++)
    {
        $query = "INSERT INTO highscores(name, score) VALUES('Anonymous Robot', '0');";
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());
    }
?>