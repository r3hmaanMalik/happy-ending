const mongoose = require('mongoose');

const queueSchema = {
    serviceID : mongoose.Schema.Types.ObjectId,
    clientID : mongoose.Schema.Types.ObjectId,
    accepted : Boolean
}

const BookingQueue = mongoose.model('BookingQueue' , queueSchema);

module.exports = BookingQueue;