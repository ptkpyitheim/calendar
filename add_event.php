

<?php

        
    header("Content-Type: application/json");
    ini_set("session.cookie_httponly",1);

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username = $json_obj['username'];

    if (!isset($username)) {
        echo json_encode(array(
            "success" => false,
            "message" => "Not logged in. Username is empty"));
        exit;
    }


    $title = $json_obj['title'];
    $datetime = $json_obj['datetime'];
    $dateformatted = date("Y-m-d H:i:s", strtotime($datetime));

    $color = $json_obj['color'];
    // $color = 'darkorange';

    require 'database.php';

    $stmt = $mysqli->prepare("insert into events (username, title, date, color) values (?, ?, ?, ?)");

    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => $mysqli->error));
        $stmt->close();
        exit;
    }

    $stmt->bind_param('ssss', $username, $title, $dateformatted, $color);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Event Added Successfully!",
        "title" => $title,
        "datetime" => $dateformatted
    ));



?>

