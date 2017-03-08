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

  var checkoutObj = StripeCheckout.configure({
    key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh', //replace with SITC key
    locale: 'auto',
    token: function(token) {
      // alert("Yay! Checkout ran and got this token: " + token.id)
      $scope.person.myPaymentToken = token.id
      $scope.$digest()
    }
  })

  $scope.generateCheckout = function() {
    var myAmount
    if ($scope.person.paymentMethod === 'credit_donation') {
      myAmount = 8000
    } else {
      myAmount = 4000
    }

    checkoutObj.open({
      name: 'Summer in the City',
      description: 'Registration Fee',
      zipCode: true,
      amount: myAmount,
      email: $scope.person.email
    });
  }

  // used for ng-value on radio buttons; for some reason, passing strings was causing all buttons to appear as checked
  $scope.payMethodValues = ['cash_check', 'credit', 'credit_donation', 'waive']

  $scope.logPaymentMethod = function() {
    $log.log("Payment Method: " + $scope.person.paymentMethod)
  }

}])
