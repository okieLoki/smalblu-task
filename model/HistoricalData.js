const mongoose = require('mongoose')

const historicalDataSchema = new mongoose.Schema({
    base: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('HistoricalData', historicalDataSchema)