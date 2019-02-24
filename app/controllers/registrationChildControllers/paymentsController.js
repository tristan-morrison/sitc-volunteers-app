var app = angular.module('volunteersApp')

app.controller('PaymentsController', ['$scope', '$log', '$window', function($scope, $log, $window) {

  $scope.paymentForm = {}

  $scope.shirtSizes = {
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

  $log.log("Stripe API Key: " + getStripeAPIKey_pk())

  if (typeof StripeCheckout != "undefined") {
    var checkoutObj = StripeCheckout.configure({
      key: getStripeAPIKey_pk(), //SITC publishable test API key
      locale: 'auto',
      token: function(token) {
        $log.log("Yay! Checkout ran and got this token: " + token.id)
        $scope.regInfo.myPaymentToken = token.id
        $scope.$digest()
      }
    })
  }
  else {
    angular.element(function() { // wait for the DOM element to load before we try to access it
      $scope.stripeNotLoaded = true
      $scope.paymentForm.paymentMethod.$error.noStripe = true
      $scope.paymentForm.paymentMethod.$setValidity("noStripe", false)
    })
  }

  $scope.generateCheckout = function() {
    $scope.regInfo["paymentAmount"]
    $log.log("paymentMethod: " + $scope.creditOption)
    if ($scope.creditOption === 'credit_donation_default_amt') {
      $scope.regInfo.paymentAmount = 7600
    }
    else if ($scope.creditOption === 'credit_donation_custom_amt') {
      $scope.regInfo.paymentAmount = ($scope.custom_donation_amt + 36) * 100
    }
    else {
      $scope.regInfo.paymentAmount = 3600
    }

    checkoutObj.open({
      name: 'Summer in the City',
      description: 'Registration Fee',
      zipCode: true,
      amount: $scope.regInfo.paymentAmount,
      email: $scope.regInfo.email
    });
  }

  $scope.paymentRequestObj = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 1000,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  var elements = stripe.elements();
  var prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
  });

  // Check the availability of the Payment Request API first.
  paymentRequest.canMakePayment().then(function(result) {
    if (result) {
      prButton.mount('#payment-request-button');
    } else {
      document.getElementById('payment-request-button').style.display = 'none';
    }
  });

  // used for ng-value on radio buttons; for some reason, passing strings was causing all buttons to appear as checked
  $scope.payMethodValues = ['cash_check', 'credit', 'credit_donation_default_amt', 'credit_donation_custom_amt', 'waive']

  $scope.logPaymentMethod = function() {
    $log.log("Payment Method: " + $scope.regInfo.paymentMethod)
  }

  $scope.hideError = function(id) {
    angular.element(document.querySelector(id)).css('display', 'none')
  }

  $scope.$parent.paymentError = function(error) {
    $scope.paymentForm.paymentInfo.$error.invalidNumber = true
    $scope.paymentForm.paymentInfo.$setValidity("invalidNumber", false)
    $scope.paymentForm.paymentInfo.$setTouched()
    var field = $window.document.getElementById('paymentInfoButton')
    field.focus()
  }

  // $scope.goBack = function() {
  //
  // }

  function formIsValid() {
    $log.log("validating!")
    if (!$scope.paymentForm.$valid) {
      // from iandotkelly on StackOverflow
      $log.log("form's not valid!")
      var firstInvalid = angular.element(document.querySelector('.ng-invalid').querySelector('.ng-invalid'));
      if (firstInvalid) {
        // $scope.showPaymentMethodRequiredError = true
        angular.element(firstInvalid.next()).css('display', 'block')
        // firstInvalid.addClass('ng-touched')
        firstInvalid.focus()
        return
      }
    }
    else if ($scope.paymentMethod == 'credit' && ($scope.regInfo.myPaymentToken == null || $scope.regInfo.myPaymentToken == '')) {
      $log.log("no payment token!!")
      $scope.paymentForm.paymentInfo.$error.noToken = true
      $scope.paymentForm.paymentInfo.$setValidity("noToken", false)
      $scope.paymentForm.paymentInfo.$setTouched()
      var field = $window.document.getElementById('paymentInfoButton')
      field.focus()
    } else {
      return true
    }
  }

  $scope.submit = function() {
    if (formIsValid()) {
      $log.log("Form is valid!")
      $scope.submitRegistration()
    }
    // else, validate function will have already focused first invalid field
  }

}])
