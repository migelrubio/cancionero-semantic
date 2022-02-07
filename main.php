<?php
  include 'conn.php';
  
  $cmd = $_POST['cmd'];
  // Create connection
  $conn = new mysqli($servername, $username, $password, $dbname);

  // Check connection
  if (!$conn->connect_error) {
    
    if ($cmd == "nueva"){
      $nombre = $_POST['nombre'];
      $interpretes = $_POST['interpretes'];
      $contenido = $_POST['contenido'];
      $sql = "INSERT INTO canciones VALUES (null, '$nombre', '$interpretes', '$contenido', null, NOW())";
      $result = $conn->query($sql);
      if ($result) {
        echo "Cancion guardada";
        $conn->close();
        exit(0);
      } else {
        echo $conn->error;
        $conn->close();
        exit(1);
      }
    }

    if ($cmd == "borrar"){
      $id = $_POST['id'];
      $sql = "DELETE FROM canciones WHERE id = $id";
      $result = $conn->query($sql);
      if ($result) {
        echo "Cancion borrada";
        $conn->close();
        exit(0);
      } else {
        echo "Error al borrar cancion";
        $conn->close();
        exit(1);
      }
    }

    if ($cmd == "modificar") {
      $id = $_POST['id'];
      $nombre = $_POST['nombre'];
      $interpretes = $_POST['interpretes'];
      $contenido = $_POST['contenido'];
      $sql = "UPDATE canciones SET nombre = '$nombre', interpretes = '$interpretes', contenido = '$contenido' WHERE id = $id";
      $result = $conn->query($sql);
      if ($result) {
        echo "Cancion modificada";
        $conn->close();
        exit(0);
      } else {
        echo "Error al modificar cancion " . $result;
        $conn->close();
        exit(1);
      }
    }

    if ($cmd == "listar"){
      $sql = "SELECT * FROM canciones";
      $result = $conn->query($sql);
      if ($result) {
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
          $rows[] = $r;
        }
        echo json_encode($rows);
        $conn->close();
        exit(0);
      } else {
        echo "Error al listar canciones";
        $conn->close();
        exit(1);
      }
    }

    if ($cmd == "buscar"){
      $data = $_POST['data'];
      $sql = "SELECT * FROM canciones WHERE nombre LIKE '%$data%' OR interpretes LIKE '%$data%'";
      $result = $conn->query($sql);
      if ($result) {
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
          $rows[] = $r;
        }
        echo json_encode($rows);
        $conn->close();
        exit(0);
      } else {
        echo "Error al buscar canciones";
        $conn->close();
        exit(1);
      }
    }

    if ($cmd == "canciones") {
      $sql = "SELECT * FROM canciones";
      $result = $conn->query($sql);
      $songs = array();
      if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $songs[] = $row;
        }
      }
      echo json_encode($songs);
      $conn->close();
      exit(0);
    }

    if ($cmd == "cancion") {
      $id = $_POST['id'];
      $sql = "SELECT * FROM canciones WHERE id = $id";
      $result = $conn->query($sql);
      $song = array();
      if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $song = $row;
        }
        $sql = "UPDATE canciones SET last_opened = NOW() WHERE id = $id";
        $conn->query($sql);
      }
      echo json_encode($song);
      $conn->close();
      exit(0);
    }

    if ($cmd == "ultimas") {
      $sql = "SELECT * FROM canciones ORDER BY last_opened DESC LIMIT 10";
      $result = $conn->query($sql);
      $songs = array();
      if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
          $songs[] = $row;
        }
      }
      echo json_encode($songs);
      $conn->close();
      exit(0);
    }

    echo "Comando no reconocido";
    exit(1);
    
  } else {
    echo "Connection failed: " . $conn->connect_error;
    $conn->close();
    exit(1);
  }

?>