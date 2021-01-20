const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const VoteSchema = new Schema({
    user: {
        type: String,
        required: [true, 'User field is required.']
    },
    hash: {
        type: String,
        required: [true, 'Hash field is required.']
    },
    starts: {
        type: [Date],
        required: [true, 'Starts field is required.']
    },
    ends: {
        type: [Date],
        required: [true, 'Ends filed is required.']
    }
})

// Creating a table within database with the defined schema
const Vote = mongoose.model('vote', VoteSchema)

// Exporting table for querying and mutating

module.exports = Vote
