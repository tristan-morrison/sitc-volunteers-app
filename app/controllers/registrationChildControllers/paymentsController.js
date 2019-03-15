var app = angular.module('volunteersApp')

app.controller('PaymentsController', ['$scope', '$log', '$window', 'submitChargeToStripe', function($scope, $log, $window, submitChargeToStripe) {

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

  $scope.generateCheckout = function() {
    $scope.regInfo["paymentAmount"]
    $log.log("paymentMethod: " + $scope.creditOption)
    if ($scope.creditOption === 'credit_donation_default_amt') {
      $scope.regInfo.paymentAmount = 8000
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

  console.log(getStripeAPIKey_pk());
  var stripe = Stripe(getStripeAPIKey_pk());

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
    paymentRequest: $scope.paymentRequestObj,
  });

  // Check the availability of the Payment Request API first.
  $scope.paymentRequestObj.canMakePayment().then(function(result) {
    if (result) {
      prButton.mount('#paymentRequestButton');
    } else {
      document.getElementById('paymentRequestButton').style.display = 'none';
      document.getElementById('orContainer').style.display = 'none';
    }
  });

  prButton.on('click', function(ev) {
    ev.preventDefault();

    if (formIsValid()) {
      if ($scope.creditOption === 'credit_donation_default_amt') {
        $scope.regInfo.paymentAmount = 8000
      }
      else if ($scope.creditOption === 'credit_donation_custom_amt') {
        $scope.regInfo.paymentAmount = ($scope.custom_donation_amt + 36) * 100
      }
      else {
        $scope.regInfo.paymentAmount = 3600
      }

      $scope.paymentRequestObj.update({
        total: {
          amount: $scope.regInfo.paymentAmount,
          label: "Donation"
        }
      })

      $scope.paymentRequestObj.show();
    }
  })

  $scope.paymentRequestObj.on('token', function(ev) {

    var amount = $scope.regInfo.paymentAmount
    var name = "testing"
    var description = "Registration for " + name
    var statement_descriptor = "Summer in the City"

    // Send the token to your server to charge it!
    fetch('./app/appServer/submitChargeToStripe.php', {
      method: 'POST',
      body: JSON.stringify({
        amount: amount,
        currency: 'usd',
        source: ev.token.id,
        description: description,
        statement_descriptor: statement_descriptor,
      }),
      headers: {'content-type': 'application/json'},
    })
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (responseJson) {
          ev.complete("success")
          $scope.submitRegistration(responseJson.id)
        })
      } else {
        ev.complete("fail");
        return response.text()
      }
    })
})

// card element
var elements = stripe.elements();

var style = {
  base: {
    color: '#32325d',
    fontFamily: 'Roboto',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

var card = elements.create('card', {style: style});

card.mount('#card-element');

card.addEventListener('change', function (event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
})

var form = document.getElementById('paymentForm');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  stripe.createToken(card).then(function (result) {
    if (result.error) {
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      stripeTokenHandler(result.token);
    }
  })
})

card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

function stripeTokenHandler (token) {

  if (formIsValid()) {
    if ($scope.creditOption === 'credit_donation_default_amt') {
      $scope.regInfo.paymentAmount = 8000
    }
    else if ($scope.creditOption === 'credit_donation_custom_amt') {
      $scope.regInfo.paymentAmount = ($scope.custom_donation_amt + 36) * 100
    }
    else {
      $scope.regInfo.paymentAmount = 3600
    }

    var amount = $scope.regInfo.paymentAmount
    var name = "testing"
    var description = "Registration for " + name
    var statement_descriptor = "Summer in the City"

    var paymentPayload = {
      amount: amount,
      currency: 'usd',
      source: token.id,
      description: description,
      statement_descriptor: statement_descriptor,
    };

    submitChargeToStripe(paymentPayload).then(function (response) {
      if (response.status == 200) {
        response.json().then(function (responseJson) {
          console.log(responseJson);
          $scope.submitRegistration(responseJson.id)
        })
      } else {
        response.json().then(function (responseJson) {
          document.getElementById("card-errors").innerHTML = responseJson.message

        })
      }
    })
  }

}


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
    return true
  }

  $scope.submit = function() {
    if (formIsValid()) {
      $log.log("Form is valid!")
      $scope.submitRegistration()
    }
    // else, validate function will have already focused first invalid field
  }

}])
