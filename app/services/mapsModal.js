var app = angular.module('volunteersApp')

app.factory('mapsModal', ['$log', '$q', '$http', '$sce', '$mdDialog', function($log, $q, $http, $sce, $mdDialog) {

  return function(myDisplayName, myAddress) {
    $mdDialog.show({
      templateUrl: 'app/views/modals/mapsModalView.html',
      clickOutsideToClose: true,
      locals: {
        'displayName': myDisplayName,
        'address': myAddress
      },
      controller: ['$scope', '$log', '$mdDialog', '$sce', 'displayName', 'address', function($scope, $log, $mdDialog, $sce, displayName, address) {
          var apiKey = getGoogleMapsAPIKey()

          $scope.displayName = displayName

          address = address.split(" ").join("+")
          var addressString = address
          var urlString = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${addressString}`
          $scope.srcUrl = $sce.trustAsResourceUrl(urlString)
          $log.log("srcUrl: " + $scope.srcUrl)

          $scope.closeDialog = function() {
            $mdDialog.hide()
          }

      }]

    })
  }
}])
