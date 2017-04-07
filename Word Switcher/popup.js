/**
 This file gets ran when the popup is used; it takes user input through a form and saves it
 **/

$(document).ready(function() {
    $('#run').click(saveData);
    $('#reset').click(resetData);
    document.getElementById("reset").disabled = true;
    checkForData();
});

function checkForData() {
    // Check to see if there is current saved data, and display it if there is
    chrome.storage.sync.get(['inputWord', 'wordToSwitch'], function(result) {
        if (result) {
            inputWord = result.inputWord;
            wordToSwitch = result.wordToSwitch;
            if (inputWord !== "" && wordToSwitch !== "") {
                document.getElementById("display").innerHTML = "Now converting " + inputWord + " to " + wordToSwitch;
                document.getElementById("reset").disabled = false;
            }
        }
    });
}

function saveData() {
    // Retrieve the data from the form
    var inputWord = document.getElementById("inputWord").value;
    var wordToSwitch = document.getElementById("wordToSwitch").value;

    // Check that both fields were filled out
    if (!inputWord || !wordToSwitch) {
        return;
    }

    // Display it in the popup and enable the reset button
    document.getElementById("display").innerHTML = "Now converting " + inputWord + " to " + wordToSwitch
        + "<br> Refresh this page to see changes.";
    document.getElementById("reset").disabled = false;

    // Save the data so the content script can access it
    chrome.storage.sync.set({'inputWord': inputWord, 'wordToSwitch': wordToSwitch});
}

function resetData(){
    // Reset the variables
    inputWord = ""; wordToSwitch = "";

    // Save the data
    chrome.storage.sync.set({'inputWord': inputWord, 'wordToSwitch': wordToSwitch});

    // Reset the display
    document.getElementById("display").innerHTML = "Not currently converting anything. <br> Refresh this page to see changes.";
    document.getElementById("reset").disabled = true;

}