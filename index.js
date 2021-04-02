const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxarj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const courseCollection = client.db("coursePlaza").collection("courses");
  const orderCollection = client.db("coursePlaza").collection("orderList");
 
  app.get("/courses", (req, res) => {
      courseCollection.find()
      .toArray((err, items) => {
          res.send(items)          
      })
  })

  app.get("/course/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    courseCollection.find({_id: id})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.get("/orders", (req, res) => {
    const id = ObjectID(req.params.id);
    orderCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })


  app.post('/upload', (req, res) => {      
      const newCourse = req.body;
      console.log('adding new: ', newCourse);
      courseCollection.insertOne(newCourse)
      .then(result => {
          console.log('count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/checkout', (req, res) => {      
      const newCourse = req.body;
      console.log('adding new: ', newCourse);
      orderCollection.insertOne(newCourse)
      .then(result => {
          console.log('count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    courseCollection.findOneAndDelete({_id: id})
    .then(result => console.log('deleted successfully'))
  })
  
//   client.close();
});



app.listen(process.env.PORT || port)