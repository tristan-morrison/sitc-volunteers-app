var app = angular.module('volunteersApp')

app.controller('RegistrationController', ['$scope', '$log', '$http', '$state', function($scope, $log, $http, $state) {

  $log.log('RegistrationController is running!')

  $scope.person = {}
  $scope.emergencyContact1 = {}
  $scope.emergencyContact2 = {}

  // init values for debugging purposes
  $scope.person["firstName"] = "Linda"
  $scope.person["lastName"] = "Cruise"
  $scope.person["phone"] = "7348756548"
  $scope.person["ethnicity"] = "white"
  $scope.person["religion"] = "hindu"

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
      $log.log("Person info returned from server: " + dump(response, 'none'))
    })

  }

}])
