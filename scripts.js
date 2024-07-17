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