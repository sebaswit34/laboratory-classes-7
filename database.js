const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');


if (!DB_USER || !DB_PASS) {
    console.error('ERROR: Missing database credentials!');
    console.error('Please provide DB_USER and DB_PASS in config.js');
    process.exit(1);
}

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.wkiftrn.mongodb.net/shop?retryWrites=true&w=majority`;

let database;

async function mongoConnect(callback) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Database connection has been established.');
        database = client.db('shop');
        callback();
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

function getDatabase() {
    if (!database) {
        throw new Error('No database found.');
    }
    return database;
}

module.exports = {
    mongoConnect,
    getDatabase
};