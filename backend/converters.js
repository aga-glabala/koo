module.exports = {
  actionFromBson: function (action) {
    action.id = action._id;
    delete action._id;
    return action;
  },

  actionToBson: function (action) {
    if (action.id) {
      action._id = new mongo.ObjectID(action.id);
      delete action.id;
    }
    action.createdOn = new Date(action.createdOn).getTime();
    action.orderDate = new Date(action.orderDate).getTime();
    action.collectionDate = new Date(action.collectionDate).getTime();
    action.payDate = new Date(action.payDate).getTime();
    return action;
  },

  orderFromBson: function (order) {
    order.id = order._id;
    delete order._id;
    return order;
  },

  orderToBson: function (order) {
    if (order.id) {
      order._id = new mongo.ObjectID(actiorderon.id);
      delete order.id;
    }
    return order;
  },

  userFromBson: function (user) {
    user.id = user._id;
    delete user._id;
    return user;
  },

  userToBson: function (user) {
    if (user.id) {
      user._id = new mongo.ObjectID(user.id);
      delete user.id;
    }
    return user;
  }
};