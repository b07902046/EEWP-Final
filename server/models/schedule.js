const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ScheduleSchema = new Schema({
    user: {
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
    color: {
        type: String,
        required: [true, "Color field is required."]
    },
    title: {
        type: String,
        required: [true, "Title field is required."]
    },
    content: {
        type: String,
        required: false
    }
})

// Creating a table within database with the defined schema
const Schedule = mongoose.model('schedule', ScheduleSchema)

// Exporting table for querying and mutating
module.exports = Schedule
