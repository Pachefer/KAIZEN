function calculateTotalPrice(product, quantity, discount) {
    var priceWithoutDiscount = product.unitPrice * quantity;
    var discountAmount = priceWithoutDiscount * discount;
    return priceWithoutDiscount - discountAmount;
}
var product = { name: "Laptop", unitPrice: 1000 };
var quantity = 2;
var discount = 0.1;
var totalPrice = calculateTotalPrice(product, quantity, discount);
console.log(totalPrice);
