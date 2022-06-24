/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/




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


/*
nextReload: Time until the page reloads
reloadSeconds: Time in seconds between each reload
refreshing: 0 if not refreshing, 1 if refreshing
tabid: id of tab to refresh
*/
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        reloadSeconds: '10'
    }, function () {
        //null
    });
    chrome.storage.sync.set({
        reloadMinutes: '0'
    }, function () {
        //null
    });
    chrome.storage.sync.set({
        reloadHours: '0'
    }, function () {
        //null
    });
    chrome.storage.sync.set({
        refreshing: '0'
    }, function () {
        //null
    });
    chrome.storage.sync.set({
        tabid: '0'
    }, function () {
        //null
    });
    chrome.storage.local.set({
        nextReload: '10'
    }, function () {
        //null
    });

    chrome.storage.local.set({
        //Current time
        experimentalGlobalTime: new Date().getTime() / 1000
    }, function () {
        //null
    });
    console.log("Thanks for installing! First time setup is complete")

});


//Establish extention for all tabs
//Runs only on first time setup
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    //Here is the tab whitelist, currently it is empty
                    urlMatches: '.'
                },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
    console.log("Hook with whitelist is done")
    console.log("Everything is done! Booting up the main background script in 5 seconds...")
});

//Listen for alarm from popup
chrome.alarms.onAlarm.addListener(function (alarm) {
    var refreshing = 0;
    console.log("Alarm triggered")
    if (alarm.name == "reload") {
        //console.log("reload")
        //Get the ID of the tab that must be reloaded
        chrome.storage.sync.get(['tabid'], function (result) {
            for (let data of Object.keys(result)) {
                tabId = result[data];
            }

            //Reload the tab we want, from memory
            chrome.storage.sync.get(['refreshing'], function (result) {
                for (let data of Object.keys(result)) {
                    refreshing = result[data];
                }

            if (refreshing == 1) {
            console.log("Reloading!")
            chrome.tabs.reload(tabId);
            restartAlarm();
            }
        });
    })
    }
})

function restartAlarm() {
    console.log("Restarting alarm")
    var reloadTabID = ""
    var nextReload = 0;

    chrome.storage.local.get(['nextReload'], function (result) {
        for (let data of Object.keys(result)) {
            nextReload = result[data];

        }


        //Get current time in second form
        var currentTime = new Date().getTime() / 1000
        //Calculate the time until the next reload
        var globalNextReload = currentTime + parseInt(nextReload)


            //Set the next reload time
            chrome.storage.sync.set({
                "experimentalGlobalTime": `${globalNextReload}`
            }, function () {
                //Read experimentalGlobalTime back from storage
                chrome.storage.sync.get(['experimentalGlobalTime'], function (result) {
                    for (let data of Object.keys(result)) {
                        console.log("Experimental global time is " + result[data])
                    }
                })
            });
            chrome.alarms.create("reload", {
                delayInMinutes: nextReload / 60
            })
    });
}