const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: Number,
        required: true
    },
})

// MongoDB sait qu'il doit créer le nouvel item dans la collection du nom de cet item mais au pluriel : ici items
module.exports = mongoose.model('comment', commentSchema)