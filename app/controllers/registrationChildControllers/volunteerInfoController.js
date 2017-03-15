var app = angular.module('volunteersApp')

app.controller('VolunteerInfoController', ['$scope', '$log', '$window', '$http', 'getCarpoolSites',function($scope, $log, $window, $http, getCarpoolSites) {

  $log.log('VolunteerInfoController is running!')

  $scope.genders = {
    "female": "Female",
    "male": "Male",
    "nonbinary": "Non-binary",
    "transWoman": "Trans Woman",
    "transMan": "Trans Man",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.ethnicities = {
    "white" : "White, not of Hispanic Origin, Latino, or Spanish origin",
    "white_hispan" : "White, of Hispanic, Latino, or Spanish origin",
    "black" : "Black or African American",
    "native" : "American Indian or Alaska Native",
    "asianIndian" : "Asian Indian",
    "asian": "Asian",
    "multi": "Multiracial",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.religions = {
    "buddhist": "Buddhist",
    "christian" : "Christian",
    "hindu" : "Hindu",
    "jewish": "Jewish",
    "muslim": "Muslim",
    "sikh": "Sikh",
    "athiest": "Athiest",
    "agnostic": "Agnostic",
    "unitarian": "Unitarian/Universalist",
    "noAnswer": "Prefer not to answer",
    "other": "Other"
  }

  $scope.highSchools = {
    "huron": "Ann Arbor Huron",
    "pioneer": "Ann Arbor Pioneer",
    "berkley": "Berkely High School",
    "groves": "Birmingham Groves",
    "seaholm": "Birmingham Seaholm",
    "bloomfield": "Bloomfield Hills H.S.",
    "cranbrook": "Cranbrook Kingswood",
    "dcds": "Detroit Country Day School",
    "harrison": "Farmington Harrison",
    "farmington": "Farmington H.S.",
    "gpNorth": "Grosse Pointe North",
    "gpSouth": "Grosse Pointe South",
    "greenhills": "Greenhills School",
    "mercy": "Mercy H.S.",
    "northFarm": "North Farmington H.S.",
    "notreDame": "Notre Dame Prep",
    "roeper": "Roeper School",
    "renaissance": "Renaissance H.S.",
    "troy": "Troy H.S.",
    "uOfD": "U of D Jesuit",
    "westBloomfield": "West Bloomfield H.S.",
    "other": "Other"
  }

  $scope.carpoolSites = {}
  getCarpoolSites().then(function(sites) {
    $scope.carpoolSites = sites
  })
  $log.log("carpoolSites: " + dump($scope.carpoolSites, 'none'))

  $scope.years = []
  var todayDate = new Date()
  for (var k=1900; k<=(todayDate.getFullYear()+5); k++) {
    $scope.years.push(k)
  }
  // set to current year so that select opens on this year by default (as opposed to opening on the year 1900)
  $scope.person.hsGradYear = todayDate.getFullYear()
  $scope.person.colGradYear = todayDate.getFullYear()



  $scope.setAgeIfValid = function() {

    // create a new date object and set it to August of this year
    var minEligibleDate = new Date(todayDate)
    minEligibleDate.setMonth(7)

    // set to 14 years prior to August of this year
    minEligibleDate.setFullYear(minEligibleDate.getFullYear() - 14)

    $log.log(minEligibleDate.getFullYear())

    if (minEligibleDate.getFullYear() < $scope.person.birthdate.getFullYear()) {
      $scope.registrationForm.birthdate.$error.notOldEnough = true
      $scope.registrationForm.birthdate.$setValidity("notOldEnough", false)
      var field = $window.document.getElementById('birthdateDatepicker')
      field.focus()
    }
    else {
      // set errors to valid in case they were set to false by a previous input
      $scope.registrationForm.birthdate.$error.notOldEnough = false
      $scope.registrationForm.birthdate.$setValidity("notOldEnough", true)
      $scope.person["age"] = todayDate.getFullYear() - $scope.person.birthdate.getFullYear()
      $log.log("age: " + $scope.person.age)
    }
  }

  $scope.checkForOtherEthnicity = function() {
    $scope.otherEthnicityIsRequired = ($scope.person.ethnicity == "other")
    $log.log("otherEthnicityIsRequired: " + $scope.otherEthnicityIsRequired)
  }

  $scope.checkForOtherReligion = function() {
    $scope.otherReligionIsRequired = ($scope.person.religion == "other")
    $log.log("otherReligionIsRequired: " + $scope.otherReligionIsRequired)
  }

  $scope.checkForOtherHighSchool = function() {
    $scope.otherHighSchoolIsRequired = ($scope.person.highSchool == "other")
    $log.log("otherHighSchoolIsRequired: " + $scope.otherHighSchoolIsRequired)
    var field = $window.document.getElementById('otherHighSchool')
    field.focus()
  }

  $scope.checkForOtherGender = function() {
    $scope.otherGenderIsRequired = ($scope.person.gender == "other")
    $log.log("otherGenderIsRequired: " + $scope.otherGenderIsRequired)
  }

  $scope.fillAddressFields = function() {
    var myURL = "http://zip.getziptastic.com/v2/US/" + $scope.person.zip
    $http({
      method: "GET",
      url: myURL
    }).then(function success(response) {
      $scope.person.city = response.data.city
      $scope.person.state = response.data.state_short
      $log.log("city: " + $scope.person.city)
      $scope.showFields = true
    }, function failure() {
      // still show fields so user can fill them
      $scope.showFields = true
    })
  }

  $scope.logPhone = function() {
    $log.log("phone: " + $scope.person.phone)
  }

}])
