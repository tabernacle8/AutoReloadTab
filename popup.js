let startReload = document.getElementById('startReload');
let stopReload = document.getElementById('stopReload');
let userTimeTextbox = document.getElementById('userTimeTextbox');
console.log("logging....")

chrome.storage.sync.get('color', function (data) {
    //changeColor.style.backgroundColor = data.color;
    //changeColor.setAttribute('value', data.color);
});

//changeColor.onclick = function(element) {
/*
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  };
  */
//}

userTimeTextbox.addEventListener("change", function (data) {
    console.log(userTimeTextbox.value);
    userTimeTextbox.Enabled = false;
})

startReload.onclick = function (element) {


}