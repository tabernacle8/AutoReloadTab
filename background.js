/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/




//First time setup, establish some data for variables
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