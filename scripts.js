let firstOperand, secondOperand, operator;

let operations = {
    "+" : (firstOperand, secondOperand) => firstOperand + secondOperand,
    "-" : (firstOperand, secondOperand) => firstOperand - secondOperand,
    "*" : (firstOperand, secondOperand) => firstOperand * secondOperand,
    "/" : (firstOperand, secondOperand) => firstOperand / secondOperand,
}

function operate(operator, firstOperand, secondOperand) {
    return (operations[operator])(firstOperand, secondOperand);
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

    let colorClass = getButtonColor(id);
    button.classList.add(`${colorClass}`);
}

function getButtonColor(id) {
    let colorClass;
    if (+id >= 0 && +id <= 9 || id === ".") {
        colorClass = "number-button";
    } else if (id === "+" || id === "-" || id === "\u00D7" || id === "\u00F7" || id ===  "=") {
        colorClass = "operation-button";
    } else {
        colorClass = "misc-button";
    }

    return colorClass;
}

createButtons();