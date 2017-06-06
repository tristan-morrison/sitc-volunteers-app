var app = angular.module('volunteersApp')

app.controller('VolunteersAppController', ['$scope', '$log', '$mdDialog', function($scope, $log, $mdDialog) {
  $log.log('Hello, world! VolunteersAppController is running!')

  if (navigator.userAgent.indexOf('Trident') > -1) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Uh, oh: Internet Explorer')
        .textContent("It looks like you are using Internet Explorer. We're sorry, but our registration form will not work properly on Internet Explorer. Please try a different web browser. (If you don't have another browser on your computer, try a smartphone.)")
        .ok('Will do!')
    )
  }
}])
