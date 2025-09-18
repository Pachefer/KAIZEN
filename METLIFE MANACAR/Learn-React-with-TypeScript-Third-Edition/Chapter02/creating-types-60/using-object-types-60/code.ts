// let table = {name: "Table"; unitPrice: 450};
// table.discount = 10;

const table: { name: string; unitPrice?: number } = {
  name: "Table",
};

//FPV
const chair: { name: string; unitPrice?: number } = {
  name: "Chair",
};

const desk: { name: string; unitPrice?: number } = {
  name: "Desk",
};

const product = table || chair || desk;

console.log(product);