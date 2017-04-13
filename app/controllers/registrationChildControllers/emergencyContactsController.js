var app = angular.module('volunteersApp')

app.controller('EmergencyContactsController', ['$scope', '$log', '$window', '$http', '$state', 'getCarpoolSites',function($scope, $log, $window, $http, $state, getCarpoolSites) {

  $log.log("EmergencyContactsController is running!")

  $scope.logLastName = function() {
    $log.log("last name: " + $scope.emergencyContact1.lastName)
  }

  $scope.emergencyContact1.sendNewsletter = true
  $scope.emergencyContact2.sendNewsletter = true

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
        label: 'Cell Phone',
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
        label: 'Alternate Phone (e.g. home, work)',
      },
      ngModelElAttrs: {
        'ui-mask': '(999) 999-9999',
        'size': '30'
      }
    },
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Email',
        required: 'true'
      },
      ngModelElAttrs: {
        'size': '50'
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

  $scope.goToPage = function(destinationState) {
    $log.log("goToPage ran!")
    $scope.goToState('registrationForm', destinationState)
  }

  // $log.log("First Name: " + $scope.emergencyContact1.firstName)

  $scope.goToPage = function(destinationState, onlyIfValid) {
    if (onlyIfValid == 1) {
      if (!$scope.emergencyContact1Form.$valid) {
        $log.log("Emergency Contact 1 form is not valid!")
        // we use a different querySelector here because of formly weirdness; it currently only works because all of the inputs are actually <input> tags
        var firstInvalid = angular.element(document.querySelector('input.ng-invalid'));
        firstInvalid.addClass('ng-touched')
        firstInvalid.focus()
        return
      }
      else if (!$scope.emergencyContact2Form.$valid) {
        var firstInvalid = angular.element(document.querySelector('input.ng-invalid'));
        firstInvalid.addClass('ng-touched')
        firstInvalid.focus()
        return
      }
    }
    $state.go('registration.' + destinationState)
    window.scrollTo(0,0)
  }

}])
