/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/

//Get functions that will handle background work (Such as reloading the tabs)
//import { beginReloading } from 'reloadTabBackground.js';

//Init some button values
let startReload = document.getElementById('startReload');
let stopReload = document.getElementById('stopReload');
let userTimeTextbox = document.getElementById('reloadTimer');


//Init function, first ran when the script boots
console.log("Oh hey there. I'm ready to reload some tabs!")


//Listen for user input on the UI
userTimeTextbox.addEventListener("change", function (data) {
    var newReloadTime = userTimeTextbox.value

    //Push new data to "reloadSeconds"
    chrome.storage.sync.set({
        reloadSeconds: newReloadTime
    }, function () {
        console.log('Reload time is set to ' + newReloadTime);
    });
    chrome.storage.sync.set({
        "nextReload": `${newReloadTime}`
    }, function () {
        console.log("next reload set to "+newReloadTime)
        //do nothing
    })
})

//Executes when user clicks "stop"
stopReload.onclick = function (element) {

    //Sets "refreshing" to 0, telling us to stop the refresh cycle
    chrome.storage.sync.set({
        "refreshing": "0"
    }, function () {
        console.log('Reloading set to 0');
    })
}

//Executes when user clicks "start"
startReload.onclick = function (element) {
    var reloadTabID = ""

    //Set "refreshing" to 1 which starts the refresh cycle
    chrome.storage.sync.set({
        "refreshing": "1"
    }, function () {
        console.log('Reloading set to 1');

        //Get the current tab and store its id
        chrome.tabs.getSelected(null, function (tab) {
            console.log(tab)
            reloadTabID = tab.id
            chrome.storage.sync.set({
                "tabid": reloadTabID
            }, function () {
                console.log('TabID cached as' + reloadTabID);

                //We are done! reloadTabBackground.js will handle the rest
            });
        });
    });
}