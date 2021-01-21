//Updates the reload timer for popup.html

function updateReloadTimer() {
    let nextReloadDisplayed = document.getElementById("nextReload");
    var nextReload = "0"

    chrome.storage.sync.get(['nextReload'], function (result) {
        for (let data of Object.keys(result)) {
            nextReload = result[data];
        }

        if (nextReload == "-1") {
            nextReload = "<b>Please select a reload time</b>"
        } else {
            nextReload = (`Next reload is in <b>${nextReload}</b> seconds`)
        }

        nextReloadDisplayed.innerHTML = nextReload
        setTimeout(updateReloadTimer, 1000);
    })
}
updateReloadTimer()