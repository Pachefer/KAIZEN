let unitPrice: number;
//unitPrice = "Table";
unitPrice = 100;

function getTotal(
  unitPrice: number,
  quantity: number,
  discount: number
): number {
  const priceWithoutDiscount = unitPrice * quantity;
  const discountAmount = priceWithoutDiscount * discount;
  return priceWithoutDiscount - discountAmount;
}

//let total: string = getTotal(500, "one", 0.1);
//correct
let total: number = getTotal(500, 1, 0.1);
console.log(total);






