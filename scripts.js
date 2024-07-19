const NUMBER_BUTTON_CLASS = "number-button";
const DECIMAL_BUTTON_CLASS = "decimal-button";
const OPERATION_BUTTON_CLASS = "operation-button";
const EQUAL_BUTTON_CLASS = "equal-button";
const MISC_BUTTON_CLASS = "misc-button";

const DECIMAL_POINT = ".";
const PLUS_SIGN = "+";
const SUBTRACTION_SIGN = "-";
const MULTIPLICATION_SIGN = "\u00D7";
const DIVISION_SIGN = "\u00F7";
const EQUAL_SIGN = "=";

const CLEAR_BUTTON = "AC";
const SIGN_BUTTON = "+/-";
const PERCENT_BUTTON = "%";

let currentCalculatorStack = [];
createButtons();

const buttonContainer = document.querySelector(".button-container");
buttonContainer.addEventListener("click", updateCalculator);

let operations = {
    "+" : (firstOperand, secondOperand) => firstOperand + secondOperand,
    "-" : (firstOperand, secondOperand) => firstOperand - secondOperand,
    "\u00D7" : (firstOperand, secondOperand) => firstOperand * secondOperand,
    "\u00F7" : (firstOperand, secondOperand) => firstOperand / secondOperand,
}

function operate(firstOperand, operator, secondOperand) {
    let result = operations[operator](firstOperand, secondOperand);
    return (String(result).length > 7 ? +result.toFixed(1) : result);
}

function createButtons() {
    const buttonIDs = ["AC", "+/-", "%", "\u00F7", "7",
                     "8", "9", "\u00D7", "4", "5", "6",
                      "-", "1", "2", "3", "+", "0", ".", "="];
    const buttonContainer = document.querySelector(".button-container");

    for (let id of buttonIDs) {
        let button = document.createElement("button");
        applyButtonStyles(id, button);
        buttonContainer.appendChild(button);
    }
}

function applyButtonStyles(id, button) {
    button.setAttribute("id", `${id}-button`);
    button.classList.add("calculator-button");
    button.textContent = id;

    let colorClass = applyButtonTypeClass(id);
    button.classList.add(`${colorClass}`);
}

function applyButtonTypeClass(id) {
    let typeClass;
    if (+id >= 0 && +id <= 9) {
        typeClass = NUMBER_BUTTON_CLASS;
    } else if (id === DECIMAL_POINT) {
        typeClass = DECIMAL_BUTTON_CLASS;
    } else if (id === PLUS_SIGN || id === SUBTRACTION_SIGN ||
               id === MULTIPLICATION_SIGN || id === DIVISION_SIGN) {
        typeClass = OPERATION_BUTTON_CLASS;
    } else if (id ===  EQUAL_SIGN) {
        typeClass = EQUAL_BUTTON_CLASS
    } else {
        typeClass = MISC_BUTTON_CLASS;
    }

    return typeClass;
}


let operationPressed;
function updateCalculator(event) {
    const output = document.querySelector("#output");
    let buttonClass = event.target.classList[1];
    let buttonPressed = event.target.textContent;
    let buttonID = event.target.id;

    if (hasOverflowed(output, buttonPressed)) {
        updateDisplayValue(output, "Overflow");
        return;
    } 

    switch (buttonClass) {
        case NUMBER_BUTTON_CLASS:
            updateOutputWithNumber(buttonPressed, operationPressed);
            disableOperationButton();
            operationPressed = false;
            break;
        case DECIMAL_BUTTON_CLASS:
            updateOutputWithDecimal(output, buttonPressed);
            operationPressed = false;
            break;
        case OPERATION_BUTTON_CLASS:
            updateOutputWithOperation(output, buttonPressed, buttonID);
            operationPressed = true;
            break;
        case EQUAL_BUTTON_CLASS:
            updateOutputWithEqual(output, operationPressed);
            operationPressed = false;
            break;
        case MISC_BUTTON_CLASS:
            let updateOutputWithMisc = chooseMiscButton(buttonPressed);
            updateOutputWithMisc(output, buttonPressed, buttonClass);
            operationPressed = false;
            disableOperationButton();
            break;
    }
}

function isValidDisplayLength(output, buttonPressed) {
    const maxDigits = 9;

    if (buttonPressed == SIGN_BUTTON || buttonPressed == CLEAR_BUTTON ||
         buttonPressed == PERCENT_BUTTON) {
        return true;
    }

    return getCurrentDisplayValue(output).length < maxDigits;
}

function isValidOperation(operationPressed) {
    return isEmptyCalculatorStack() || containsResult() ||
          (containsOperandAndOperator() && operationPressed);
}

function isEmptyDisplay(output) {
    let calculatorDisplay = output.textContent;
    let zero = "0";
    return calculatorDisplay === zero;
}

function isDecimalNumber(output) {
    return (+getCurrentDisplayValue(output)) % 1 !== 0
}

