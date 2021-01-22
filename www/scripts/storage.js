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
    addDiaryEntry : data => {
        let currentEntries = [];

        if(localStorage.getItem("diaryEntries")) {
            currentEntries = JSON.parse(localStorage.getItem("diaryEntries"));
        }

        currentEntries.push(data);
        localStorage.setItem("diaryEntries", JSON.stringify(currentEntries));
    }
};

