<?php
/**
 * This example shows settings to use when sending via Google's Gmail servers.
 */

//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Etc/UTC');

require_once 'sitc_workforce_creds.php';

require_once __DIR__ . '/../../bower_components/phpmailer/PHPMailerAutoload.php';

//Create a new PHPMailer instance
$mail = new PHPMailer;

$info = (isset($_GET['info'])) ? json_decode($_GET['info'], true) : null;
if (!$info) {
  exit(402); // improper request
}

// teer info
$firstName = $info['firstName'];
$lastName = $info['lastName'];
$email = $info['email'];
$phone = $info['phone'];
$highSchool = $info['highSchool'];
$hsGradYear = $info['hsGradYear'];
$carpoolSite = $info['carpoolSite'];
$paymentAmount = $info['paymentAmount'];

// Emergency Contact/Parent #1 info
$emer1_firstName = $info['emer1_firstName'];
$emer1_lastName = $info['emer1_lastName'];
$emer1_phone = $info['emer1_phone'];
$emer1_email = $info['emer1_email'];
$emer1_altPhone = $info['emer1_altPhone'];

// Emergency Contact/Parent #2 info
$emer2_firstName = $info['emer2_firstName'];
$emer2_lastName = $info['emer2_lastName'];
$emer2_phone = $info['emer2_phone'];
$emer2_email = $info['emer2_email'];
$emer2_altPhone = $info['emer2_altPhone'];

// format data
ucwords($firstName);
ucwords($lastName);
$totalAmount = $paymentAmount / 100;
$donationAmount = $totalAmount - 40;
$phone = '(' . substr($phone, 0, 3) . ') ' . substr($phone, 3, 3) . '-' . substr($phone, 6);
$emer1_phone = '(' . substr($emer1_phone, 0, 3) . ') ' . substr($emer1_phone, 3, 3) . '-' . substr($emer1_phone, 6);
$emer1_altPhone = '(' . substr($emer1_altPhone, 0, 3) . ') ' . substr($emer1_altPhone, 3, 3) . '-' . substr($emer1_altPhone, 6);
$emer2_phone = '(' . substr($emer2_phone, 0, 3) . ') ' . substr($emer2_phone, 3, 3) . '-' . substr($emer2_phone, 6);
$emer2_altPhone = '(' . substr($emer2_altPhone, 0, 3) . ') ' . substr($emer2_altPhone, 3, 3) . '-' . substr($emer2_altPhone, 6);


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
foreach ($directorEmails as $sendToEmail => $sendToName) {
  $mail->addAddress($sendToEmail, $sendToName);
}
// $mail->addAddress('ben@summerinthecity.com', 'Ben');

//Set the subject line
$mail->Subject = 'Someone just made a donation along with their registration.';

$message = '<html><body>';
$message .= "<h3 style='padding-bottom:0px'>$firstName $lastName just registered, and they paid more than the $40 registration fee.</h3>";
$message .= "<h4>Thank them for their donation to let them know they're not just throwing their money into the abyss ... and also secure their loyalty and increase the likelihood of future donations and whatnot.</h4>";

$message .= "<strong>Total Amount Paid: $$totalAmount</strong> - $40 registration fee = $$donationAmount donation<br />";

// teer info
$message .= "<strong>Here's the teer's info:</strong><br />";
$message .= "<strong>Email: </strong>$email<br />";
$message .= "<strong>Phone: </strong>$phone<br />";
$message .= "<strong>High School: </strong>$highSchool, class of $hsGradYear<br />";
$message .= "<strong>Carpool Site: </strong>$carpoolSite<br />";

$message .= "<h4><strong>And here's the info for the people they listed as their 'Parent / Emergency Contact.'</strong></h4><p>I'm not yet smart enough to be able to tell if this is actually their parent, but maybe you can tell from the last names. Anyway, if they are the teer's parents, might wanna think about thanking them instead of the teer - 'cause let's face it, how many suburbanites do we know who pay their own volunteer registration fees?</p>";

// Emer Contact 1
$message .= "<strong>Person #1</strong><br />";
$message .= "<strong>Name: </strong>$emer1_firstName $emer1_lastName<br />";
$message .= "<strong>Phone: </strong>$emer1_phone<br />";
$message .= "<strong>Alternate Phone: </strong>$emer1_altPhone<br />";
$message .= "<strong>Email: </strong>$emer1_email<br />";
// Emer Contact 2
$message .= "<br /><strong>Person #2</strong><br />";
$message .= "<strong>Name: </strong>$emer2_firstName $emer2_lastName<br />";
$message .= "<strong>Phone: </strong>$emer2_phone<br />";
$message .= "<strong>Alternate Phone: </strong>$emer2_altPhone<br />";
$message .= "<strong>Email: </strong>$emer2_email<br />";



$message .= "<h4>Have a wonderful day.</h4><br />";
$message .= "<span>x's & o's, 1's and 0's,</span><br />";
$message .= "<span>Tristn (and Tristan)</span>";
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
