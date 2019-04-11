// Javascript

// Firebase database configuration snipet
var config = {
  apiKey: "AIzaSyBTviDz97Y1AzZ-oiGeOrC-QRVi4cD_5kY",
  authDomain: "train-time-9192a.firebaseapp.com",
  databaseURL: "https://train-time-9192a.firebaseio.com",
  projectId: "train-time-9192a",
  storageBucket: "train-time-9192a.appspot.com",
  messagingSenderId: "881882052314"
};

//Initialize database
firebase.initializeApp(config);

//Create reference to database object
var database = firebase.database();

//Create database variable
var trainName = "";
var destination = "";
var initlDeparture = "";
var frequency = 0;

$(document).ready(function () {


  $("#submit").on("click", function (event) {

    console.log("on click");

    event.preventDefault();

    //Create database variable
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var initlDeparture = $("#initial-departure").val().trim();
    var frequency = $("#frequency").val();
    var validSched = true;

    console.log("on click: " + trainName);
    console.log("on click: " + destination);
    console.log("on click: " + initlDeparture);
    console.log("on click: " + frequency);

    function validateAddedSchedule() {
      console.log("validAddedSchedule");
      if (trainName == "") {
        alert("Train name must be filled out");
        validSched = false;
      }
      if (destination == "") {
        alert("Destination must be filled out");
        validSched = false;
      }
      if (initlDeparture == "") {
        alert("Initial departure time must be filled out");
        validSched = false;
      }
      if (frequency == 0) {
        alert("Train frequency must be filled out");
        validSched = false;
      }
    };

    function checkMilTime(str) {
      console.log("checkMilTime");
      var str = initlDeparture;
      if (str.length == 0)
        validSched = false;

      if (str.length < 4)
        validSched = false;

      var x = str.indexOf(":");
      if (x < 0) {
        console.log("no :");
        validSched = false;
      }
      else if (
        (str.substr(0, 2) >= 0) &&
        (str.substr(0, 2) <= 24) &&
        (str.substr(3, 2) >= 0) &&
        (str.substr(3, 2) <= 59) &&
        (str.substr(0, 2) < 24 || (str.substr(0, 2) == 24 && str.substr(3, 2) == 0))
      )
        {validSched = true;
        console.log("checkMilTime true");}
      else {
        validSched = false;
        console.log(str.substr(0, 2));
        console.log(str.substr(3, 2));
        console.log("checkMilTime false");
      }
      if (!validSched)
        alert("Initial departure time must be in valid hh:mm format and include any leading zeros");
    };

    validateAddedSchedule();
    checkMilTime();

    if (!validSched) {
      console.log("invalid input");
      return;
    }

    console.log("no validation exit");

    
    database.ref().push({
      name: trainName,
      role: destination,
      start: initlDeparture,
      rate: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    console.log("Check database for data!");
  });
});



