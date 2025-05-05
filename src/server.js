  const express = require('express');
  const ejs = require('ejs');
  const { MongoClient } = require('mongodb');
  const path = require('path');

  
  const app = express();
  const port = 3000;
  const uri = 'mongodb://mongo:27017';
  const client = new MongoClient(uri);

  const bodyParser = require('body-parser');

  app.use(bodyParser.json());

  let db;

  // Use express built-in middleware to parse incoming URL-encoded data (form submissions)
  app.use(express.urlencoded({ extended: true })); // <-- This is the key

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  //Creates the default home route
  app.get('/', async (req, res) => {
    try {
      await client.connect();

      db = client.db('mydb');
      
      const time = new Date();

      const submissions = await db.collection('submissions').find().toArray();

      //Get the users IP - I don't want to track visits from a user who has already visited...
      const ip = req.socket.remoteAddress || req.headers['x-forwarded-for'];

      //See if this ip has already loaded the page before, don't want to count this if so
      const ipAlreadyExists = await db.collection('visits').findOne({ip});

      if(ipAlreadyExists){

        res.render('existingMember', {submissions});
        return;
      
      }
        await db.collection('visits').insertOne({ time, ip });

        const visits = await db.collection('visits').find().toArray();
  
        res.render('newMember', {time, visits});
      

    } catch (err) {
      console.error(err);
      res.status(500).send('Something broke!');
    }
  });

  //Making the submit route
  app.get('/submit', async (req, res) => {
    res.render('existingMember', {submissions});
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });

  

  // Submit route - Handle name submission
app.post('/submit', async (req, res) => {
  try {

    const { name } = req.body;
    console.log("posted name:", name);

    // Convert the object to JSON format
    const data = await JSON.parse(JSON.stringify(req.body));

    data.name = name;

    await db.collection('submissions').insertOne(data);

    return;

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to process form submission' });
  }
});
