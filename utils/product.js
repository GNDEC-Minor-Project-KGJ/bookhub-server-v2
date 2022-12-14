module.exports.getRandomProduct = (products) => {
  const randomIndex = Math.floor(Math.random() * products.length);
  const productId = products[randomIndex];
  console.log(productId);
  return productId;
};
