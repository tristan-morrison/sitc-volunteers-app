var app = angular.module('volunteersApp')

app.controller('FailureController', ['$scope', '$log', '$window', function($scope, $log, $window) {

  $scope.printPartTwo = function() {
    printJS('media/registrationPartII.pdf')
  }

}])
