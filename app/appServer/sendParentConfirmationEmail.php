<?php
/**
 * This example shows settings to use when sending via Google's Gmail servers.
 */
//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Etc/UTC');
require_once './confirmationEmailText.php';
require_once './webmasterPassword.php';
require_once '/gmail-api/vendor/autoload.php';
require_once './phpmailer/src/PHPMailer.php';
require_once './phpmailer/src/Exception.php';
require 'phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

//Create a new PHPMailer instance
$mail = new PHPMailer;
$inputJSON = file_get_contents('php://input');
echo $inputJSON;
$input = json_decode($inputJSON, TRUE);
$parentEmailAddr = $input['parentEmailAddr'];
$parentFirstName = $input['parentFirstName'];
$volunteerFirstName = $input['teerFirstName'];
// format data
ucwords($firstName);
ucwords($lastName);
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
$mail->Password = $webmasterPassword;
//Set who the message is to be sent from
$mail->setFrom('webmaster@summerinthecity.com', 'Summer in the City');
$mail->addReplyTo('hello@summerinthecity.com', 'Summer in the City');
// //Set an alternative reply-to address
// $mail->addReplyTo('replyto@example.com', 'First Last');
//Set who the message is to be sent to
echo $parentEmailAddr;
$mail->addAddress($parentEmailAddr);
//Set the subject line
$mail->Subject = "Receipt: Thanks for your donation";
$emailString = str_replace("[PARENT FIRST NAME]", $parentFirstName, $emailText);
$emailString = str_replace("[VOLUNTEER FIRST NAME]", $volunteerFirstName, $emailString);
$message = $emailString;
$mail->msgHTML($messageString);
//send the message, check for errors
if (!$mail->send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message sent!";
}


// /**
//  * Returns an authorized API client.
//  * @return Google_Client the authorized client object
//  */
// function getClient()
// {
//     $client = new Google_Client();
//     $client->setApplicationName('SITC Registration');
//     $client->setScopes(Google_Service_Gmail::GMAIL_READONLY);
//     $client->setAuthConfig('credentials.json');
//     $client->setAccessType('offline');
//     $client->setPrompt('select_account consent');

//     // Load previously authorized token from a file, if it exists.
//     // The file token.json stores the user's access and refresh tokens, and is
//     // created automatically when the authorization flow completes for the first
//     // time.
//     $tokenPath = 'token.json';
//     if (file_exists($tokenPath)) {
//         $accessToken = json_decode(file_get_contents($tokenPath), true);
//         $client->setAccessToken($accessToken);
//     }

//     // If there is no previous token or it's expired.
//     if ($client->isAccessTokenExpired()) {
//         // Refresh the token if possible, else fetch a new one.
//         if ($client->getRefreshToken()) {
//             $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
//         } else {
//             // Request authorization from the user.
//             $authUrl = $client->createAuthUrl();
//             printf("Open the following link in your browser:\n%s\n", $authUrl);
//             print 'Enter verification code: ';
//             $authCode = trim(fgets(STDIN));

//             // Exchange authorization code for an access token.
//             $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);
//             $client->setAccessToken($accessToken);

//             // Check to see if there was an error.
//             if (array_key_exists('error', $accessToken)) {
//                 throw new Exception(join(', ', $accessToken));
//             }
//         }
//         // Save the token to a file.
//         if (!file_exists(dirname($tokenPath))) {
//             mkdir(dirname($tokenPath), 0700, true);
//         }
//         file_put_contents($tokenPath, json_encode($client->getAccessToken()));
//     }
//     return $client;
// }
?>





 <?php
   function sanitize($var) {
     $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
     return $clean_var;
   }
 ?>
