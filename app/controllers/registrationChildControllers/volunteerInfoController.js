var app = angular.module('volunteersApp')

app.controller('VolunteerInfoController', ['$scope', '$log', '$window', '$http', '$state', 'getCarpoolSites', 'mapsModal', function($scope, $log, $window, $http, $state, getCarpoolSites, mapsModal) {

  $log.log('VolunteerInfoController is running!')

  // controls which of two phone fields is required
  $scope.noCellPhone = false

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
    "Skyline": "Ann Arbor Skyline",
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

  $scope.states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

  $scope.driverPermitOptions = {
    "isAdult": "I am 18, I meet the requirements and can drive if needed.",
    "isMinorWithPermission": "My child is 17, meets the requirements and has my permission to drive if needed.",
    "noPermission": "My child does not drive/does not have permission to drive.",
    "needMoreInfo": "Please contact me with more information about driving."
  }

  $scope.carpoolSites = {}
  getCarpoolSites().then(function(sites) {
    $scope.carpoolSites = sites
  })
  $log.log("carpoolSites: " + dump($scope.carpoolSites, 'none'))

  var todayDate = new Date()

  $scope.setBirthdateAndValidate = function() {

    // create date obj from mmddyyyy string
    var dateString = $scope.birthdateString
    var month = parseInt(dateString.slice(0,2))
    var day = parseInt(dateString.slice(2,4))
    var year = parseInt(dateString.slice(4))


    var myBirthdate = new Date()
    myBirthdate.setFullYear(year)
    myBirthdate.setMonth(month)
    myBirthdate.setDate(day)

    $log.log("birth month: " + month)
    $log.log("myBirthdate: " + myBirthdate.toString())

    // create a new date object and set it to August of this year
    var minEligibleDate = new Date(todayDate)
    minEligibleDate.setMonth(7)

    // set to 14 years prior to August of this year
    minEligibleDate.setFullYear(minEligibleDate.getFullYear() - 14)

    $log.log(minEligibleDate.getFullYear())

    if (minEligibleDate.getFullYear() < myBirthdate.getFullYear()) {
      $scope.registrationForm.birthdateString.$error.notOldEnough = true
      $scope.registrationForm.birthdateString.$setValidity("notOldEnough", false)
      if (!$scope.hasHadInvalidBirthdate) {
        // if the person has already seen the birthdate error, don't continue auto-focusing the birthdate field, as this prevents them from focusing any other fields if they do not change the birthdate
        $scope.hasHadInvalidBirthdate = true
        var field = $window.document.getElementById('birthdate')
        field.focus()
      }
    }
    else {
      // set errors to valid in case they were set to false by a previous input
      $scope.registrationForm.birthdateString.$error.notOldEnough = false
      $scope.registrationForm.birthdateString.$setValidity("notOldEnough", true)
      // floor() rounds down
      $scope.regInfo["age"] = Math.floor((todayDate.getTime() - myBirthdate.getTime()) / (365*24*60*60*1000))
      $scope.regInfo.birthdate = year + "-" + ((month>9) ? month : "0" + month) + "-" + ((day>9) ? day : "0" + day)
      $log.log("age: " + $scope.regInfo.birthdate)
      $log.log("age: " + $scope.regInfo.age)
    }
  }

  $scope.showMapsModal = function(displayName, address, city, state, zip) {
    $log.log("showMapsModal ran with address " + address)
    mapsModal(displayName, address, city, state, zip)
  }


  $scope.checkForOtherEthnicity = function() {
    $scope.otherEthnicityIsRequired = ($scope.regInfo.ethnicity == "other")
    $log.log("otherEthnicityIsRequired: " + $scope.otherEthnicityIsRequired)
  }

  $scope.checkForOtherReligion = function() {
    $scope.otherReligionIsRequired = ($scope.regInfo.religion == "other")
    $log.log("otherReligionIsRequired: " + $scope.otherReligionIsRequired)
  }

  $scope.strToInt = function(whichYear) {
    $scope.regInfo[whichYear] = parseInt($scope.regInfo[whichYear])
    $log.log(whichYear + " is: " + $scope.regInfo[whichYear] + " and is of type " + typeof $scope.regInfo[whichYear])
  }

  // $scope.checkForOtherHighSchool = function() {
  //   $scope.otherHighSchoolIsRequired = ($scope.regInfo.highSchool == "other")
  //   $log.log("otherHighSchoolIsRequired: " + $scope.otherHighSchoolIsRequired)
  //   // do not automatically focus "other" input, as this causes it to be marked invalid immediately when it appears
  // }

  $scope.checkForOtherGender = function() {
    $scope.otherGenderIsRequired = ($scope.regInfo.gender == "other")
    $log.log("otherGenderIsRequired: " + $scope.otherGenderIsRequired)
  }

  $scope.fillAddressFields = function() {
    var myURL = "http://zip.getziptastic.com/v2/US/" + $scope.regInfo.zip
    $http({
      method: "GET",
      url: myURL
    }).then(function success(response) {
      $scope.regInfo.city = response.data.city
      $scope.regInfo.state = response.data.state_short
      $log.log("city: " + $scope.regInfo.city)
      $scope.showFields = true
    }, function failure() {
      // still show fields so user can fill them
      $scope.showFields = true
    })
  }

  $scope.logPhone = function() {
    $log.log("phone: " + $scope.regInfo.phone)
  }

  // $scope.gotoState = function(originForm, destinationState) {
  //   if (!$scope[originForm].$valid) {
  //     // from iandotkelly on StackOverflow
  //     var firstInvalid = angular.element(document.querySelector('.ng-invalid').querySelector('.ng-invalid'));
  //     if (firstInvalid) {
  //       $log.log("Found an invalid field in the form " + originForm + ": " + firstInvalid.name)
  //       firstInvalid.addClass('ng-touched')
  //       firstInvalid.focus()
  //       return
  //     }
  //   }
  //   $state.go('registration.' + destinationState)
  //   window.scrollTo(0,0)
  // }

  $scope.goToPage = function() {
    $log.log("goToPage ran!")
    $scope.goToState($scope.registrationForm, 'emergencyContacts', 1)
  }

}])
