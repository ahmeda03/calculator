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
    const calculatorContainer = document.querySelector(".calculator-container");

    for (let id of buttonIDs) {
        let button = document.createElement("button");
        button.setAttribute("id", id);
        button.textContent = id;
        calculatorContainer.appendChild(button);
    }
}

createButtons();