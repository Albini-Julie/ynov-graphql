const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
})

// MongoDB sait qu'il doit créer le nouvel item dans la collection du nom de cet item mais au pluriel : ici items
module.exports = mongoose.model('Post', postSchema)