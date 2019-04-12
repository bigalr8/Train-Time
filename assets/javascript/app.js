// Javascript

// F i r e b a s e    d a t a b a s e configuration snipet
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


// W a i t   f o r   p a g e   t o    l o a d 
$(document).ready(function () {


  // O n   cl i c k   o f   s c h e d u l e   e n t r y    s u b m i s s i o n
  $("#submit").on("click", function (event) {


    // S u p p r e s s   a c t u a l   o f   i n p u t   a s   " f o r m"
    event.preventDefault();

    //S t o r e   e n t e r e d   d a t a   v a l u e   f r o m   i n p u t      
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var initlDeparture = $("#initial-departure").val().trim();
    var frequency = $("#frequency").val();
    var validSched = true;


    // F u n c t i o n   t o   v a l i d a t e   i n p u t   
    //-   s e t t i n g   a n   i n d i c a t o r   i f   i n v al i d  
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

    // F u n c t i on   t o   v a l i d a t e   m i l i t a r y   t i m e   o f   i n i t i a l   d e p a r  t u r e  
    //-   s e t t i n g   a n   i n d i c a t o r   i f   i n v a l i d   
    function checkMilTime(str) {
      console.log("checkMilTime");
      
      var str = initlDeparture;
      console.log("str: " + str);
      console.log("str.len : " + str.length);
      console.log("validSched: " + validSched);

      if (str.length == 0)
        {validSched = false;
         return;
        }
      // Must be HH:MM and include any leading zeros
      if (str.length < 5)
        {validSched = false;
          return}
      // Must include : separator    
      var x = str.indexOf(":");
      if (x < 0) {
        console.log("no :");
        validSched = false;
        return;
      }
      // Hours must be between 0 and 24
      else if (
        (str.substr(0, 2) >= 0) &&
        (str.substr(0, 2) <= 24) &&

      // Minutes must be between 00 and 59
        (str.substr(3, 2) >= 0) &&
        (str.substr(3, 2) <= 59) &&
        (str.substr(0, 2) < 24 || (str.substr(0, 2) == 24 && str.substr(3, 2) == 0))
      ) {
        return;
      }
      else {
        validSched = false;
        return;
      }
      
        
    };

    //C a l l   i n p u t   v a l i d a t i o n   f u n c t i o n s 
        checkMilTime();
    if (!validSched) {
      console.log("return: " + validSched);
      alert("Initial departure time must be in valid hh:mm format and include any leading zeros");
        return;
    }
    validateAddedSchedule();
    if (!validSched) {
      return;
    }

    // I n s e r t   v a l i d a t e d   e n t r y   i n t o   d a t a b a s e   a s   n e w    c h i l d  
    database.ref().push({
      trainName: trainName,
      destination: destination,
      initlDeparture: initlDeparture,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    
  });



//W a t c h   d a t a b a s e   f o r   u p d a t e s  
  database.ref().on("child_added", function (snapshot) {
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var initlDeparture = snapshot.val().initlDeparture;
    var frequency = snapshot.val().frequency;

//C o m p u t e   n e x t   d e p a r t u r e   t i m e  
//Use "moment" library for date formatting and computations
    var initlDeparture12 = (moment(initlDeparture, 'HH:mm').format('hh:mm a'));
//    var nextToArrive = (moment(initlDeparture12, 'hh:mm a').add(frequency, 'minutes').format('hh:mm a'));

    var current = moment().format("hh:mm a");
    console.log("current: " + current);

    var nextToArrive = initlDeparture12; 
    console.log("initl next: " + nextToArrive);

    console.log("freq: " + frequency);



    while ((moment(nextToArrive, 'hh:mm a')).add(frequency, 'minutes').isBefore(moment().format("hh:mm a"))) {
      next = (moment(nextToArrive, 'hh:mm a').add(frequency, 'minutes').format('hh:mm a'));
      console.log("next: " + nextToArrive);
    }
      console.log("final: " + nextToArrive); 
      

  //build array of data elements   
    var entryArray = [];

    entryArray.push(trainName);
    entryArray.push(destination);
    entryArray.push(initlDeparture);
    entryArray.push(frequency);
    entryArray.push(nextToArrive);

    //C a l l   f u n c t i o n   t o   a d d   t o   l i s t   o n   p a g e 
    addEntry(entryArray);
    
    //Function to add to table on page using array of data elements
    function addEntry(entryArray) {
      var entry = $("<tr>");

    //Use "forEach" method to loop thru array using function to generate html for table
      entryArray.forEach(myfunction);
      $("#scheduleEntries").append(entry);

    //Function to generate table data for each element in array
      function myfunction(item) {
        console.log("addEntry: " + item);
        var data = $("<td></td>").text(item);
        entry.append(data);
      };
    };
  });
});
