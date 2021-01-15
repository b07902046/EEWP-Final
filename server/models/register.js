const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const RegisterSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username field is required.']
    },
    password: {
        type: String,
        required: [true, 'Password field is required.']
    }
})

// Creating a table within database with the defined schema
const Register = mongoose.model('register', RegisterSchema)

// Exporting table for querying and mutating
module.exports = Register
