export const isValidNumber = (number) => number.match(/^[0-9\b]+$/);
export const isValidCharacter = (character) => character.match(/^[a-zA-Z ]*$/);
export const isValidPassword = (character) => character.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{6,}$/);
export const isValidEmail = (email) => email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const isEmptyValue = (value) => value.replace(/\s/g, '')?.length;
export const pressEnterCallFunction = (e, action) => {
    if (e.key === 'Enter') {
        return action();
    }
}
export const pressEnterCallFunctionCheckout = (e, action, setOpen, isEditShipping) => {
    if (e.key === 'Enter') {
        if (isEditShipping) {
            setOpen(false)
        }
        return action();
    }
}
export const isNumber = /^[0-9\b]+$/;
export const formatCurrency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
});
export const exceptThisSymbols = ["e", "E", "+", "-", "."];

export const getDataFormat = (date) => {
    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
        return date.toLocaleString('en-US', { month: 'short' });
    }
    let d = date?.split(" ")?.[0]?.split("-");
    const year = d?.[0];
    const month = getMonthName(d?.[1])
    const day = d?.[2];
    return `${month} ${day}, ${year}`;
};

export const getDataFormatNormal = (date) => {
    let d = date?.split(" ")?.[0]?.split("-");
    const year = d?.[0];
    const month = d?.[1];
    const day = d?.[2];
    return `${day}/${month}/${year}`;
};

export const baseDomainChanges = window.location.origin;