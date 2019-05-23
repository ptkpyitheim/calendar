

<?php


    
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

$events = array();


require 'database.php';

$stmt = $mysqli->prepare("Select title, date, color from events where username=? order by date");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => $mysqli->error));
        $stmt->close();
	exit;
}

$stmt->bind_param('s', $username);

$stmt->execute();

$stmt->bind_result($title, $datetime, $color);


while($stmt->fetch() && isset($username)) {
    // $abc->title = $title;
    // $abc->datetime = $datetime;
    array_push($events, array("title"=>$title, "datetime"=>$datetime, "color"=>$color));
    // array_push($events, json_encode(array($abc)));
}

echo json_encode(array(
    "success" => true,
    "message" => "Fetched event for the user.",
    "events" => $events
));

$stmt->close();


?>

