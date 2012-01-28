var contentDiv = document.getElementById('content_div');
var participantsDiv = document.getElementById('participants_div');

// Note that if you click the button several times in succession,
// if the state update hasn't gone through, it will submit the same
// delta again.  The hangout data state only remembers the most-recent
// update.
function buttonClicked() {
   console.log("Button clicked");
   console.log(gapi.hangout.data.getState()['count']);
   var value = 0;
   if (gapi.hangout.data.getState()['count']) {
       value = parseInt(gapi.hangout.data.getState()['count']);
   }

   console.log("Value is " + value);
   // Send update to shared space.
   // NOTE:  Only ever send strings as values in the key-value pairs
   gapi.hangout.data.submitDelta({
       'count': '' + (value + 1)
   });
}

// Whenever the shared data is updated, rewrite UI
function stateUpdated(delta, metadata) {
   if (!gapi.hangout.data.getState()['count']) {
       contentDiv.innerHTML = "The count is 0."
   } else {
       contentDiv.innerHTML = "The count is " + gapi.hangout.data.getState()['count'] + ".";
   }
}

function participantsUpdated() {
    var participantsArray = getAll();
   console.log("participants: " + participantsArray);
   participantList = "<ul \>";
   for (participant in participantsArray) {
	participantList += "<li />";
	participantList += participant.person.displayName;
	participantList += "</li>";
   }
    participantList += "</ul>";
   participantsDiv.innerHTML = "Participants: " + participantList;
}


// Sets up callbacks for state change
// You should not set up the state object until you get your first callback.
function init() {
    console.log("init");
    
    gapi.hangout.data.addStateChangeListener(stateChanged); // client state change listener
    gapi.hangout.data.addStateChangeListener(stateUpdated);
    gapi.hangout.addParticipantsListener(participantsUpdated);
}

// Note that the hangouts object is not set up until the gadget loads
gadgets.util.registerOnLoadHandler(init);

// Reset value of "count" to 0
function resetCounter() {
   gapi.hangout.data.submitDelta({
       'count': '0'
   });
}
