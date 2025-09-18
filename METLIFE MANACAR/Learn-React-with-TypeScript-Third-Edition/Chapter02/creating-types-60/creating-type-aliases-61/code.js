var table = {
    name: "Table",
    purchase: function (quantity) { return console.log("Purchased ".concat(quantity, " tables")); },
};
table.purchase(4);
var chair = {
    name: "Chair",
    unitPrice: 40,
    purchase: function (quantity) { return console.log("Purchased ".concat(quantity, " chairs")); },
};
chair.purchase(2);
var chairOnSale = {
    name: "Chair on Sale",
    unitPrice: 30,
    discount: 5,
    purchase: function (quantity) { return console.log("Purchased ".concat(quantity, " chairs on sale")); },
};
chairOnSale.purchase(2);
