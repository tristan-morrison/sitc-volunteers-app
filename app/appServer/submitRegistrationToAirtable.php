<?php

  $airtable_api_key = 'appNWDa6ZElvW44m2';

  $inputJSON = file_get_contents('php://input');
  $input = json_decode($inputJSON, TRUE);

  $personInfo = $input['personInfo'];
  $regInfo = $input['regInfo'];
  $emergencyContact = $input['emergencyContact1'];

  $curl = curl_init("https://api.airtable.com/v0/$airtable_api_key/Profiles");

  $headers = array(
    "Authorization: Bearer keydn7CwS79jE483I",
    "Content-Type: application/json"
  );

  $fields = array();
  foreach ($personInfo as $fieldId => $value) {
    if (getFieldName(0, $fieldId)) {
      $valToSubmit = $value;
      $fieldName = getFieldName(0, $fieldId);

      if ($fieldId == "primaryCarpool_id") {
        $valToSubmit = [$value];
      }

      $fields[$fieldName] = $valToSubmit;
    }
  }
  foreach ($regInfo as $fieldId => $value) {
    if (getFieldName(0, $fieldId)) {
      $valToSubmit = $value;
      $fieldName = getFieldName(0, $fieldId);

      if ($fieldId == "gender") {
        $valToSubmit = getGender($value);
      } else if ($fieldId == "driverPermit") {
        $valToSubmit = getDriverPermit($value);

        if ($value == 'isAdult' || $value == 'isMinorWithPermission') {
          $fields['Has Car'] = true;
        }
      } else if ($fieldId == "shirtSize") {
        $valToSubmit = strtoupper($value);
      } else if ($fieldId == "paymentMethod") {
        $valToSubmit = getPaymentMethod($value);
      } else if ($fieldId == "birthdate") {
        $valToSubmit = '03-03-2019';
      } else if ($fieldId == 'paymentAmount') {
        $valToSubmit = $value / 100;
      }

      $fields[$fieldName] = $valToSubmit;
    }
  }
  foreach ($emergencyContact as $fieldId => $value) {
    if (getFieldName(1, $fieldId)) {
      $valToSubmit = $value;
      $fieldName = getFieldName(1, $fieldId);

      if ($fieldId == "parentDriverAbility") {
        $valToSubmit = getParentDriverAbility($value);
      }

      $fields[$fieldName] = $valToSubmit;
    }
  }

  $fieldsObj = array(
    "fields" => $fields
  );

  $data_str = json_encode($fieldsObj);

  curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $data_str);

  // automatically echoes the result
  curl_exec($curl);


  function getFieldName ($group, $fieldId) {
    $personInfoFields = array(
      "firstName" => "First Name",
      "lastName" => "Last Name",
      "primaryCarpool_id" => "Primary Carpool",
      "birthdate" => "Birthdate",
      "email" => "Email",
      "gender" => "Gender",
      "gender" => "Gender Other",
      "phone" => "Phone",
      "altPhone" => "Alternate Phone",
      "address" => "Address",
      "addressLineTwo" => "Address Line 2",
      "city" => "City",
      "state" => "State",
      "zip" => "Zip",
      "highSchool" => "High School",
      "hsGradYear" => "H.S. Grad Year",
      "college" => "College",
      "driverPermit" => "Driver Ability",
      "shirtSize" => "Shirt Size",
      "colGradYear" => "College Grad Year",
      "paymentMethod" => "Payment Method",
      "myPaymentToken" => "Field678",
      "paymentAmount" => "Amount Paid",
      "initials" => "Waiver Initials",
      "initialedDate" => "Stripe Payment Token",
      "parentInitials" => "Waiver Initials Parent",
      "parentInitialedDate" => "Waiver Initials Parent Date"
    );

    $emerConFields = array(
      "nonParent" => "Non-parent Emer Contact",
      "firstName" => "Parent First Name",
      "lastName" => "Parent Last Name",
      "email" => "Parent Email",
      "phone" => "Parent Phone",
      "altPhone" => "Parent Alternate Phone",
      "parentDriverAbility" => "Parent Driver Ability"
    );

    if ($group == 0) {
      return $personInfoFields[$fieldId];
    } else {
      return $emerConFields[$fieldId];
    }
  }

  function getGender ($genderId) {
    $genders = array(
      "female" => "Female",
      "male" => "Male",
      "nonbinary" => "Nonbinary",
      "transWoman" => "Trans Woman",
      "transMan" => "Trans Man",
      "noAnswer" => "Prefer not to answer",
      "other" => "Other"
    );

    return $genders[$genderId];
  }

  function getDriverPermit ($driverPermitId) {
    $driverPermits = array(
      "isAdult" => "18 and can drive",
      "isMinorWithPermission" => "17 and can drive",
      "noPermission" => "Cannot drive"
    );

    return $driverPermits[$driverPermitId];
  }

  function getParentDriverAbility ($parentDriverAbilityId) {
    $parentDriverAbilities = array(
      "maybe" => "May be able",
      "unable" => "Unable",
      "other" => "Other"
    );

    return $parentDriverAbilities[$parentDriverAbilityId];
  }

  function getPaymentMethod ($paymentMethodId) {
    $paymentMethods = array(
      "cash_check" => "Cash",
      "credit" => "Credit",
      "credit_donation_custom_amt" => "Credit",
      "credit_donation_default_amt" => "Credit",
      "waive" => "Waive"
    );

    return $paymentMethods[$paymentMethodId];
  }

?>
