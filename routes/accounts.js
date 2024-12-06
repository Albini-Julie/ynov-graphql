const express = require('express')
const router = express.Router()
const modelAccount = require('../models/accounts')
const account = require('../models/accounts')


// Déclaration de ma route par défaut http://localhost:3000/api/items
router.get('/', async (req, res) => {
    const accounts = await modelAccount.find({})
    res.json(accounts)
})

router.post('/', async (req, res) => {
    const newAccount = new modelAccount({name: req.body.name})
    await newAccount.save()
    res.status(201).json(newAccount)
})

module.exports = router