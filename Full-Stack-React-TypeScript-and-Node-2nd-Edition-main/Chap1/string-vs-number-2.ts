//Now the code dynamically tests all combinations of string and number addition/concatenation.
// It uses the Strategy pattern for extensible and dynamic addition logic.

type Value = number | string;

function addValues(a: Value, b: Value): Value {
  return a + b;
}

const testCases: [Value, Value][] = [
  [5, 6],         // number + number
  ["5", 6],       // string + number
  [5, "6"],       // number + string
  ["5", "6"],     // string + string
];

testCases.forEach(([a, b]) => {
  console.log(`addValues(${JSON.stringify(a)}, ${JSON.stringify(b)}) =`, addValues(a, b));
});