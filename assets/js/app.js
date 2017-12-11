

// Initialize Firebase
var config = {
    apiKey: "AIzaSyD2AyObY94cROZ6xOFg2gJRySAVpV7jYTY",
    authDomain: "starter-182aa.firebaseapp.com",
    databaseURL: "https://starter-182aa.firebaseio.com",
    projectId: "starter-182aa",
    storageBucket: "starter-182aa.appspot.com",
    messagingSenderId: "16586961634"
};
firebase.initializeApp(config);

var database = firebase.database();

// Initial variables
var name = "";
var dest = "";
var first = "";
var freq = "";

// Capture Button Click
$("#add-user").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    name = $("#trainName").val().trim();
    dest = $("#destination").val().trim();
    first = $("#firstTrain").val().trim();
    freq = $("#frequency").val().trim();

    // Code for "Setting values in the database"
    database.ref().push({
        name: name,
        dest: dest,
        first: first,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

//clear input field on click
    $("input").focus(function () {
        if ($(this).val() !== '') {
            $(this).val('');
        }
    });

// Add them to the HTML in our table
database.ref().on("child_added", function (childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().dest);
    console.log(childSnapshot.val().first);
    console.log(childSnapshot.val().freq);
    
// New Calculated Variables
   var minutesAway = minTillTrain(childSnapshot.val().freq, childSnapshot.val().first);
   var nextArrival = nextTrain(minutesAway);

      // Change the HTML to reflect
  var newTr = $("<tr>")
  newTr.append("<td>" + childSnapshot.val().name + "</td>");
  newTr.append("<td>" + childSnapshot.val().dest + "</td>");
  newTr.append("<td>" + childSnapshot.val().freq + "</td>");
  newTr.append("<td>" + nextArrival + "</td>");
  newTr.append("<td>" + minutesAway + "</td>");
  $("tbody").append(newTr);


 // Below are both time calculating functions. Note that both must be inside the database.ref() for them to work. 
  
 // Minutes Away Function
function minTillTrain (tFrequency, firstTime) {
    
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;
    return tMinutesTillTrain;
    }
    
    // Next Arrival Function
    function nextTrain (tMinutesTillTrain) {
        var nextTrain = moment().add(tMinutesTillTrain, "minutes")
        return moment(nextTrain).format("hh:mm");
    }
    
    

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});





  


