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
let userTimeSeconds = document.getElementById('reloadTimer');
let userTimeMinutes = document.getElementById('reloadTimer2');
let userTimeHours = document.getElementById('reloadTimer3');


//Init function, first ran when the script boots
console.log("Oh hey there. I'm ready to reload some tabs!")

function updateReloadTime() {
    var reloadSeconds = 0
    var reloadMinutes = 0
    var reloadHours = 0

    chrome.storage.sync.get(['reloadSeconds'], function (result) {
        for (let data of Object.keys(result)) {
            reloadSeconds = result[data];
        }

        chrome.storage.sync.get(['reloadMinutes'], function (result) {
            for (let data of Object.keys(result)) {
                reloadMinutes = result[data];
            }

            chrome.storage.sync.get(['reloadHours'], function (result) {
                for (let data of Object.keys(result)) {
                    reloadHours = result[data];
                }

                var totalReloadTime = parseInt(reloadSeconds) + (parseInt(reloadMinutes) * 60) + (parseInt(reloadHours) * 60 * 60)

                chrome.storage.sync.set({
                    "nextReload": `${totalReloadTime}`
                }, function () {
                    console.log("next reload set to " + totalReloadTime)
                    //do nothing
                })
            })
        })
    })
}


//Listen for user input on the UI

userTimeSeconds.addEventListener("change", function (data) {
    var newReloadTime = userTimeSeconds.value

    chrome.storage.sync.set({
        reloadSeconds: newReloadTime
    }, function () {
        console.log('Reload seconds is set to ' + newReloadTime);
    });
    updateReloadTime()

})

userTimeMinutes.addEventListener("change", function (data) {
    var newReloadTime = userTimeMinutes.value

    chrome.storage.sync.set({
        reloadMinutes: newReloadTime
    }, function () {
        console.log('Reload minutes is set to ' + newReloadTime);
    });
    updateReloadTime()
})

userTimeHours.addEventListener("change", function (data) {
    var newReloadTime = userTimeHours.value

    chrome.storage.sync.set({
        reloadHours: newReloadTime
    }, function () {
        console.log('Reload hours is set to ' + newReloadTime);
    });
    updateReloadTime()

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