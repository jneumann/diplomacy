const MongoClient = require('mongodb').MongoClient,
    dotenv = require('dotenv')

dotenv.config()

module.exports = async function () {
    const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}`;
    const client = new MongoClient(url);
    
    await client.connect();

    return client.db('diplomacy')
}