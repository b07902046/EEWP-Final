const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ElectionSchema = new Schema({
    eventStarter:{
        type: String,
        required: [true, "User field is required."]
    },
    start: {
        type: Date,
        required: [true, "Start field is required."]
    },
    end: {
        type: Date,
        required: [true, "End field is required."]
    },
    expectedInterval: {
        type: Number,
        required: [true, "Interval field is required."]
    },
    color: {
        type: String,
        required: [true, "Color field is required."]
    },
    title:{
        type:String,
        required: [true, "Title field is required."]
    },
    content: {
        type: String,
        required: false
    },
    finalStart:{
        type: Date,
        required: false
    },
    finalEnd:{
        type: Date,
        required: false
    },
    hash:{
        type: String,
        required: [true, "Hash field is required"]
    },
    users:[{type:String}]

})

// Creating a table within database with the defined schema
const Schedule = mongoose.model('election', ElectionSchema)

// Exporting table for querying and mutating
module.exports = Schedule

