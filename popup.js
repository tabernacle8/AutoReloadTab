/*

Made with <3 by Tabernacle8

This project is on github! :)
https://github.com/tabernacle8/AutoReloadTab

*/

//Init some button values
let startReload = document.getElementById("startReload");
let stopReload = document.getElementById("stopReload");
let userTimeSeconds = document.getElementById("reloadTimer");
let userTimeMinutes = document.getElementById("reloadTimer2");
let userTimeHours = document.getElementById("reloadTimer3");

//Init function, first ran when the script boots
console.log("Oh hey there. I'm ready to reload some tabs!");

function updateReloadTime() {
    var reloadSeconds = 0;
    var reloadMinutes = 0;
    var reloadHours = 0;

    chrome.storage.sync.get(["reloadSeconds"], function (result) {
        for (let data of Object.keys(result)) {
            reloadSeconds = result[data];
        }

        chrome.storage.sync.get(["reloadMinutes"], function (result) {
            for (let data of Object.keys(result)) {
                reloadMinutes = result[data];
            }

            chrome.storage.sync.get(["reloadHours"], function (result) {
                for (let data of Object.keys(result)) {
                    reloadHours = result[data];
                }

                var totalReloadTime =
                    parseInt(reloadSeconds) +
                    parseInt(reloadMinutes) * 60 +
                    parseInt(reloadHours) * 60 * 60;

                chrome.storage.local.set({
                        nextReload: `${totalReloadTime}`,
                    },
                    function () {
                        console.log("next reload set to " + totalReloadTime);
                    }
                );
            });
        });
    });
}

//Listen for user input on the UI

userTimeSeconds.addEventListener("change", function (data) {
    var newReloadTime = userTimeSeconds.value;

    chrome.storage.sync.set({
            reloadSeconds: newReloadTime,
        },
        function () {
            console.log("Reload seconds is set to " + newReloadTime);
        }
    );
    updateReloadTime();
});

userTimeMinutes.addEventListener("change", function (data) {
    var newReloadTime = userTimeMinutes.value;

    chrome.storage.sync.set({
            reloadMinutes: newReloadTime,
        },
        function () {
            console.log("Reload minutes is set to " + newReloadTime);
        }
    );
    updateReloadTime();
});

userTimeHours.addEventListener("change", function (data) {
    var newReloadTime = userTimeHours.value;

    chrome.storage.sync.set({
            reloadHours: newReloadTime,
        },
        function () {
            console.log("Reload hours is set to " + newReloadTime);
        }
    );
    updateReloadTime();
});

//Executes when user clicks "stop"
stopReload.onclick = function (element) {
    //Sets "refreshing" to 0, telling us to stop the refresh cycle
    chrome.storage.sync.set({
            refreshing: "0",
        },
        function () {
            console.log("Reloading set to 0");
        }
    );
};

//Executes when user clicks "start"
startReload.onclick = function (element) {
    var reloadTabID = "";
    var nextReload = 0;

    chrome.storage.local.get(["nextReload"], function (result) {
        for (let data of Object.keys(result)) {
            nextReload = result[data];
        }

        //Set "refreshing" to 1 which starts the refresh cycle
        chrome.storage.sync.set({
                refreshing: "1",
            },
            function () {
                console.log("Reloading set to 1");

                //Get the current tab and store its id
                chrome.tabs.query({
                        currentWindow: true,
                        active: true,
                    },
                    function (tabs) {
                        reloadTabID = tabs[0].id;
                        chrome.storage.sync.set({
                                tabid: reloadTabID,
                            },
                            function () {
                                console.log("TabID cached as" + reloadTabID);

                                //Get current time in second form
                                var currentTime = new Date().getTime() / 1000;
                                //Calculate the time until the next reload
                                var globalNextReload = currentTime + parseInt(nextReload);

                                //If reload time is less than 60 seconds, stop
                                //Get refreshing value
                                chrome.storage.sync.get(["refreshing"], function (result) {
                                    for (let data of Object.keys(result)) {
                                        refreshing = result[data];
                                    }
                                    if (nextReload < 60 || refreshing == "-11") {
                                        console.log(
                                            "Reload time is less than 60 seconds, stopping"
                                        );
                                        chrome.storage.sync.set({
                                                refreshing: "-11",
                                            },
                                            function () {
                                                console.log("Reloading set to -11 -> BAD TIME");

                                                //Update the html popup
                                            }
                                        );
                                    }
                                    console.log(refreshing);

                                    //Push globalNextReload into storage
                                    console.log("Next reload set to " + globalNextReload);
                                    console.log("Current time is " + currentTime);

                                    //Set the next reload time
                                    chrome.storage.sync.set({
                                            experimentalGlobalTime: `${globalNextReload}`,
                                        },
                                        function () {
                                            //Read experimentalGlobalTime back from storage
                                            chrome.storage.sync.get(
                                                ["experimentalGlobalTime"],
                                                function (result) {
                                                    for (let data of Object.keys(result)) {
                                                        console.log(
                                                            "Experimental global time is " + result[data]
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    );

                                    //This is a hacky workaround for manifest V3. This api change sucks
                                    chrome.alarms.create("reload", {
                                        delayInMinutes: nextReload / 60,
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};