<?php
/**
 * This example shows settings to use when sending via Google's Gmail servers.
 */

//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Etc/UTC');

require_once __DIR__ . '/../../bower_components/phpmailer/PHPMailerAutoload.php';

//Create a new PHPMailer instance
$mail = new PHPMailer;

$info = (isset($_GET['info'])) ? json_decode($_GET['info'], true) : null;
if (!$info) {
  exit(402); // improper request
}

$name = $info['name'];
$email = $info['email'];
$phone = $info['phone'];
$highSchool = $info['highSchool'];
$carpoolSite = $info['carpoolSite'];

// format data
ucwords($name);
$phone = '(' . substr($phone, 0, 3) . ') ' . substr($phone, 3, 3) . '-' . substr($phone, 6);


//Tell PHPMailer to use SMTP
$mail->isSMTP();

//Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 2;

//Ask for HTML-friendly debug output
$mail->Debugoutput = 'html';

//Set the hostname of the mail server
$mail->Host = 'smtp.gmail.com';
// use
// $mail->Host = gethostbyname('smtp.gmail.com');
// if your network does not support SMTP over IPv6

//Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
$mail->Port = 587;

//Set the encryption system to use - ssl (deprecated) or tls
$mail->SMTPSecure = 'tls';

//Whether to use SMTP authentication
$mail->SMTPAuth = true;

//Username to use for SMTP authentication - use full email address for gmail
$mail->Username = "webmaster@summerinthecity.com";

//Password to use for SMTP authentication
$mail->Password = "sitc+2-0*0/2";

//Set who the message is to be sent from
$mail->setFrom('tech@summerinthecity.com', 'SITC Registration');

// //Set an alternative reply-to address
// $mail->addReplyTo('replyto@example.com', 'First Last');

//Set who the message is to be sent to
$mail->addAddress('tristan@summerinthecity.com', 'Tristan');
$mail->addAddress('ben@summerinthecity.com', 'Ben');

//Set the subject line
$mail->Subject = 'A car-endowed volunteer just registered.';

$message = '<html><body>';
$message .= "<h3 style='padding-bottom:0px'>$name just registered, and they said they can drive.</h3>";
$message .= "<h4>Follow up with them to seal the deal!</h4>";
$message .= "<strong>Here's their info:</strong><br />";
$message .= "<strong>Email: </strong>$email<br />";
$message .= "<strong>Phone: </strong>$phone<br />";
$message .= "<strong>High School: </strong>$highSchool<br />";
$message .= "<strong>Carpool Site: </strong>$carpoolSite<br /><br />";
$message .= "<h4>Have a wonderful day.</h4><br />";
$message .= "<span>All our love,</span><br />";
$message .= "<span>Tristan & Tristn</span>";
$message .= '</html></body>';

$mail->msgHTML($message);

//send the message, check for errors
if (!$mail->send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message sent!";
}

?>



 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>
