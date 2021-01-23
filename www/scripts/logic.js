/**
 * @description Calculates the number of units of insulin needed for a specific amount of carbohydrates.
 * @param {Number} numberOfCarbs The number of carbohydrates to work out the units of insulin for.
 * @method Number of carbohydrates divided by the users carbohydrate ratio e.g. 1 unit per x amt of carbs.
 */

 /**
  * @description calculates dosage based on the options you provide
  * @param {Array} options {key:value,key:value..} options include [numberOfCarbs<Number>,bloodSugar<Number>,modifiers<Array [Modifier Names]]
  */
const calculateDose = (options) => {
    let dose = 0;

    if(options.numberOfCarbs) dose += carbs2Insulin(options.numberOfCarbs);
    if(options.bloodSugar) dose += bloodSugarDoseCalc(options.bloodSugar);
    if(options.modifiers.length !== 0) dose += handleModifiers(options.modifiers, dose); // note +- = - so reductions still work.

    //round to nearest 0.25;
    dose = (Math.round(dose * 4) / 4).toFixed(2);

    showStatus(true);
    if(dose > 0) {
        return dose;
    } else {
        return 0.00;
    }
}

/**
 * @description Returns the amt to modify the total dose by. This function should be the last called from calculateDose();
 * @param {Array} modifiers an array of modifier id's 
 * @param {Number} totalDose The total dosage of insulin calculated.
 */
function handleModifiers(modifiers, totalDose) {
    let totalDoseChange = 0;
    modifiers.forEach(id => {
        const modifier = userData.getModifier(id);
        const changeDoseByPc = modifier.percentage;
        const DoseChange = changeDoseByPc / 100 * totalDose;
        modifier.increase ? totalDoseChange += DoseChange : totalDoseChange -= DoseChange; // Either increase or reduce dose.
    });
    return totalDoseChange;
}

/**
 * @description Converts an amt of carbohydrates to a dose.
 * @param {Number} numberOfCarbs 
 */
const carbs2Insulin = (numberOfCarbs) => {
    /**
     * Checks if the numberOfCarbs provided is not of an extreme quantity.
     */

    if(validate.numberOfCarbs(numberOfCarbs).error) {
        throwUserError(validate.numberOfCarbs(numberOfCarbs).reason);
        throw "Invalid Carbohydrate Entree";
    }


    /**
     * Checks if the value "carbRatio" is stored within the app's local storage. Just incase of data corruption or something similar.
     */
    const carbRatio = userData.get("carbRatio");
    checkValue(carbRatio, "carbRatio");

    return numberOfCarbs / carbRatio;
}

/**
 * @description Generates a dose based of the provided BG Level.
 * @param {Number} bloodSugar 
 */
const bloodSugarDoseCalc = (bloodSugar) => {

    let correctionFactor = userData.get("correctionFactor");
    checkValue(correctionFactor, "correctionFactor");

    /**
     * Checks if the values "minCorrectionBgLevel" & "maxCorrectionBgLevel" are stored within the app's local storage.
     */

    if(validate.bloodGlucose(bloodSugar).error) {
        throwUserError(validate.bloodGlucose(bloodSugar).reason);
    }

    /**
     * Checks if the values "minCorrectionBgLevel", "maxCorrectionBgLevel" & "targetBloodSugar" are stored within the app's local storage.
     */

    let minPost_CorrectionBgLevel = userData.get("minPost_CorrectionBgLevel");
    checkValue(minPost_CorrectionBgLevel, "minPost_CorrectionBgLevel");

    let maxPost_CorrectionBgLevel = userData.get("maxPost_CorrectionBgLevel");
    checkValue(maxPost_CorrectionBgLevel, "maxPost_CorrectionBgLevel");

    
    let targetBloodSugar = userData.get("targetBloodSugar");
    checkValue(targetBloodSugar, "targetBloodSugar");

    /**
     * Forumla sourced from https://www.nhstayside.scot.nhs.uk/OurServicesA-Z/DiabetesOutThereDOTTayside/PROD_263751/index.htm
     */
    if(bloodSugar < minPost_CorrectionBgLevel || bloodSugar > maxPost_CorrectionBgLevel) {
        return (bloodSugar - targetBloodSugar) / correctionFactor;
    } else {
        return 0;
    }
}

/**
 * Checks if storage variable is valid
 * @param {Variable} input Key
 * @param {string} type Key
 */
function checkValue(input, type) {
    if(!input){
        missingValue(type);
        throw new Error("Missing Parameter from data store");
    }
}
