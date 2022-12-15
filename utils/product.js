module.exports.getRandomProduct = (products) => {
  if (products.length > 0 && Math.floor(Math.random() * 2) % 2 === 0) {
    console.log("Parity - ", Math.floor(Math.random() * 2));
    const randomIndex = Math.floor(Math.random() * products.length);
    const productId = products[randomIndex];
    console.log("UTIL - ", productId);
    return productId;
  }

  return Math.floor(Math.random() * 2000);
};
