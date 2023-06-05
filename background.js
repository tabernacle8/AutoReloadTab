/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/

//Checks to see if we need to start reloading the tab
function refreshData() {
    //console.log("refresh")
    //Get refreshing true or false data
    chrome.storage.sync.get(["refreshing"], function (result) {
        for (let data of Object.keys(result)) {
            //console.log(result)
            if (result[data] == 1) {
                //Let's start refreshing!
                beginReloading();
            } else {
                //Do not refresh or stop refreshing!
                setTimeout(refreshData, 1000);
            }
        }
    });
}

/*
nextReload: Time until the page reloads
reloadSeconds: Time in seconds between each reload
refreshing: 0 if not refreshing, 1 if refreshing
tabid: id of tab to refresh
*/
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
            reloadSeconds: "10",
        },
        function () {
            //null
        }
    );
    chrome.storage.sync.set({
            reloadMinutes: "0",
        },
        function () {
            //null
        }
    );
    chrome.storage.sync.set({
            reloadHours: "0",
        },
        function () {
            //null
        }
    );
    chrome.storage.sync.set({
            refreshing: "0",
        },
        function () {
            //null
        }
    );
    chrome.storage.sync.set({
            tabid: "0",
        },
        function () {
            //null
        }
    );
    chrome.storage.local.set({
            nextReload: "10",
        },
        function () {
            //null
        }
    );

    chrome.storage.local.set({
            //Current time
            experimentalGlobalTime: new Date().getTime() / 1000,
        },
        function () {
            //null
        }
    );
    console.log("Thanks for installing! First time setup is complete");
});

//Establish extention for all tabs
//Runs only on first time setup
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        //Here is the tab whitelist, currently it is empty
                        urlMatches: ".",
                    },
                }),
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()],
        }, ]);
    });
    console.log("Hook with whitelist is done");
    console.log(
        "Everything is done! Booting up the main background script in 5 seconds..."
    );
});

//Listen for alarm from popup
chrome.alarms.onAlarm.addListener(function (alarm) {
    var refreshing = 0;
    console.log("Alarm triggered");
    if (alarm.name == "reload") {
        //console.log("reload")
        //Get the ID of the tab that must be reloaded
        chrome.storage.sync.get(["tabid"], function (result) {
            for (let data of Object.keys(result)) {
                tabId = result[data];
            }

            //Reload the tab we want, from memory
            chrome.storage.sync.get(["refreshing"], function (result) {
                for (let data of Object.keys(result)) {
                    refreshing = result[data];
                }

                if (refreshing == 1) {
                    console.log("Reloading!");
                    chrome.tabs.reload(tabId);
                    restartAlarm();
                }
            });
        });
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "restartAlarm") {
      // Call your restartAlarm function here.
      restartAlarm();
      sendResponse({message: "Alarm restarted!"});
    }
  });

  
let reloadInterval;

function restartAlarm() {
    console.log("Restarting alarm");

    // Cancel any existing interval
    if (reloadInterval) {
        //clearInterval(reloadInterval);
        reloadInterval = null;
    }

    chrome.alarms.clear("reload");

    chrome.storage.local.get(["nextReload"], function (result) {
        for (let data of Object.keys(result)) {
            const nextReload = parseInt(result[data]);

            // Ensure nextReload is a positive integer
            if (!Number.isInteger(nextReload) || nextReload <= 0) {
                console.error(`Invalid nextReload value: ${nextReload}`);
                return;
            }

            // Decide whether to use setInterval or alarms based on the reload interval
            if (nextReload < 60) {
                // Schedule the next reload with setInterval
                reloadInterval = setInterval(function() {
                    // Before reloading, check if 'refreshing' is still 1

                    //Get tab id from storage
                    chrome.storage.sync.get(["tabid"], function (result) {
                        for (let data of Object.keys(result)) {
                            tabId = result[data];
                        }
                        chrome.storage.sync.get(["refreshing"], function (result) {
                            if (result.refreshing == 1) {
                                console.log("Reloading from setInterval");
                                chrome.tabs.reload(tabId);
                                updateGlobalTime(nextReload);
                            } else {
                                console.log("Refreshing is not enabled. Stopping reloads.");
                                //clearInterval(reloadInterval);
                                reloadInterval = null;
                            }
                        });
                    });
                }, nextReload * 1000); // Convert to milliseconds
            } else {
                //Get tab id from storage and reload
                chrome.storage.sync.get(["tabid"], function (result) {
                    for (let data of Object.keys(result)) {
                        tabId = result[data];
                    }
                    chrome.storage.sync.get(["refreshing"], function (result) {
                        if (result.refreshing == 1) {
                            console.log("Reloading from alarms");
                            chrome.tabs.reload(tabId);
                            updateGlobalTime(nextReload);
                        } else {
                            console.log("Refreshing is not enabled. Stopping reloads.");
                            //clearInterval(reloadInterval);
                            reloadInterval = null;
                        }
                    });
                });
                // Schedule the next reload with alarms
                chrome.alarms.create("reload", {
                    delayInMinutes: nextReload / 60,
                });
                updateGlobalTime(nextReload);
            }
        }
    });
}

// Function to update experimentalGlobalTime
function updateGlobalTime(nextReload) {
    // Get current time in second form
    var currentTime = new Date().getTime() / 1000;
    // Calculate the time until the next reload
    var globalNextReload = currentTime + nextReload;

    // Update the experimentalGlobalTime
    chrome.storage.sync.set({
        experimentalGlobalTime: `${globalNextReload}`,
    }, function () {
        console.log("Updated experimental global time to " + globalNextReload);
    });
}


