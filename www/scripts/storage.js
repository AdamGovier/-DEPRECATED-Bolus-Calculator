const localStorage = window.localStorage;

/**
 * @description Manages all user data/storage, can be accessed as an object.
 */
const userData = {
    /**
     * @description Saves a value to local storage
     * @param {*} key 
     * @param {*} value 
     */
    save : (key, value) => {
        localStorage.setItem(key, value);
    },
    /**
     * @description Array version of userData.save();
     * @param {Array} arrayOfKeysAndValues Should be in the format as exampled below.
     * @example [{key:"value1",value:"I am very cool"},{key:"value2",value:42}] 
     */
    saveMultiple : (arrayOfKeysAndValues) => {
        arrayOfKeysAndValues.forEach(toSave => {
            userData.save(toSave.key, toSave.value);
        });
    },
    /**
     * @description Retrieves a value from local storage.
     * @param {string} key 
     */
    get : key => {
        return localStorage.getItem(key);
    },
    /**
     * @description Removes a value from local storage
     * @param {string} key 
     */
    deleteItem : key => {
        localStorage.removeItem(key);
    },
    /**
     * @description Clears all userData
     * @param {string} key 
     */
    wipe : key => {
        localStorage.removeItem(key);
    },
    /**
     * @description adds modifier to modifiers JSON array in localStorage, pass as an object not JSON.
     * @param {Object} data 
     */
    addModifier : data => {
        let currentModifiers = [];
        let currentModID = 0;

        if(localStorage.getItem("currentModID")) {
            currentModID = parseInt(localStorage.getItem("currentModID")) + 1;
        }
        localStorage.setItem("currentModID", currentModID);

        if(localStorage.getItem("modifiers")) {
            currentModifiers = JSON.parse(localStorage.getItem("modifiers"));
        }

        if(data.id === undefined) {
            data.id = currentModID;
        }
        
        currentModifiers.push(data);
        localStorage.setItem("modifiers", JSON.stringify(currentModifiers));
    },
    /**
     * @description gets a modifier from it's ID.
     * @param {Number} id 
     */
    getModifier : id => {
        const currentModifiers = JSON.parse(localStorage.getItem("modifiers"));
        const modifier = currentModifiers.filter(modifier => {
            if(modifier.id === id) return modifier;
        });
        return modifier[0];
    },
    /**
     * Removes modifier using a modifier ID, You can use this to edit a modifier by removing then using userData.addModifier();
     * @param {Number} id 
     */
    deleteModifier : id => {
        const currentModifiers = JSON.parse(localStorage.getItem("modifiers"));
        const updatedModifiers = currentModifiers.filter(modifier => {
            if(modifier.id != id) return modifier;
        });
        localStorage.setItem("modifiers", JSON.stringify(updatedModifiers));
    },
    /**
     * Adds an entry to the diary which can be accessed from diary.html
     * @param {Number} id 
     */
    addDiaryEntry : data => {
        let currentEntries = [];

        if(localStorage.getItem("diaryEntries")) {
            currentEntries = JSON.parse(localStorage.getItem("diaryEntries"));
        }

        currentEntries.push(data);
        localStorage.setItem("diaryEntries", JSON.stringify(currentEntries));
    },
    addShortcut : data => {
        let currentEntries = [];

        if(localStorage.getItem("shortcuts")) {
            currentEntries = JSON.parse(localStorage.getItem("shortcuts"));
        }

        currentEntries.push(data);
        localStorage.setItem("shortcuts", JSON.stringify(currentEntries));
    },
    incShortcutID : () => {
        let count = 0;
        if(localStorage.getItem("shortcutID")) {
            count = localStorage.getItem("shortcutID");
        }
        count++; // Intentionally starting at 1 so no boolean logic is messed up
        localStorage.setItem("shortcutID", count);
        return count;
    },
    getShortcut : (id) => {
        const currentShortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        const shortcut = currentShortcuts.filter(shortcut => {
            if(shortcut.id === id) return shortcut;
        });
        return shortcut[0];
    },
    deleteShortcut : id => {
        const currentShortcuts = JSON.parse(localStorage.getItem("shortcuts"));
        const updatedShortcuts = currentShortcuts.filter(shortcut => {
            if(shortcut.id != id) return shortcut;
        });
        localStorage.setItem("shortcuts", JSON.stringify(updatedShortcuts));
    },
};

const shortcutCart = {
    cartKey:"cartEntries",
    modifyCartEntry : (action, data) => {
        let currentEntries = [];

        let found = false;

        if(sessionStorage.getItem(shortcutCart.cartKey)) {
            currentEntries = JSON.parse(sessionStorage.getItem(shortcutCart.cartKey));
            for (let i = 0; i < currentEntries.length; i++) {
                const shortcut = currentEntries[i];
                if(shortcut.id === data.id && shortcut.sourceOfData === data.sourceOfData) {
                    if(action === "add") {
                        currentEntries[i].qty += data.qty;
                    } else if (action === "minus") {
                        currentEntries[i].qty -= data.qty;
                        if(currentEntries[i].qty <= 0) {
                            currentEntries.splice(i, 1);
                        }
                    }
                    
                    found = true;
                }
            }
        }

        if(!found) {
            currentEntries.push(data);
        }

        sessionStorage.setItem(shortcutCart.cartKey, JSON.stringify(currentEntries));
    },
    /**
     * Checks if shortcut is already added.
     * @param {int} id Shortcut ID
     * @param {string} sourceOfData local or api
     * @returns In theroy 0 or 1 e.g. true or false as there should not be duplicate results.
     */
    checkIfInCart: (id, sourceOfData) => {
        return shortcutCart.getCartEntries().filter(a => {
            return a.id === id && a.sourceOfData === sourceOfData;
        }).length;
    },
    getItem: (id, sourceOfData) => {
        if(shortcutCart.getCartEntries()) {
            return shortcutCart.getCartEntries().filter(a => {
                return a.id === id && a.sourceOfData === sourceOfData;
            })[0];
        } else {
            return null;
        }
    },
    getCartEntries : () => {
        return JSON.parse(sessionStorage.getItem(shortcutCart.cartKey));
    },
    totalCarbs : () => {
        let total = 0;
        if(shortcutCart.getCartEntries()) {
            shortcutCart.getCartEntries().forEach(shortcut => {
                total += shortcut.carbs * shortcut.qty;
            });
        }
        return total;
    },
    clearCart : () => {
        sessionStorage.removeItem(shortcutCart.cartKey);
    }
}