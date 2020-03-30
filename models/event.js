const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    creator: {
        _id: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Event', eventSchema)