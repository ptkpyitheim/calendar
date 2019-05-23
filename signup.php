
<?php
    require 'database.php';

    header("Content-Type: application/json");
    ini_set("session.cookie_httponly", 1);

    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $new_user = $json_obj['username'];
    $new_pass = $json_obj['password'];
    
    /* Check if username already exist */
    $stmt = $mysqli->prepare("select username from userinformation");
    if(!stmt) {
        echo json_encode(array(
            "success" => false,
            "message" => $mysqli->error));
        exit;
    }

    $stmt->execute();

    $stmt->bind_result($name);

    while($stmt->fetch()) {
        if($new_user == $name) {
            echo json_encode(array(
                "success" => false,
                "message" => "Username already exists. Try another."));
            exit;
        }
    }

    $stmt->close();

    $hashed = password_hash($new_pass, PASSWORD_DEFAULT);

    $stmt = $mysqli->prepare("insert into userinformation (username, password) values (?, ?)");
    if(!$stmt) {
        echo json_encode(array(
            "success" => false,
            "message" => $mysqli->error));
        exit;
    }

    $stmt->bind_param('ss', $new_user, $hashed);
    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Successfully signed up!"));
    exit;

?>
