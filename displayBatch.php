
<style>
    textarea {
        position: absolute;
        top: 10%;
        width: 100%;
        height: 90%;
    }
</style>
<title>Donnée d'entrainements</title>
<center>
<table>
    <tr>
        <td colspan="2" id="nbParties"></td>
    </tr>
    <tr>
        <td><input type='button' value='batch_x' onclick="displayX()"/></td> <td><input type='button' value='batch_y' onclick="displayY()"/></td> 
    </tr>
</table>
<textarea id="batch_x" style='display: none' readonly></textarea>
<textarea id="batch_y" style='display: none' readonly></textarea>

</center>

<script>
    <?php
    $user = null;
    if (isset($_GET['user'])) {
        $user = $_GET['user'];
    }

    $limit = null;
    if (isset($_GET['limit'])) {
        $limit = $_GET['limit'];
    }

    $minScore = null;
    if (isset($_GET['minScore'])) {
        $minScore = $_GET['minScore'];
    }

    $request = "select batch_x,batch_y from datas";
    if ($user != null | $minScore != null) {
        $request .= " where";
        if ($user != null) {
            $request .= " user = '".$user."'";
        }
        if ($minScore != null) {
            if (explode(" ", $request)[sizeof(explode(" ", $request))-1] != "where") {
                $request .= " and";        
            }
            $request .= " score >= ".$minScore;
        }
    }
    if ($limit != null) {
        $request .= " limit ".$limit;
    }
    $request .= ";";

    //error_log("request => ".$request);

    $bdd = new PDO('mysql:host=127.0.0.1;dbname=datas2048;charset=utf8', 'julien', 'ctrl980', array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING));

    $rep = $bdd->prepare($request);
    $rep->execute();

    $result = array();
    $len = 0;
    foreach ($rep as $row) {
        array_push($result, array());
        foreach ($row as $index => $val) {
            $result[$len][$index] = $val;
        }
        $len += 1;
    }

    $batch_xT = "[";
    $batch_yT = "[";

    $i = 0;
    foreach ($result as $row) {
        $batch_xT .= substr($row['batch_x'], 1, -1);
        $batch_yT .= substr($row['batch_y'], 1, -1);
        if ($i < $len-1) {
            $batch_xT .= ",";
            $batch_yT .= ",";
        }
        $i += 1;
    }
    $batch_xT .= "]";
    $batch_yT .= "]";

    echo "const batch_x = '".$batch_xT."';\n";
    echo "const batch_y = '".$batch_yT."';\n";
    echo "const nbParties = ".$len;
?>

document.getElementById("batch_x").value = batch_x;
document.getElementById("batch_y").value = batch_y;
document.getElementById("nbParties").innerHTML = nbParties+" parties";

function displayY() {
    document.getElementById("batch_x").style.display = "none";
    document.getElementById("batch_y").style.display = "block";
}

function displayX() {
    document.getElementById("batch_y").style.display = "none";
    document.getElementById("batch_x").style.display = "block";
}


</script>