

<?php


    
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

$eventName = $json_obj['eventName'];

$matchedEvents = array();


require 'database.php';

$stmt = $mysqli->prepare("select title, date from events where title=? and username=?");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => $mysqli->error));
        $stmt->close();
	exit;
}

$stmt->bind_param('ss', $eventName, $username);

$stmt->execute();

$stmt->bind_result($title, $date);

while($stmt->fetch()) {
    array_push($matchedEvents, array("title"=>$title, "datetime"=>$date));
}


echo json_encode(array(
    "success" => true,
    "message" => "Events found!",
    "matchedEvents"=>$matchedEvents,
));

$stmt->close();


?>

