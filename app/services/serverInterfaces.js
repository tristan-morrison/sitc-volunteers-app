var app = angular.module('volunteersApp')

app.factory('submitRegChargeToStripe', ['$log', '$q', '$http', function($log, $q, $http) {

  return function(myStripeToken, myAmount, myVolName) {

    var description = "Summer in the City registration fee for " + myVolName
    var statementLabel = "Sum in the City Reg."


    return $http({
      method: "POST",
      url: "app/appServer/submitChargeToStripe.php",
      params: {
        "amount": myAmount,
        "currency": "USD",
        "description": description,
        "shipping": null,
        "source": myStripeToken,
        "statement_descriptor": statementLabel,
      }
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
      url: "https://api.airtable.com/v0/appNWDa6ZElvW44m2/Carpool%20Sites?api_key=keydn7CwS79jE483I",
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
