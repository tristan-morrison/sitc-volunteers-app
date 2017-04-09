var app = angular.module('volunteersApp')

app.controller('EmergencyContactsController', ['$scope', '$log', '$window', '$http', 'getCarpoolSites',function($scope, $log, $window, $http, getCarpoolSites) {

  $log.log("EmergencyContactsController is running!")

  $scope.logLastName = function() {
    $log.log("IT WORKED")
    $log.log("last name: " + $scope.emergencyContact1.lastName)
  }

  $scope.emergencyContactFields = [
    {
      key: 'firstName',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'First Name',
        required: 'true'
      },
      ngModelElAttrs: {
        'size': '30'
      }
    },
    {
      key: 'lastName',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Last Name',
        required: 'true'
        // onBlur: function(){$log.log("last name: " + $scope.emergencyContact1.lastName)}
      },
      ngModelElAttrs: {
        'size': '30'
      }
    },
    {
      key: 'phone',
      type: 'input',
      templateOptions: {
        type: 'tel',
        label: 'Primary Phone',
        required: 'true'
      },
      ngModelElAttrs: {
        'ui-mask': '(999) 999-9999',
        'size': '15'
      }
    },
    {
      key: 'altPhone',
      type: 'input',
      templateOptions: {
        type: 'tel',
        label: 'Alternate Phone',
        required: 'true'
      },
      ngModelElAttrs: {
        'ui-mask': '(999) 999-9999',
        'size': '15'
      }
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        required: 'true'
      }
    },
    {
      key: 'sendNewsletter',
      type: 'checkbox',
      templateOptions: {
        label: 'I would like to receive the SITC email newsletter'
      }
    }
  ]

  // $log.log("First Name: " + $scope.emergencyContact1.firstName)

}])
