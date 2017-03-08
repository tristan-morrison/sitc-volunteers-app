var app = angular.module('volunteersApp')

app.controller('RegistrationController', ['$scope', '$log', '$http', '$state', function($scope, $log, $http, $state) {

  $log.log('RegistrationController is running!')

  $scope.person = {}
  $scope.emergencyContact1 = {}
  $scope.emergencyContact2 = {}

  $scope.gotoState = function(destinationState) {
    $state.go('registration.' + destinationState)
  }

}])
