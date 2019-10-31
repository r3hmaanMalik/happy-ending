const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const ServiceSchema = mongoose.model('Service').schema;
SALT_WORK_FACTOR = 10;

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
attendantSchema.pre('save', function (next) {
   var attendant = this;
 if (!attendant.isModified('password')) return next();
 // generate a salt
 bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
     if (err) return next(err);
     // hash the password along with our new salt
     bcrypt.hash(attendant.password, salt, function(err, hash) {
         if (err) return next(err);
         attendant.password = hash;
         console.log(attendant.password);
         next();
     });
   });
 });



const attendant = mongoose.model('Attendant', attendantSchema);

module.exports = attendant;