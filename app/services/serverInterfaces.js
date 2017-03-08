var app = angular.module('volunteersApp')

app.factory('getCarpoolSites', ['$log', '$q', '$http', function($log, $q, $http) {

  return function() {
    $log.log('getCarpoolSites ran!')
    var defer = $q.defer()

     $http({
      url: "app/appServer/getCarpoolSites.php",
      method: "GET"
    }).then(
      function(response) {
        var sites = {}
        response.data.forEach(function(currentSite) {
          sites[currentSite.carpoolSite_id] = currentSite
        })

        defer.resolve(sites)
      },
      function(error) {
        //TODO error handling
      })

    return defer.promise
  }
}])
