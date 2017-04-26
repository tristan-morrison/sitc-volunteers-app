var app = angular.module('volunteersApp')

app.factory('notifyDirectorOfDriver', ['$log', '$q', '$http', '$sce', '$mdDialog', function($log, $q, $http, $sce, $mdDialog) {
  return function (info) {
    return $http({
      method: "GET",
      url: "app/appServer/notifyDirectorOfDriver.php",
      params: {
        "info" : JSON.stringify(info)
      }
    })
  }
}])
