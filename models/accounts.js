const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    nbAbonnes: {
        type: Number, 
        required: true
    },
    abonnes: {
        type: [], 
        required: true
    },
    nbAbonnements: {
        type: Number, 
        required: true
    },
    abonnements: {
        type: Array, 
        required: true
    },
    nbPosts: {
        type: Number, 
        required: true
    },
    posts: {
        type: Array, 
        required: true
    }
})

// MongoDB sait qu'il doit créer le nouvel item dans la collection du nom de cet item mais au pluriel : ici items
module.exports = mongoose.model('account', accountSchema)