<?php
$batch_x = $_POST['batch_x'];
$batch_y = $_POST['batch_y'];
$user = $_POST['user'];
$score = $_POST['score'];

$bdd = new PDO('mysql:host=127.0.0.1;dbname=datas2048;charset=utf8', 'julien', 'ctrl980', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));

$sql = "INSERT INTO datas VALUES (0,'".$batch_x."','".$batch_y."', '".$user."', ".$score.");";
//error_log("sql => ".$sql);
$rep = $bdd->prepare($sql);
$rep->execute();
$errors = $rep->errorInfo();
if ($errors[0] != 00000) {
    echo json_encode(["rep" => "failed", "errors" => ["[".$errors[0]."] ".$errors[2]." : ".$sql]]);
} else {
    echo json_encode(["rep" => "success"]);
}
?>