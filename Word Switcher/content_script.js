/**
 This JS program searches a web page for an inputted word and changes
 it to another word of your choice.
 It automatically runs on every page when the extension is enabled.
 It uses a popup with a form in it to receive input from the user, and then
 saves this to the chrome.storage API to be accessed by the content script.
 
 Current issues:
 - google uses AJAX to get search results, so if you reload the page
 it accesses information it has already stored (instead of reloading the
 entire DOM itself) and so the extension doesn't change the page
 - facebook does something similar, where switching between pages doesn't
 always trigger the browser to reload the page
 - need to create a background script that injects the content script in these
 cases
 **/

// Initialize with blank values, gets updated from within the popup
var inputWord = ""; var wordToSwitch = "";

// Pulls the data from the storage and updates the variables if it is available
chrome.storage.sync.get(['inputWord','wordToSwitch'], function(result) {
    if (result) {
        inputWord = result.inputWord;
        console.log("Input word successfully pulled: " + inputWord);
        wordToSwitch = result.wordToSwitch;
        console.log("Input word successfully pulled: " + wordToSwitch);
    }
});

$(document).ready(function(){
    wordSwitch(inputWord, wordToSwitch);
});

function wordSwitch(inputWord, wordToSwitch) {
    console.log('wordSwitch ran from content_script.js');

    // Convert the inputted work to a regular expression so it can be used later
    var regExWord = new RegExp(inputWord, 'gi');

    // Recursively check all the nodes of the page
    findNodes(document.body);

    // Check the nodes of the title
    findNodes(document.title);

    // Then, listen for the DOM to be changed
    var config = {childList: true, characterData: true, attributes: true, subtree: true};
    var observer = new MutationObserver(observerCallback);
    observer.observe(document.body, config);


    function findNodes(node) {
        // If the node is a text node, search for the word
        if (node.nodeType === 3) {
            node.nodeValue = node.nodeValue.replace(regExWord, wordToSwitch);
        }

        // Else if the node has children, walk through it's children
        else if (node.hasChildNodes) {
            for (var i=0; i<node.childNodes.length; i++) {
                findNodes(node.childNodes[i]);
            }
        }
    }

    function observerCallback(mutations) {
        // If a DOM change is observed, walk through the added nodes
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                findNodes(mutation.addedNodes[i]);
            }
        })
    }

}