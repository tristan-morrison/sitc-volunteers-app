<?php

  require_once 'sitc_workforce_creds.php';
  require_once __DIR__ . '/../../bower_components/Wufoo-PHP-API-Wrapper/WufooApiWrapper.php';

  $person = json_decode($_GET["person"], true);
  $emergencyContact1 = json_decode($_GET["emergencyContact1"], true);
  $emergencyContact2 = json_decode($_GET["emergencyContact2"], true);


  $postArray = array();
  foreach ($person as $key => $value) {
    $fieldId = getFieldId(1, $key);
    $value = sanitize($value);
    $wufooField = new WufooSubmitField($fieldId, $value);
    array_push($postArray, $wufooField);
  }

  foreach ($emergencyContact1 as $key => $value) {
    $fieldId = getFieldId(2, $key);
    $value = sanitize($value);
    $wufooField = new WufooSubmitField($fieldId, $value);
    array_push($postArray, $wufooField);
  }

  foreach ($emergencyContact2 as $key => $value) {
    $fieldId = getFieldId(3, $key);
    $value = sanitize($value);
    $wufooField = new WufooSubmitField($fieldId, $value);
    array_push($postArray, $wufooField);
  }

  echo "postArray: " . var_dump($postArray);

  // Create class for WufooApiWrapper
  $wrapper = new WufooApiWrapper('FXRL-LPSN-VWJG-SCCK', 'sitc');
  print_r($wrapper->entryPost('m2rnmzz0ythmjv', $postArray));

  // $connection = new mysqli($hostname, $username, $password, $database);
  // if ($connection->connect_error)
  //   die ($connection->connect_error);
  //
  // $query = "SELECT * FROM CarpoolSite";
  // $carpoolSites_result = $connection->query($query);
  // if ($connection->error) {
  //   die ($connection->error);
  // }
  //
  // $sites = array();
  // while ($currentSite = $carpoolSites_result->fetch_assoc()) {
  //   $sites[] = $currentSite;
  // }

  // echo json_encode($person);

 ?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }

   function getFieldId($fromGroup, $withLabel) {
     $regInfoFields = array(
       "firstName" => "Field1",
       "lastName" => "Field2",
       "birthdate" => "Field676",
       "email" => "Field15",
       "gender" => "Field462",
       "phone" => "Field16",
       "altPhone" => "Field17",
       "address" => "Field9",
       "addressLineTwo" => "Field10",
       "city" => "Field11",
       "state" => "Field12",
       "zip" => "Field13",
       "ethnicity" => "Field152",
       "religion" => "Field153",
       "highSchool" => "Field259",
       "hsGradYear" => "Field6",
       "college" => "Field150",
       "primaryCarpool_id" => "Field44",
       "driverPermit" => "Field47",
       "shirtSize" => "Field155",
       "colGradYear" => "Field673",
       "paymentMethod" => "Field45"
     );

     $emerCon1Fields = array(
       "firstName" => "Field21",
       "lastName" => "Field22",
       "email" => "Field25",
       "phone" => "Field23",
       "altPhone" => "Field24",
       "address" => "Field26",
       "addressLineTwo" => "Field27",
       "city" => "Field28",
       "state" => "Field29",
       "zip" => "Field30",
       "sendNewsletter" => "Field261"
     );

     $emerCon2Fields = array(
       "firstName" => "Field32",
       "lastName" => "Field33",
       "email" => "Field36",
       "phone" => "Field34",
       "altPhone" => "Field35",
       "address" => "Field37",
       "addressLineTwo" => "Field38",
       "city" => "Field39",
       "state" => "Field40",
       "zip" => "Field41",
       "sendNewsletter" => "Field361"
     );

     switch ($fromGroup) {
       case 1:
        return $regInfoFields[$withLabel];
        break;
       case 2:
        return $emerCon1Fields[$withLabel];
        break;
       case 3:
        return $emerCon2Fields[$withLabel];
        break;
       default:
        return null;

     }
   }
 ?>
