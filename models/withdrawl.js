const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var withDrawlSchema = new Schema({

    withDrawl: Number,
    attendantID: mongoose.Schema.Types.ObjectId,
    date: {
        type : Date,
        default : Date.now()
    }

});

const Withdrawl = mongoose.model('Withdrawl',withDrawlSchema);
module.exports = Withdrawl;