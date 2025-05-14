const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = 'carts';

class Cart {
  static async add(userId, productName) {
    const db = getDatabase();

    const product = await Product.findByName(productName);
    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const cart = await db.collection(COLLECTION_NAME).findOne({ userId });

    if (!cart) {
      await db.collection(COLLECTION_NAME).insertOne({
        userId,
        items: [{ name: product.name, price: product.price, quantity: 1 }]
      });
    } else {
      const existing = cart.items.find(item => item.name === product.name);

      if (existing) {
        await db.collection(COLLECTION_NAME).updateOne(
            { userId, "items.name": product.name },
            { $inc: { "items.$.quantity": 1 } }
        );
      } else {
        await db.collection(COLLECTION_NAME).updateOne(
            { userId },
            { $push: { items: { name: product.name, price: product.price, quantity: 1 } } }
        );
      }
    }
  }

  static async getItems(userId) {
    const db = getDatabase();
    const cart = await db.collection(COLLECTION_NAME).findOne({ userId });
    return cart?.items || [];
  }

  static async getProductsQuantity(userId) {
    const items = await this.getItems(userId);
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice(userId) {
    const items = await this.getItems(userId);
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  static async clearCart(userId) {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).updateOne(
        { userId },
        { $set: { items: [] } }
    );
  }
}

module.exports = Cart;
