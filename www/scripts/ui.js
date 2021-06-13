let errorInProgress = false;

// Onload media queries, virtual keyboard Workaround.
if(window.innerHeight <= 700 && window.innerHeight > 568) {
    if(document.querySelector('#button-2nd')) {
        document.querySelector('style').innerText = ".dose {margin-top: 27px;} #calc-action-button {margin-top: 23px;}";
    }
} else if(window.innerHeight <= 568) {
    if(document.querySelector('#button-2nd')) {
        document.querySelector('style').innerText = ".button-2nd {margin-top: 10px;} .dose {margin-top: 10px; margin-bottom: 0;} #calc-action-button {margin-top: 10px;}";
    }
}

/**
 * Throw an error to the user, this could be because of invalid input etc.
 * @param {string} error 
 */
const throwUserError = (error) => {
    alert(error);
    showStatus(false);
}

/**
 * If for some reason localStorage has missing values or has been wiped this function gets called. This is just a safety measure.
 * @param {string} missingKey 
 */
const missingValue = (missingKey) => {
    alert('Missing value: ' + missingKey);
}

/**
 * @description show status on menu icon
 * @param {boolean} status true = green tick, false = red cross
 */
const showStatus = (status, back) => {
    if(errorInProgress === false) {
        errorInProgress = true;
        const icon = document.querySelector('#navLogo');
        let url = back ? "../" : "";
        if(status) {
            icon.setAttribute("src", url + "assets/Icons/Status Icon/Status_Done.png");
        } else {
            icon.setAttribute("src", url + "assets/Icons/Status Icon/Status_Failed.png");
        }
        setTimeout(() => {
            icon.setAttribute("src", url + "assets/Icons/logo.png");
            errorInProgress = false;
        }, 1000);
    }
}

/**
 * Decides what the main nav button should do.
 */
document.querySelector('#navLogo').addEventListener('click', () => {
    if(localStorage.getItem("returningUser")) {
        if(!document.querySelector("#navLogo").hasAttribute("onclick")) { // other routes stored directly on the html file -- <img src="../assets/Icons/return.png" id="navLogo" onclick="window.location = 'menu.html';">
            window.location = "../index.html";
        }
    }
});


/**
 * Deduct or increase the number of carbohydrates in the carbohydrates input
 * @param {Number} amt Recommended -10 or 10
 */
const changeCarbs = (amt) => {
    const carbohydrates = document.querySelector('#calculatorForm input[name="Carbohydrates"]');
    const inputValue = carbohydrates.value ? parseFloat(carbohydrates.value) : 0;
    const carbValue = inputValue + amt;
    carbohydrates.value = carbValue;
    if(carbohydrates.value < 0) {
        document.querySelector('#carbError').innerText = "Error: Carbohydrates cannot be less than 0.";
        carbohydrates.value = 0;
    } else {
        document.querySelector('#carbError').innerText = "";
    }
}

/**
 * Handle back button presses using cordova's deviceready event.
 */
window.addEventListener('DOMContentLoaded', onLoad(), false);

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}
// device APIs are available
//
function onDeviceReady() {
    // Register the event listener
    try {
        document.addEventListener("backbutton", onBackKeyDown, false); // Callback in Individual html files.
    } catch (error) {
        // ugly way of handling if page does not have a onBackKeyDown handler function
    }
}
