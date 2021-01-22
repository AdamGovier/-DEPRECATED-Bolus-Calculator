
/**
 * @description Enables/Disables the action button.
 * @param {Boolean} disabled Should the button be disabled?
 * @param {string} text button value 
 */
function setBtn(disabled, text) { 
    if(disabled) {
        document.querySelector("#calc-action-button").setAttribute("disabled", disabled);
    } else {
        document.querySelector("#calc-action-button").removeAttribute("disabled");
    }
    
    document.querySelector("#calc-action-button").value = text;
}

let documentChanges = false;

/**
 * @description Adds an event listener to every number input and then if changes set's "documentChanges" to true
 */
function setExitListeners() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener("change", e => {
            documentChanges = true;
        });
    });
}

/**
 * @description If document has changed according too setExitListeners(); prompt user if they are sure that they want to exit.
 */
function exitWithOutSaving() {
    if(!documentChanges) {
        window.history.back();
    } else {
        if(confirm('Are you sure you want to exit without saving?')) {
            window.history.back();
        }
    }
}