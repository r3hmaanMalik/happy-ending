// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var serviceSchema = new Schema({
  name: String,
  attendentPrice: Number,
  clientPrice:Number,
  description: String,
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false // You should be aware of the outcome after set to false
});

// serviceSchema.pre('save', function (next) {
//   let now = Date.now();
//   console.log(now);
//   // Set a value for createdAt only if it is null
//   if (!this.created_at) {
//     this.created_at = now
//   }
//   // Call the next function in the pre-save chain
//   next()
// })

// the schema is useless so far
// we need to create a model using it
var Service = mongoose.model('Service', serviceSchema);

// make this available to our users in our Node applications
module.exports = Service;