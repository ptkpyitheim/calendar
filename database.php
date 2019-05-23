<?php
 
 $mysqli = new mysqli('localhost', 'ptkpyitheim', 'hola1', 'module5_group');

 if($mysqli->connect_errno) {
     printf("Connection Failed: %s\n", $mysqli->connect_error);
     exit;
 }

 ?>