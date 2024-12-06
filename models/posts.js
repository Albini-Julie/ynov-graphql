const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    author: {
        type: Number,
        required: true
    },
    nbLikes: {
        type: Number, 
        required: true
    },
    likes: {
        type: Array, 
        required: true
    },
    nbComments: {
        type: Number, 
        required: true
    },
    comments: {
        type: Array, 
        required: true
    },
})

// MongoDB sait qu'il doit créer le nouvel item dans la collection du nom de cet item mais au pluriel : ici items
module.exports = mongoose.model('post', postSchema)