let string = "1";
let number = 1;
let result;

const calculate = (a, b) => a + b;

result = calculate(number, number);
console.log("value: ", result, " type of ", typeof result);

result = calculate(number, string);
console.log("value: ", result, " type of ", typeof result);
