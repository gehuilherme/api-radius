const express = require('express')
const cors = require('cors')
const redis = require('redis');
const cache = redis.createClient();

require('dotenv').config()

const router = require('./src/routes/routes')

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

app.get('/',(req, res) => {
    res.send("Ok!")
})

cache.on('connect', () => {
   console.log('REDIS READY');
});
    
cache.on('error', (e) => {
    console.log('REDIS ERROR', e);
});

app.listen(process.env.PORT, () => {
    console.log('App running on port: ' + process.env.PORT)
})