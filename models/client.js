const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
SALT_WORK_FACTOR = 10;

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    email: {
        type: String,
        requried: true,
        unique: true
    },
    password: {
        type: String,
        requried: true
    },
    phoneNumber: {
        type: Number,
        requried: true
    }
});

clientSchema.pre('save', function (next) {
    var client = this;
    // console.log(admin);
    // only hash the password if it has been modified (or is new)
    if (!client.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(client.password, salt, function (err, hash) {
            if (err) return next(err);
            client.password = hash;
            // console.log(client.password);
            next();
        });
    });
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;