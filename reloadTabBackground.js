/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/


function beginReloading() {
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

                    //Reload the tab we want, from memory
                       chrome.tabs.reload(tabId);

                    //Just prevent garbarge data from getting in
                    if (reloadTime == -1 || reloadTime ==0) {
                        refreshData()
                    }
                    else{
                    //Go back to the start of this function, and we will wait the number of seconds before reloading again
                    setTimeout(refreshData, parseInt(reloadTime) * 1000);
                    }
                })
            }
            else{
                //Restart loop
                refreshData()
            }
        });
    });
}

//Checks to see if we need to start reloading the tab
function refreshData() {
    //console.log("listening for data")
    //Get refreshing true or false data
    chrome.storage.sync.get(['refreshing'], function (result) {
        for (let data of Object.keys(result)) {
            //console.log(result)
            if (result[data] == 1) {
                //Let's start refreshing!
                beginReloading()
            } else {
                //Do not refresh or stop refreshing!
                setTimeout(refreshData, 1000);
            }

        }
    })
}

//Begin looping
refreshData()