/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/


function beginReloading() {
    var reloadTime = 0
    var refreshValue = "0"
    var tabId = ""
    var nextReload = "0"
    var reloadSeconds = "0"
    var reloadMinutes = "0"
    var reloadHours = "0"
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

                //Check to make sure we are still refreshing
                chrome.storage.sync.get(['refreshing'], function (result) {
                    for (let data of Object.keys(result)) {
                        refreshValue = result[data];
                    }

                    reloadTime = parseInt(reloadSeconds) + (parseInt(reloadMinutes) * 60) + (parseInt(reloadHours) * 60 * 60)
                    //If we are refreshing, do the following
                    if (refreshValue == "1") {


                        //Check if it's time to reload 

                        chrome.storage.sync.get(['nextReload'], function (result) {
                            for (let data of Object.keys(result)) {
                                nextReload = result[data];
                                //console.log("next reload:" + nextReload)
                            }

                            //If it's time to reload, then do it!
                            if (parseInt(nextReload) <= 0) {
                                //Get the ID of the tab that must be reloaded
                                chrome.storage.sync.get(['tabid'], function (result) {
                                    for (let data of Object.keys(result)) {
                                        tabId = result[data];
                                    }

                                    //Reload the tab we want, from memory
                                    chrome.tabs.reload(tabId);

                                    //Just prevent garbarge data from getting in
                                    if (reloadTime == -1 || reloadTime == 0) {
                                        refreshData()
                                    } else {
                                        //Go back to the start of this function, and we will wait the number of seconds before reloading again
                                        chrome.storage.sync.set({
                                            "nextReload": `${reloadTime}`
                                        }, function () {
                                            //Restart the loop
                                            setTimeout(refreshData, 1000);
                                        })
                                    }
                                })
                            }
                            //It's not time to reload:
                            else {
                                //console.log("Not time to reload yet")
                                chrome.storage.sync.set({
                                    "nextReload": `${(nextReload-1)}`
                                }, function () {
                                    //Restart the loop
                                    setTimeout(refreshData, 1000);
                                })
                            }
                        })

                    } else {
                        //Restart loop
                        //console.log("refresh reload cycle")
                        refreshData()
                    }
                });
                //Begin end
            })
        })
    });
}

//Checks to see if we need to start reloading the tab
function refreshData() {
    //console.log("refresh")
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

//Wait 6 seconds and then begin looping, just to make sure everything else gets set up
setTimeout(refreshData, 6000);