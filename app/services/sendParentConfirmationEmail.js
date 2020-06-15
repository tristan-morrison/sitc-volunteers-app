var app = angular.module('volunteersApp')

app.factory('sendParentConfirmationEmail', ['$log', '$q', '$http', '$sce', '$mdDialog', function($log, $q, $http, $sce, $mdDialog) {
  return function (parentEmailAddr, parentFirstName, teerFirstName) {
    console.log("parentEmailAddr: " + parentEmailAddr);
      return $http.post("app/appServer/sendParentConfirmationEmail.php", {
          "parentEmailAddr": parentEmailAddr,
          "parentFirstName": parentFirstName,
          "teerFirstName": teerFirstName
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
      });
  }
}])
