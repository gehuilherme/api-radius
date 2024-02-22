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

const startup = async () => {
    cache.connect()
    app.listen(process.env.PORT, () => {
        console.log('App running on port: ' + process.env.PORT)
    })
}