

<?php


    
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

$title = $json_obj['title'];

$datetime = $json_obj['datetime'];

$dateformatted = date("Y-m-d H:i:s", strtotime($datetime));

require 'database.php';


$stmt = $mysqli->prepare("Delete from events where username=? and title=? and date=?");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => $mysqli->error));
        $stmt->close();
	exit;
}

$stmt->bind_param('sss', $username, $title, $dateformatted);

$stmt->execute();

echo json_encode(array(
    "success" => true,
    "message" => "Event deleted."
));

$stmt->close();


?>

