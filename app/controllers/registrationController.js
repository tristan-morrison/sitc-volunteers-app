var app = angular.module('volunteersApp')

app.controller('RegistrationController', ['$scope', '$log', '$http', '$state', '$q', 'submitRegistrationToDb', 'submitChargeToStripe', 'getCarpoolSites', 'notifyDirectorOfDriver', 'notifyDirectorOfDonation', 'submitRegistrationToAirtable', 'captureCharge', function($scope, $log, $http, $state, $q, submitRegistrationToDb, submitChargeToStripe, getCarpoolSites, notifyDirectorOfDriver, notifyDirectorOfDonation, submitRegistrationToAirtable, captureCharge) {

  $log.log('RegistrationController is running!')

  $scope.personInfo = {}
  $scope.regInfo = {}
  $scope.emergencyContact1 = {}
  $scope.emergencyContact2 = {}

  $scope.carpoolSites = {}
  getCarpoolSites().then(function(sites) {
    $scope.carpoolSites = sites
  })
  $log.log("carpoolSites: " + dump($scope.carpoolSites, 'none'))

  if (isDevMode()) {
    // -- init values for debugging purposes
    // person values
    $scope.personInfo["firstName"] = "Audrey"
    $scope.personInfo["lastName"] = "Black"
    $scope.personInfo["primaryCarpool_id"] = "recSzSWb5Ex1beUOo"
    $scope.regInfo["birthdate"] = "02251999"
    $scope.regInfo["phone"] = "6549874560"
    $scope.regInfo["altPhone"] = "6549873210"
    $scope.regInfo["email"] = "Audrey@me.com"
    $scope.regInfo["address"] = "78542 Some St."
    $scope.regInfo["city"] = "Ann Arbor"
    $scope.regInfo["state"] = "MI"
    $scope.regInfo["zip"] = "48209"
    $scope.regInfo["gender"] = "male"
    $scope.regInfo["ethnicity"] = "white"
    $scope.regInfo["religion"] = "hindu"
    // $scope.regInfo["highSchool"] = "Greenhills"
    $scope.regInfo["hsGradYear"] = 2012
    $scope.regInfo["college"] = "College of Wooster"
    $scope.regInfo["colGradYear"] = 2016
    $scope.regInfo["driverPermit"] = "isAdult"
    $scope.regInfo["shirtSize"] = "S"
    $scope.regInfo["paymentMethod"] = "credit"

    // emergencyContact1 values
    $scope.emergencyContact1["firstName"] = "Melissa"
    $scope.emergencyContact1["lastName"] = "McCarthy"
    $scope.emergencyContact1["email"] = "mom@me.com"
    $scope.emergencyContact1["phone"] = "6549876540"
    $scope.emergencyContact1["altPhone"] = "4567891320"
    $scope.emergencyContact1["address"] = "546 Mystery Rd"
    $scope.emergencyContact1["addressLineTwo"] = "apt 56"
    $scope.emergencyContact1["city"] = "Farmville"
    $scope.emergencyContact1["state"] = "MI"
    $scope.emergencyContact1["zip"] = "48209"
    $scope.emergencyContact1["sendNewsletter"] = 1
    //
    // emergencyContact2 values
    $scope.emergencyContact2["firstName"] = "Alec"
    $scope.emergencyContact2["lastName"] = "Baldwin"
    $scope.emergencyContact2["email"] = "dad@me.com"
    $scope.emergencyContact2["phone"] = "9874563210"
    $scope.emergencyContact2["altPhone"] = "6543219874"
    $scope.emergencyContact2["address"] = "546 Mystery Rd"
    $scope.emergencyContact2["addressLineTwo"] = "apt 56"
    $scope.emergencyContact2["city"] = "Farmville"
    $scope.emergencyContact2["state"] = "MI"
    $scope.emergencyContact2["zip"] = "48209"
    $scope.emergencyContact2["sendNewsletter"] = 0
  }

  // make MI default state
  $scope.regInfo["state"] = "MI"

  $scope.goToState = function(originForm, destinationState, validate) {
    $log.log("destinationState: " + destinationState + ", originForm: " + originForm)
    if (validate == 1) {
      $log.log("validating!")
      if (!originForm.$valid) {
        // from iandotkelly on StackOverflow
        var firstInvalid = angular.element(document.querySelector('.ng-invalid').querySelector('.ng-invalid'));
        if (firstInvalid) {
          $log.log("Found an invalid field in the form " + originForm + ": " + firstInvalid.name)
          firstInvalid.addClass('ng-touched')
          firstInvalid.focus()
          return
        }
      }
    }
    $state.go('registration.' + destinationState)
    window.scrollTo(0,0)
  }

  /*
   * submitRegistration
   * Submits user's info, via $scope.regInfo object, to PHP script that enters the info into the Wufoo database and the app's MySQL db
   * Pre: All properties of $scope.regInfo that hold info required by Wufoo or app db are defined with valid values
   * Post: Records in the Wufoo form and the app db have been created with this user's data
   */
  $scope.submitRegistration = function(chargeId = null) {
    $scope.showLoader = true

    var personInfo_json = $scope.personInfo
    JSON.stringify(personInfo_json)

    var regInfo_json = $scope.regInfo
    JSON.stringify(regInfo_json)

    var emergencyContact1_json = $scope.emergencyContact1
    JSON.stringify(emergencyContact1_json)

    var emergencyContact2_json = $scope.emergencyContact2
    JSON.stringify(emergencyContact2_json)

    submitRegistrationToAirtable({
      "personInfo" : personInfo_json,
      "regInfo" : regInfo_json,
      "emergencyContact1" : emergencyContact1_json
    }).then(function success(response) {
      var content = response.data;
      if (response.status == 200 && content.id) {
        if (chargeId) {
          captureCharge(chargeId).then(function success(response) {
            if (response.status == 200) {
              $log.log("SUCCESS!");
              $log.log(response.data);
              $scope.goToState(null, 'success', 0);
            }
          }, function failure(response) {
            $log.log("FAILURE!");
            $log.log(response);
            $scope.goToState(null, 'failure', 0);
          })
        } else {
          $scope.goToState(null, 'success', 0);
        }
      } else {
        $scope.goToState(null, 'failure', 0);
      }
    }, function failure(response) {
        $scope.goToState(null, 'failure', 0);

    })


    // send emails to people who are drivers and/or make extra donations
    if ($scope.regInfo.driverPermit === 'isAdult' || $scope.regInfo.driverPermit === 'isMinorWithPermission') {
      var info = {
        "firstName" : $scope.personInfo.firstName,
        "lastName" : $scope.personInfo.lastName,
        "highSchool" : ($scope.regInfo.highSchool) ? $scope.regInfo.highSchool : $scope.regInfo.otherHighSchool,
        "hsGradYear" : $scope.regInfo.hsGradYear,
        "email" : $scope.regInfo.email,
        "phone" : $scope.regInfo.phone,
        "carpoolSite" : $scope.carpoolSites[$scope.personInfo.primaryCarpool_id]['Shortname'],
        "firstTimeTeer" : $scope.regInfo.firstTimeTeer
      }
      notifyDirectorOfDriver(info).then(function success(response) {
        $log.log("Response from notifyDirectorOfDriver.php: " + dump(response, 'none'))
      }, function failure (error) {
        $log.log("error from notifyDirectorOfDriver.php: " + dump(error, 'none'))

      })
    }

    if ($scope.regInfo.paymentAmount > 4000) {
      var info = {
        "firstName" : $scope.personInfo.firstName,
        "lastName" : $scope.personInfo.lastName,
        "highSchool" : ($scope.regInfo.highSchool) ? $scope.regInfo.highSchool : $scope.regInfo.otherHighSchool,
        "hsGradYear" : $scope.regInfo.hsGradYear,
        "email" : $scope.regInfo.email,
        "phone" : $scope.regInfo.phone,
        "carpoolSite" : $scope.carpoolSites[$scope.personInfo.primaryCarpool_id].name,
        "paymentAmount" : $scope.regInfo.paymentAmount,
        "emer1_firstName" : $scope.emergencyContact1.firstName,
        "emer1_lastName" : $scope.emergencyContact1.lastName,
        "emer1_phone" : $scope.emergencyContact1.phone,
        "emer1_email" : $scope.emergencyContact1.email,
        "emer1_altPhone" : $scope.emergencyContact1.altPhone,
        "emer2_firstName" : $scope.emergencyContact2.firstName,
        "emer2_lastName" : $scope.emergencyContact2.lastName,
        "emer2_phone" : $scope.emergencyContact2.phone,
        "emer2_email" : $scope.emergencyContact2.email,
        "emer2_altPhone" : $scope.emergencyContact2.altPhone
      }
      notifyDirectorOfDonation(info).then(function success(response) {
        $log.log("Response from notifyDirectorOfDonation.php: " + dump(response, 'none'))
      }, function failure (error) {
        $log.log("error from notifyDirectorOfDonation.php: " + dump(error, 'none'))
      })
    }
  }

}])
