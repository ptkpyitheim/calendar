

<?php


    
header("Content-Type: application/json");
ini_set("session.cookie_httponly",1);

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

//current title and datetime to look up in database
$title = $json_obj['title'];
$datetime = $json_obj['datetime'];

$dateformatted = date("Y-m-d H:i:s", strtotime($datetime));

//new values to be updated
$new_title = $json_obj['new_title'];
$new_datetime_not_formatted = $json_obj['new_datetime'];

$new_datetime = date("Y-m-d H:i:s", strtotime($new_datetime_not_formatted));


require 'database.php';

// $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); // generate a 32-byte random string

// if(!hash_equals($_SESSION['token'], $_POST['token'])){
// 	die("Request forgery detected");
// }

$stmt = $mysqli->prepare("select event_id from events where username=? and title=? and date=?");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => $mysqli->error));
        $stmt->close();
	exit;
}

$stmt->bind_param('sss', $username, $title, $dateformatted);

$stmt->execute();

$stmt->bind_result($event_id);

$stmt->fetch();

$id = $event_id;

$stmt->close();

//Update the values of the title and date to new values

$stmt = $mysqli->prepare("update events set title=?, date=? where event_id=?");

if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => $mysqli->error));
        $stmt->close();
	exit;
}

$stmt->bind_param('sss', $new_title, $new_datetime, $id);

$stmt->execute();


echo json_encode(array(
    "success" => true,
    "message" => "Event modified",
    "id"=>$event_id,
));

$stmt->close();


?>

