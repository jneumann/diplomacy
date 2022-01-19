var obj = [];

obj.getAll = async () => {
    const db = await require('./db')()

    return await db.collection('seasons').aggregate([
        { $sort: {start: 1} }
    ]).toArray()
}

obj.add = async (body) => {
    const db = await require('./db')()

    body.start = new Date(body.start).toISOString();
    body.end = new Date(body.end).toISOString();

    db.collection('seasons').insertOne(body);
}

module.exports = obj;