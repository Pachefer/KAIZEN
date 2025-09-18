function calculateTotalPrice(
  product: { name: string; unitPrice: number },
  quantity: number,
  discount: number
) {
  const priceWithoutDiscount = product.unitPrice * quantity;
  const discountAmount = priceWithoutDiscount * discount;
  return priceWithoutDiscount - discountAmount;
}

const product = { name: "Laptop", unitPrice: 1000 };
const quantity = 2;
const discount = 0.1;
const totalPrice = calculateTotalPrice(product, quantity, discount);
console.log(totalPrice);












