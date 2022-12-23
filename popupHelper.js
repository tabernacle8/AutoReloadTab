//Updates the reload timer for popup.html

function updateReloadTimer() {
    let nextReloadDisplayed = document.getElementById("nextReload");
    var nextReload = "0";
    var experimentalGlobalTime = 0;
    var refreshing = 0;

    //Check if reloading is set to 1
    chrome.storage.sync.get(["refreshing"], function (result) {
        for (let data of Object.keys(result)) {
            refreshing = result[data];
        }

        //If reloading is set to 1, get the next reload time
        chrome.storage.sync.get(["experimentalGlobalTime"], function (result) {
            for (let data of Object.keys(result)) {
                console.log("Experimental global time READ is " + result[data]);
                experimentalGlobalTime = result[data];

                var secondsFromNow =
                    parseInt(experimentalGlobalTime) - new Date().getTime() / 1000;
                if (secondsFromNow <= -1 || refreshing == 0) {
                    nextReload = `<b>Waiting for reload to start...</b>`;
                } else if (
                    secondsFromNow < 60 &&
                    (refreshing == 0 || refreshing == -11)
                ) {
                    nextReload = `<b>Sorry, due to Chrome's recent Manifest V3 restrictions, reload times must be at least 60 seconds :(</b>`;
                    chrome.storage.sync.set({
                            refreshing: "-11",
                        },
                        function () {
                            console.log("BAD TIME! Forcefully setting reloading set to 0");
                        }
                    );
                } else {
                    //Round secondsFromNow to an int
                    secondsFromNow = Math.round(secondsFromNow);
                    nextReload = `Next reload is in <b>${secondsFromNow}</b> seconds`;
                }

                //Wait another second to update the counter
                nextReloadDisplayed.innerHTML = nextReload;
                setTimeout(updateReloadTimer, 1000);
            }
        });
    });
}
updateReloadTimer();