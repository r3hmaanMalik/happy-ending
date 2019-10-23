// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;
// create a schema
var adminSchema = new Schema({
  name: String,
  email:{ type: String, required: true, index: { unique: true } },
  password:{ type: String, required: true }
});

adminSchema.pre('save', function (next) {
    var admin = this;
    // console.log(admin);
  // only hash the password if it has been modified (or is new)
  if (!admin.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      // hash the password along with our new salt
      bcrypt.hash(admin.password, salt, function(err, hash) {
          if (err) return next(err);
          admin.password = hash;
          console.log(admin.password);
          next();
      });
    });
  });

// the schema is useless so far
// we need to create a model using it
var Admin = mongoose.model('Admin', adminSchema);

// make this available to our users in our Node applications
module.exports = Admin;