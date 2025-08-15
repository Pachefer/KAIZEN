var unitPrice;
//unitPrice = "Table";
unitPrice = 100;
function getTotal(unitPrice, quantity, discount) {
    var priceWithoutDiscount = unitPrice * quantity;
    var discountAmount = priceWithoutDiscount * discount;
    return priceWithoutDiscount - discountAmount;
}
//let total: string = getTotal(500, "one", 0.1);
//correct
var total = getTotal(500, 1, 0.1);
console.log(total);
