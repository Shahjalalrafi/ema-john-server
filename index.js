const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const  app = express()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fltsf.mongodb.net/project2?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));    



app.get('/', (req, res) => {
    res.send('hello everyone, hi hi hey')
})




client.connect(err => {
  const collection = client.db("emaJohn").collection("product");
  const orderCollection = client.db("emaJohn").collection("order")

    app.post('/addProduct', ( req, res) => {
        console.log(req.body)
        const product = req.body
        collection.insertOne(product)
        .then(result => {
            res.send(result.insertedCount)
        })
    })
    
    app.get('/products', (req, res) => {
        collection.find({}).limit(20)
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:key', (req, res) => {
        collection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })

    app.post('/productkeys', (req, res) => {
        const productkey = req.body
        collection.find({key: {$in: productkey}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    app.post('/addOrder', ( req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

});



app.listen(5000, () => console.log('listening to port 5000'))