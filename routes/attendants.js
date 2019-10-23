var Attendant = require("../models/attendant");
const Withdraw = require('../models/withdrawl');
const bodyParser = require('body-parser');
const express = require('express');
var app = express.Router();
app.use(bodyParser.json());


app.post('/signup', async (req, res) => {
    var attendant = new Attendant(req.body)
    var result = await attendant.save();
    console.log(attendant);
    res.send(result)
});

app.post('/login', async (req, res) => {

    let user = await Attendant.findOne({
        email: req.body.email
    }).exec();

    if (!user) {
        res.send("user not found");
    }
    res.send(user);

})

app.get('/all', async (req, res) => {

    let user = await Attendant.find().select({
        password: 0,

    });
    res.send(user);
});

app.get('/test', async (req, res) => {
    res.send("result");
});

app.get('/mywithdrawls', async (req, res) => {

    let result = await Withdraw.find({
        'attendantID': req.body.attendantID
    }).exec();
    res.send(result);
});

app.get('/:id', async (req, res) => {

    let user = await Attendant.findById(req.params.id).exec();
    res.send(user);
});

// app.get('/mywithdrawls', async (req, res) => {

//     // let result = await Withdraw.find().exec();
//     res.send("result");
// });




module.exports = app;