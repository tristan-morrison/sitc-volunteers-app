var app = angular.module('volunteersApp')

app.factory('mapsModal', ['$log', '$q', '$http', '$sce', '$mdDialog', function($log, $q, $http, $sce, $mdDialog) {

  return function(myDisplayName, myAddress, myCity, myState, myZip) {
    $mdDialog.show({
      templateUrl: 'app/views/modals/mapsModalView.html',
      clickOutsideToClose: true,
      locals: {
        'displayName': myDisplayName,
        'address': myAddress,
        'city': myCity,
        'state': myState,
        'zip': myZip
      },
      controller: ['$scope', '$log', '$mdDialog', '$sce', 'displayName', 'address', 'city', 'state', 'zip', function($scope, $log, $mdDialog, $sce, displayName, address, city, state, zip) {
          var apiKey = getGoogleMapsAPIKey()

          $scope.displayName = displayName

          address = address.split(" ").join("+")
          city = city.split(" ").join("+")
          var addressString = address + "+" + city + "+" + state + "+" + zip
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
