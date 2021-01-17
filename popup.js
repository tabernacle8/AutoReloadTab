/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/


//Init some button values
let startReload = document.getElementById('startReload');
let stopReload = document.getElementById('stopReload');
let userTimeTextbox = document.getElementById('reloadTimer');


//Function to refresh the tab
function refreshData() {
    var reloadTime = 0
    var refreshValue = "0"
    var tabId = ""

    //Get how many seconds until next reload
    chrome.storage.sync.get(['reloadSeconds'], function (result) {
        for (let data of Object.keys(result)) {
            reloadTime = result[data];
        }

        //Check to make sure we are still refreshing
        chrome.storage.sync.get(['refreshing'], function (result) {
            for (let data of Object.keys(result)) {
                refreshValue = result[data];
            }

            //If we are refreshing, do the following
            if (refreshValue == "1") {

                //Get the ID of the tab that must be reloaded
                chrome.storage.sync.get(['tabid'], function (result) {
                    for (let data of Object.keys(result)) {
                        tabId = result[data];
                    }

                    //Ask chrome for that tab object (from the ID we just got), and reload it
                    chrome.tabs.getSelected(tabId, function (tab) {
                        chrome.tabs.reload(tab.id);
                    });

                    //Just prevent garbarge data from getting in
                    if(reloadTime==-1){
                        return;
                    }

                    //Go back to the start of this function, and we will wait the number of seconds before reloading again
                    setTimeout(refreshData, parseInt(reloadTime) * 1000);
                })

            }

        });
    });
}


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

        //Get the current tab and store its windowID
        chrome.tabs.getSelected(null, function (tab) {
            console.log(tab)
            reloadTabID = tab.windowId
            chrome.storage.sync.set({
                "tabid": reloadTabID
            }, function () {
                console.log('TabID cached as' + reloadTabID);

                //Begin refresh cycle by calling this function
                refreshData();
            });
        });
    });
}