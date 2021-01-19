//Updates the reload timer for popup.html

function updateReloadTimer() {
    let nextReloadDisplayed = document.getElementById("nextReload");
    var nextReload = "0"

    chrome.storage.sync.get(['nextReload'], function (result) {
        for (let data of Object.keys(result)) {
            nextReload = result[data];
        }

        nextReloadDisplayed.innerHTML = nextReload
        setTimeout(updateReloadTimer, 1000);
    })
}
updateReloadTimer()