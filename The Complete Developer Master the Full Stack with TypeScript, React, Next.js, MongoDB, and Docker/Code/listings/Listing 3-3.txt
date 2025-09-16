let string = "1";
let number = 1;
let result;

const calculate = (a, b) => {
    if (Number.isInteger(a) === false || Number.isInteger(b) == false) {
        throw new Error("Invalid type: a parameter is not an integer");
    } else {
        return a + b;
    }
};

result = calculate(number, number);
console.log("value: ", result, " type of ", typeof result);

result = calculate(number, string);
console.log("value: ", result, " type of ", typeof result);