function isPositive(output) {
    let currentValue = +output.textContent;
    return currentValue > 0;
}

function isEmptyCalculatorStack() {
    return getCurrentStackLength() === 0
}

function containsResult() {
    return getCurrentStackLength() === 1;
}

function containsOperandAndOperator() {
    return getCurrentStackLength() === 2;
}

function getCurrentStackLength() {
    return currentCalculatorStack.length;
}

function getCurrentDisplayValue(output) {
    return output.textContent;
}

function updateResultInStack(newResultValue) {
    currentCalculatorStack.pop();
    currentCalculatorStack.push(newResultValue);
}

function updateDisplayValue(output, value) {
    output.textContent = value;
}

function concatenateToValue(output, value) {
    output.textContent += value;
}

function clearCalculator(output, buttonPressed, buttonClass) {
    output.textContent = "0";
    currentCalculatorStack = [];
}

function updateOutputWithNumber(buttonPressed, operationPressed) {
    if (containsOperandAndOperator() && operationPressed) {
        updateDisplayValue(output, "0");
    }

    if (containsResult()) clearCalculator(output);

    if (isEmptyDisplay(output)) {
        updateDisplayValue(output, buttonPressed);
    } else {
        concatenateToValue(output, buttonPressed);
    }
}

function updateOutputWithDecimal(output, buttonPressed) {
    // const currentDisplayValue = getCurrentDisplayValue();
    if (!isDecimalNumber(output)) concatenateToValue(output, buttonPressed);

    if (containsOperandAndOperator() && operationPressed) {
        updateDisplayValue(output, `0${buttonPressed}`);
    }
}

function updateOutputWithPercentage(output, buttonPressed, buttonClass) {
    if (hasOverflowed(output, buttonPressed, buttonClass)) return;

    const currentDisplayValue = +getCurrentDisplayValue(output);
    let percentageValue = currentDisplayValue / 100;

    if (containsResult()) updateResultInStack(percentageValue);
    updateDisplayValue(output, percentageValue);
}

function updateOutputWithSign(output, buttonPressed, buttonClass) {
    const currentDisplayValue = +getCurrentDisplayValue(output);

    if (isEmptyDisplay(output) || hasOverflowed(output, buttonPressed, buttonClass)) return;
    
    if (isPositive(output)) {
        updateDisplayValue(output, -currentDisplayValue);
        if (containsResult()) updateResultInStack(-currentDisplayValue);
    } else {
        updateDisplayValue(output, Math.abs(currentDisplayValue));
        if (containsResult()) updateResultInStack(Math.abs(currentDisplayValue));
    }
}

function chooseMiscButton(buttonPressed) {
    if (buttonPressed === CLEAR_BUTTON) {
        return clearCalculator;
    } else if (buttonPressed === SIGN_BUTTON) {
        return updateOutputWithSign;
    } else if (buttonPressed === PERCENT_BUTTON) {
        return updateOutputWithPercentage;
    }
}

function updateOutputWithOperation(output, buttonPressed, buttonID) {
    disableOperationButton();
    enableOperationButton(buttonID);

    if (isEmptyCalculatorStack()) {
        currentCalculatorStack.push(output.textContent);
        currentCalculatorStack.push(buttonPressed);
    } else if (containsResult()) {
        currentCalculatorStack.push(buttonPressed);
    } else if (containsOperandAndOperator()) {
        updateOutputWithEqual(output, operationPressed, buttonPressed);
    }
}

function updateOutputWithEqual(output, operationPressed, optionalButton) {
    let secondOperand = +getCurrentDisplayValue(output);
    let firstOperand, operator, result;

    if (isValidOperation(operationPressed)) {
        updateDisplayValue(output, "Error");
        return;
    }

    if (containsOperandAndOperator()) {
        operator = currentCalculatorStack.pop();
        firstOperand = +currentCalculatorStack.pop();
    }

    if (dividedByZero(operator, secondOperand)) {
        updateDisplayValue(output, "LOL");
        return;
    }

    result = operate(firstOperand, operator, secondOperand);
    updateDisplayValue(output, result);
    currentCalculatorStack.push(result);
    if (optionalButton) currentCalculatorStack.push(optionalButton);
}

function disableOperationButton() {
    const activeOperationButtons = Array.from(document.querySelectorAll(".active"));
    for (const operation of activeOperationButtons) {
        operation.classList.remove("active");
        operation.classList.add("operation-button");
    }
}

function enableOperationButton(buttonID) {
    const button = document.querySelector(`#\\${buttonID}`);
    button.classList.add("active");
    button.classList.remove("operation-button");
}

function dividedByZero(operator, secondOperand) {
    return operator === DIVISION_SIGN && secondOperand === 0;
}

function hasOverflowed(output, buttonPressed) {
    return (getCurrentDisplayValue(output) === "Overflow" && buttonPressed !== CLEAR_BUTTON) ||
            !isValidDisplayLength(output, buttonPressed);
}