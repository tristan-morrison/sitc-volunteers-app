var app = angular.module('volunteersApp')

app.controller('RegistrationController', ['$scope', '$log', '$http', '$state', function($scope, $log, $http, $state) {

  $log.log('RegistrationController is running!')

  $scope.person = {}
  $scope.emergencyContact1 = {}
  $scope.emergencyContact2 = {}

  // -- init values for debugging purposes
  // person values
  $scope.person["firstName"] = "Linda"
  $scope.person["lastName"] = "Cruise"
  $scope.person["birthdate"] = "02/25/1999"
  $scope.person["phone"] = "6549874560"
  $scope.person["altPhone"] = "6549873210"
  $scope.person["email"] = "me@me.com"
  $scope.person["address"] = "78542 Some St."
  $scope.person["city"] = "Farmington"
  $scope.person["state"] = "MI"
  $scope.person["zip"] = "48209"
  $scope.person["gender"] = "male"
  $scope.person["ethnicity"] = "white"
  $scope.person["religion"] = "hindu"
  $scope.person["highSchool"] = "Greenhills"
  $scope.person["hsGradYear"] = '2012'
  $scope.person["college"] = "College of Wooster"
  $scope.person["colGradYear"] = "2016"
  $scope.person["primaryCarpool_id"] = "aa"
  $scope.person["driverPermit"] = "isAdult"
  $scope.person["shirtSize"] = "S"
  $scope.person["paymentMethod"] = "credit"

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



  $scope.gotoState = function(destinationState) {
    $state.go('registration.' + destinationState)
  }

  /*
   * submitRegistration
   * Submits user's info, via $scope.person object, to PHP script that enters the info into the Wufoo database and the app's MySQL db
   * Pre: All properties of $scope.person that hold info required by Wufoo or app db are defined with valid values
   * Post: Records in the Wufoo form and the app db have been created with this user's data
   */
  $scope.submitRegistration = function() {

    var person_json = $scope.person
    JSON.stringify(person_json)

    var emergencyContact1_json = $scope.emergencyContact1
    JSON.stringify(emergencyContact1_json)

    var emergencyContact2_json = $scope.emergencyContact2
    JSON.stringify(emergencyContact2_json)

    $http({
      method: "POST",
      url: "app/appServer/submitRegistrationToWufoo.php",
      params: {
        "person" : person_json,
        "emergencyContact1" : emergencyContact1_json,
        "emergencyContact2" : emergencyContact2_json
      }
    }).then(function success(response) {
      var wufooResponseObj = response.data

      if (!wufooResponseObj["Success"]) {
        $log.log("The Wufoo submission failed!! :(")
        // TODO: Handle failed submit to Wufoo by notifying directors that this person needs to be submitted manually
      }

      $log.log("Person info returned from server: " + dump(response, 'none'))
    })

  }

}])
