<?php

  require_once 'sitc_workforce_creds.php';
  require_once __DIR__ . '/../../bower_components/PHPMailer/PHPMailerAutoload.php';


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

  $mail = new PHPMailer;

  $mail->SMTPDebug = 3;                               // Enable verbose debug output

  $mail->isSMTP();                                      // Set mailer to use SMTP
  $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
  $mail->SMTPAuth = true;                               // Enable SMTP authentication
  $mail->Username = 'tristan@summerinthecity.com';                 // SMTP username
  $mail->Password = 'Tko-14-aaR';                           // SMTP password
  $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
  $mail->Port = 587;                                    // TCP port to connect to

  $mail->setFrom('tristan@summerinthecity.com', 'Mailer');
  $mail->addAddress('tech@summerinthecity.com', 'Tech User');     // Add a recipient

  $mail->isHTML(true);                                  // Set email format to HTML

  $mail->Subject = 'Here is the subject';

  $mail->Body = '<html><body>';
  $mail->Body .= "<h3>ucwords($name) just registered, and they said they can drive</h3>";
  $mail->Body .= "<h4>Follow up with them to seal the deal!</h4>";
  $mail->Body .= "<br /><br />Here's their info:<br />";
  $mail->Body .= "<strong>Email: </strong>$email";
  $mail->Body .= "<strong>Phone: </strong>$phone";
  $mail->Body .= "<strong>High School: </strong>$highSchool";
  $mail->Body .= "<strong>Carpool Site: </strong>$carpoolSite";
  $mail->Body .= '</html></body>';


  // $headers = "From: $senderEmail" . "\r\n" . "Reply-To: $senderEmail" . "\r\n";

  // Sending email
  if(!$mail->send()) {
    error_log("Message failed to send");
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
  } else {
    echo 'Message has been sent';
    error_log('Message has been sent');
  }

?>

 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>
