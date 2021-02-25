module.exports = {
  calcSum: function (action, order) {
    let sumOrder = 0;
    action.products.forEach((product) => {
      sumOrder += order.products[product.id] * product.price;
    });
    if (action.discount) {
      sumOrder -= sumOrder * action.discount / 100
    }
    return sumOrder;
  }
};
