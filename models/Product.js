const { getDatabase } = require('../database');

const COLLECTION_NAME = 'products';

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  async save() {
    const db = getDatabase();

    const existing = await db.collection(COLLECTION_NAME).findOne({ name: this.name });
    if (existing) {
      throw new Error(`Product '${this.name}' already exists.`);
    }

    await db.collection(COLLECTION_NAME).insertOne(this);
  }

  static async getAll() {
    const db = getDatabase();
    const products = await db.collection(COLLECTION_NAME).find().toArray();
    console.log('[DEBUG] Products from database:', products);
    return products;
  }

  static async findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name });
  }

  static async deleteByName(name) {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteOne({ name });
  }

  static async getLast() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
        .find()
        .sort({ _id: -1 })
        .limit(1)
        .toArray()
        .then(res => res[0]);
  }
}

module.exports = Product;
