<?php

  // API key loads from here so that test key is used in dev environ but live key is used on server
  require_once 'sitc_workforce_creds.php';
  require_once __DIR__ . '/../../bower_components/stripe-php/init.php';

  $amount = isset($_GET["amount"]) ? sanitize($_GET["amount"]) : "";
  $currency = isset($_GET["currency"]) ? sanitize($_GET["currency"]) : "";
  $description = isset($_GET["description"]) ? sanitize($_GET["description"]) : "";
  $shipping = isset($_GET["shipping"]) ? sanitize($_GET["shipping"]) : "";
  $source = isset($_GET["source"]) ? sanitize($_GET["source"]) : "";
  $statement_descriptor = isset($_GET["statement_descriptor"]) ? sanitize($_GET["statement_descriptor"]) : "Summer in the City";

  //NOTE: This is currently the Rex Blankets test key
  \Stripe\Stripe::setApiKey($stripeAPIKey_sk_test);

  $chargeParams = array(
    "amount" => $amount,
    "currency" => $currency,
    "source" => $source,
    "description" => $description,
    "statement_descriptor" => $statement_descriptor
  );

  try {
    $charge = \Stripe\Charge::create($chargeParams);
  } catch (\Stripe\Error\Card $e) {
    // $response = $e->getJsonBody();
    // $err = $response['error'];

    http_response_code($e->getHttpStatus());
  } catch (\Stripe\Error\InvalidRequest $e) {
    http_response_code($e->getHttpStatus());
  } catch (\Stripe\Error\Base $e) {
    $response = $e->getJsonBody();
    $err = $response['error'];
    echo 'Error type: ' . $err['type'] . "\n";
    echo 'Error code: ' . $err['code'] . "\n";
    echo 'Error message: ' . $err['message'] . "\n";
    http_response_code($e->getHttpStatus());
  }

  echo $charge;

?>

<?php
  function sanitize($var) {
    $clean_var = filter_var($var, FILTER_SANITIZE_STRING);
    return $clean_var;
  }
?>
