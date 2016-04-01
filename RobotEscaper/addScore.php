<?php
	// load the config of MySQL
    include "config.inc.php";
    
	// hash key
	$hashKey = 'sKeyOfRobotEscaperByNaga1';

	// connect
	$db = mysql_connect($mysql_host, $mysql_user, $mysql_password) or die('Could not connect: ' . mysql_error()); 
    mysql_select_db($mysql_database) or die('Could not select database');

    // Strings must be escaped to prevent SQL injection attack. 
    $name = mysql_real_escape_string($_GET['name'], $db);
    $score = mysql_real_escape_string($_GET['score'], $db);
    $hash = $_GET['hash']; 

    // add score
    $real_hash = md5($name . $hashKey . $score); 
    if($real_hash == $hash)
    { 
        // Send variables for the MySQL database class. 
        $query = "INSERT INTO highscores(name, score) VALUES('$name', '$score');"; 
        $result = mysql_query($query) or die('Query failed: ' . mysql_error());

        // show on the page
        echo "OK.";
    } 
?>