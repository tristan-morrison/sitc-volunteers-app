var app = angular.module('volunteersApp')

app.factory('submitChargeToStripe', ['$log', '$q', '$http', function($log, $q, $http) {

  return function(payload) {

    return fetch('./app/appServer/submitChargeToStripe.php', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {'content-type': 'application/json'},
    })
  }


}])

app.factory('captureCharge', ['$log', '$q', '$http', function($log, $q, $http) {

  return function(chargeId) {

    return fetch('./app/appServer/captureStripeCharge.php', {
      method: 'POST',
      body: JSON.stringify({chargeId: chargeId}),
      headers: {'content-type': 'application/json'},
    })
  }


}])

app.factory('submitRegistrationToDb', ['$log', '$q', '$http', function($log, $q, $http) {


  return function(myPersonInfo, myRegInfo, myEmerCon1, myEmerCon2) {
    return $http({
      method: "POST",
      url: "app/appServer/submitRegistrationToDb.php",
      params: {
        "personInfo": myPersonInfo,
        "regInfo": myRegInfo,
        "emergencyContact1": myEmerCon1,
        "emergencyContact2": myEmerCon2
      }
    })
  }

}])

app.factory('getCarpoolSites', ['$log', '$q', '$http', function($log, $q, $http) {

  return function() {
    $log.log('getCarpoolSites ran!')
    var defer = $q.defer()

     $http({
      url: `https://api.airtable.com/v0/${getAirtableBase()}/Carpool%20Sites?api_key=keydn7CwS79jE483I`,
      method: "GET"
    }).then(
      function(response) {
        var sites = {}
        console.log(response.data)
        response.data['records'].forEach(function(currentSite) {
          sites[currentSite.id] = currentSite.fields
          sites[currentSite.id]['id'] = currentSite.id
          console.log(sites[currentSite.id])
        })

        defer.resolve(sites)
      },
      function(error) {
        //TODO error handling
      })

    return defer.promise
  }
}])

app.factory('submitRegistrationToAirtable', ['$log', '$q', '$http', function($log, $q, $http) {

  return function(payload) {
    return $http.post("app/appServer/submitRegistrationToAirtable.php", payload);
  }
}])
