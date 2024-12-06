const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

// MongoDB sait qu'il doit créer le nouveau user dans la collection du nom de cet item mais au pluriel : ici users
module.exports = mongoose.model('User', userSchema)