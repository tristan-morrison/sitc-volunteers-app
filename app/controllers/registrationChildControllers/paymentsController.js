var app = angular.module('volunteersApp')

app.controller('PaymentsController', ['$scope', '$log', '$window', function($scope, $log, $window) {

  $scope.shirtSizes = {
    'XS': 'Extra-small',
    'S': 'Small',
    'M': 'Medium',
    'L': 'Large',
    'XL': 'XL',
    'XXL': 'XXL'
  }

  $scope.partTwoOptions = {
    0: 'Okay, I will print Part 2 and bring it with me on my first day!',
    1: 'I already turned in my Part 2 form.'
  }

  var checkoutObj = StripeCheckout.configure({
    key: 'pk_test_SrLyfOWCp65iyqloEkp0qINj', //replace with SITC key
    locale: 'auto',
    token: function(token) {
      // alert("Yay! Checkout ran and got this token: " + token.id)
      $scope.regInfo.myPaymentToken = token.id
      $scope.$digest()
    }
  })

  $scope.generateCheckout = function() {
    $scope.regInfo["paymentAmount"]
    if ($scope.regInfo.paymentMethod === 'credit_donation') {
      $scope.regInfo.paymentAmount = 8000
    } else {
      $scope.regInfo.paymentAmount = 4000
    }

    checkoutObj.open({
      name: 'Summer in the City',
      description: 'Registration Fee',
      zipCode: true,
      amount: $scope.regInfo.paymentAmount,
      email: $scope.regInfo.email
    });
  }

  // used for ng-value on radio buttons; for some reason, passing strings was causing all buttons to appear as checked
  $scope.payMethodValues = ['cash_check', 'credit', 'credit_donation', 'waive']

  $scope.logPaymentMethod = function() {
    $log.log("Payment Method: " + $scope.regInfo.paymentMethod)
  }

}])
