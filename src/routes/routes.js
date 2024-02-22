const connection = require('../database/connection')
const express = require('express')
const router = express.Router()
const FindController = require('../controllers/FindController')

router.post('/', FindController.findUserData)

module.exports = router