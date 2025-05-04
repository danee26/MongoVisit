const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const port = 6969;

const uri = 'mongodb://mongo:27017';

const client = new MongoClient(uri);

app.get('/', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('mydb');
    const time = new Date();
    await db.collection('visits').insertOne({ time });
    const visits = await db.collection('visits').find().toArray();
    res.send(`Visiaated at: ${time}<br>Total visits: ${visits.length}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something broke!');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
