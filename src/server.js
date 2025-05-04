  const express = require('express');
  const ejs = require('ejs');
  const { MongoClient } = require('mongodb');
  const path = require('path');

  
  const app = express();
  const port = 3000;
  const uri = 'mongodb://mongo:27017';
  const client = new MongoClient(uri);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.get('/', async (req, res) => {
    try {
      await client.connect();

      const db = client.db('mydb');
      const time = new Date();

      //Get the users IP - I don't want to track visits from a user who has already visited...
      const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];

      await db.collection('visits').insertOne({ time, ip });

      const visits = await db.collection('visits').find().toArray();

      
    res.render('server', {time, visits});

    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
