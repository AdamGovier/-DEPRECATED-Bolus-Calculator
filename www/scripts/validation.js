/**
 * @description Validate user input
 */
const validate = {
    /**
     * Validate the number of carbs.
     * @param {Number} numberOfCarbs 
     * @returns Object {"error":true/false, "reason":""}
     */
    numberOfCarbs : (numberOfCarbs) => {
        if(!isNaN(numberOfCarbs)) { // If number
            if(numberOfCarbs < 0) {
                return {"error":true, "reason":"You cannot have a negative number of carbohydrates."};
            } else if(numberOfCarbs > 350) {
                return {"error":true, "reason":"The number of carbohydrates provided is dangerously high, You most likely have made a mistake."};
            } else {
                return {"error":false};
            }
        } else {
            return {"error":true, "reason":"Ilegal character(s) provided."};
        }
    },
    /**
     * Validate blood sugars
     * @param {Number} mmolL
     * @example bloodGlucose(7.2);
     * @returns Object {"error":true/false, "reason":""}
     */
    bloodGlucose : (mmolL) => {
        if(mmolL < 0) {
            return {"error":true, "reason":"Invalid blood sugar entered, If this is a valid blood glucose reading SEEK IMMEDIATE MEDICAL HELP."};
        } else if (mmolL < 1.5) {
            return {"error":true, "reason":"Extremely low blood sugar, Seek medical help if needed."};
        } else if (mmolL >= 30) {
            return {"error":true, "reason":"Extremely high blood sugar, Take a large correction of insulin and Seek medical help if needed."};
        } else {
            return {"error":false}
        }
    }
};