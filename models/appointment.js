const mongoose = require('mongoose');

const appointmentSchema = {
    clientID : mongoose.Schema.Types.ObjectId,
    attendantID : mongoose.Schema.Types.ObjectId,
    serviceID : mongoose.Schema.Types.ObjectId,
    date : {
        type : Date,
        default : Date.now()
    },
    status : Boolean,
    rating : Number
};

const Appointment = mongoose.model('Appointment' , appointmentSchema);

module.exports = Appointment;