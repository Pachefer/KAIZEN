// let table = {name: "Table"; unitPrice: 450};
// table.discount = 10;
var table = {
    name: "Table",
};
//FPV
var chair = {
    name: "Chair",
};
var desk = {
    name: "Desk",
};
var product = table || chair || desk;
console.log(product.name);
