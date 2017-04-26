<?php

  require_once 'sitc_workforce_creds.php';

  error_log("*** notifyDirectorOfDriver.php IS RUNNING");

  $info = (isset($_GET['info'])) ? json_decode($_GET['info'], true) : null;
  if (!$info) {
    exit(402); // improper request
  }

  $name = $info['name'];
  $email = $info['email'];
  $phone = $info['phone'];
  $highSchool = $info['highSchool'];
  $carpoolSite = $info['carpoolSite'];

  $to = $directorEmail;
  $subject = "A new driver just registered to volunteer";

  $message = '<html><body>';
  $message .= "<h3>ucwords($name) just registered, and they said they can drive</h3>";
  $message .= "<h4>Follow up with them to seal the deal!</h4>";
  $message .= "<br /><br />Here's their info:<br />";
  $message .= "<strong>Email: </strong>$email";
  $message .= "<strong>Phone: </strong>$phone";
  $message .= "<strong>High School: </strong>$highSchool";
  $message .= "<strong>Carpool Site: </strong>$carpoolSite";

  $headers = "From: $senderEmail" . "\r\n" . "Reply-To: $senderEmail" . "\r\n";

  // Sending email
  if(mail($to, $subject, $message, $headers)){
    exit(200);
  } else{
    exit(400); // failed
  }
?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>
