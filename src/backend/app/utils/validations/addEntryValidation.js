import moment from "moment";

export const isFutureTime = (selectedDateTime) => {
    const now = moment(); // Current moment
    return moment(selectedDateTime).isAfter(now);
};

export const validateAmount = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
};

export const validateUnits = (units) => {
    const number = parseFloat(units);
    return !isNaN(number) && number > 0;
};


export const validatePrice = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) > 0;
};
