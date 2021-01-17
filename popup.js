let startReload = document.getElementById('startReload');
let stopReload = document.getElementById('stopReload');
let userTimeTextbox = document.getElementById('reloadTimer');

function refreshData() {
    console.log("Hey im the tab reloader...")
    var reloadTime = 0
    var refreshValue = "0"
    var tabId = ""
    chrome.storage.sync.get(['reloadSeconds'], function (result) {
        for (let data of Object.keys(result)) {
            reloadTime = result[data];
        }
        chrome.storage.sync.get(['refreshing'], function (result) {
            for (let data of Object.keys(result)) {
                refreshValue = result[data];
            }

            if (refreshValue == "1") {
                chrome.storage.sync.get(['tabid'], function (result) {
                    for (let data of Object.keys(result)) {
                        tabId = result[data];
                    }
                    console.log("tabid: " + tabId)
                    chrome.tabs.getSelected(tabId, function (tab) {
                        chrome.tabs.reload(tab.id);
                    });
                    if(reloadTime==-1){
                        return;
                    }
                    setTimeout(refreshData, parseInt(reloadTime) * 1000);
                })

            }

        });
    });
}



console.log("Oh hey there. I'm ready to reload some tabs!")
var stopReloading = false


userTimeTextbox.addEventListener("change", function (data) {
    var newReloadTime = userTimeTextbox.value

    chrome.storage.sync.set({
        reloadSeconds: newReloadTime
    }, function () {
        console.log('Reload time is set to ' + newReloadTime);
    });


})

stopReload.onclick = function (element) {
    chrome.storage.sync.set({
        "refreshing": "0"
    }, function () {
        console.log('Reloading set to 1');
    })
}

startReload.onclick = function (element) {
    var reloadTabID = ""
    chrome.storage.sync.set({
        "refreshing": "1"
    }, function () {
        console.log('Reloading set to 1');
        chrome.tabs.getSelected(null, function (tab) {
            console.log(tab)
            reloadTabID = tab.windowId
            chrome.storage.sync.set({
                "tabid": reloadTabID
            }, function () {
                console.log('TabID cached as' + reloadTabID);
                refreshData();
            });
        });
    });
}