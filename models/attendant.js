const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ServiceSchema = mongoose.model('Service').schema;

var attendantSchema = new Schema({

   name: String,
   description: String,
   services: [ServiceSchema],
   email: String,
   password: String,
   gender: String,
   balance: Number,
   rating: Number,
   Phone: Number,
   photo: String

});


const attendant = mongoose.model('attendant', attendantSchema);

module.exports = attendant;