<?php

  require_once 'sitc_workforce_creds.php';
  date_default_timezone_set('UTC');

  $connection = new mysqli($hostname, $username, $password, $database);
  if ($connection->connect_error)
    die ($connection->connect_error);

  $personInfo = json_decode($_GET["personInfo"], true);
  $regInfo = json_decode($_GET["regInfo"], true);
  $emergencyContact1 = json_decode($_GET["emergencyContact1"], true);
  $emergencyContact2 = json_decode($_GET["emergencyContact2"], true);

  // -- INSERT the emergency contacts first, because we need to include their ID's in the person record
  $emerCon1_id = postEmergencyContact($connection, $emergencyContact1);
  $emerCon2_id = postEmergencyContact($connection, $emergencyContact2);

  // -- INSERT new record into Person tbl
  $personFields = array();
  $personValues = array();
  foreach ($personInfo as $key => $value) {
    array_push($personFields, $key);
    array_push($personValues, $value);
  }

  // add hasCar column according to val of driverPermit
  if (isset($regInfo["driverPermit"])) {
    array_push($personFields, "hasCar");
    array_push($personValues, getHasCarBool($regInfo["driverPermit"]));
  }

  // stringify fields arrays for query string
  $personFields = join(', ', $personFields);
  $personValues = '"' . join('", "', $personValues) . '"';

  $query = "INSERT INTO Person($personFields) VALUES ($personValues)";
  $person_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }
  else {
    $person_id = $connection->insert_id;
  }
  // echo "||person_id: $person_id";

  // -- INSERT new record into RegistrationInfo tbl using the person_id of our new Person record
  // make birthdate into mysql DATE format
  $regInfo["birthdate"] = date('Y-m-d', strtotime(str_replace('-', '/', $regInfo["birthdate"])));

  $regInfoFields_nums = array();
  $regInfoFields_strings = array();
  $regInfoValues_nums = array();
  $regInfoValues_strings = array();
  foreach ($regInfo as $key => $value) {
    // have to keep separate because in query string, strings need quotes and nums can't have them
    if (gettype($value) == "integer") {
      array_push($regInfoFields_nums, $key);
      array_push($regInfoValues_nums, $value);
    }
    else {
      array_push($regInfoFields_strings, $key);
      array_push($regInfoValues_strings, $value);
    }
  }

  // add additional vals to query
  array_push($regInfoFields_nums, "person_id", "emerContactPrimary_id", "emerContactSecondary_id");
  array_push($regInfoValues_nums, $person_id, $emerCon1_id, $emerCon2_id);
  $colCount = count($regInfoFields_nums) + count($regInfoFields_strings);
  $valCount = count($regInfoValues_nums) + count($regInfoValues_strings);
  // echo "col count: $colCount\nvalue count: $valCount";

  // stringify fields arrays for query string
  $regInfoFields = join(', ', $regInfoFields_strings) . ", " . join(', ', $regInfoFields_nums);
  $regInfoValues = '"' . join('", "', $regInfoValues_strings) . '", ' . join(', ', $regInfoValues_nums);
  // echo "regInfoValues" . $regInfoValues;

  $query = "INSERT INTO RegistrationInfo($regInfoFields) VALUES ($regInfoValues)";
  error_log('Query: ' . $query);
  $regInfo_result = $connection->query($query);
  if ($connection->error) {
    die ($connection->error);
  }
  else {
    echo json_encode($regInfo_result);
  }
?>

 <?php

   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }

   function postEmergencyContact($connection, $info) {

     $fields = array();
     $values = array();

     foreach ($info as $key => $value) {
       array_push($fields, $key);
       array_push($values, sanitize($value));
     }

     $fields = join(', ', $fields);
     $values = '"' . join('", "', $values) . '"';

     // ON DUP KEY catches instance where new entry violates (email, phone, altPhone) unique index - i.e. this person has already been entered as an emer con for another volunteer
     $email = $info["email"];
     $phone = $info["phone"];
     $altPhone = $info["altPhone"];
     $query = "INSERT INTO EmergencyContact($fields) VALUES ($values)";
    //  $connection = new mysqli($hostname, $username, $password, $database);
     if ($connection->connect_error) {
       die ($connection->error);
     }

     $query_result = $connection->query($query);
     if ($connection->errno == 1062 || $connection->errno == "1062") {
       $query = "SELECT emerContact_id FROM EmergencyContact e WHERE e.email='$email' && e.phone='$phone' && e.altPhone='$altPhone'";
       $query_result = $connection->query($query);
       $result_assoc = $query_result->fetch_assoc();
       $id = $result_assoc["emerContact_id"];
     }
     else {
       $id = $connection->insert_id;
     }

     return $id;
   }

   function getHasCarBool($withDriverPermit) {
     switch ($withDriverPermit) {
       case "isAdult":
        return 1;
        break;
       case "isMinorWithPermission":
        return 1;
        break;
       case "noPermission":
        return 0;
        break;
       default:
        return 0;
     }
   }

?>
