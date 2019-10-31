var Attendant = require("../models/Attendant");
const Withdraw = require('../models/Withdrawl');
const bookingQueue = require('../models/BookingQueue');
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");
const express = require('express');
var app = express.Router();


//SignUp
app.post('/signup' , async(req , res) => {
    try{
        // console.log(req.body);
        // res.send(req.body);
        let attendant = await Attendant.findOne({email : req.body.email});
        if (attendant) return res.status(400).send('User already registered.');
        console.log(req.body);
        attendant = new Attendant(req.body);
        var result = await attendant.save();
        res.send(result);
    }catch(error){
        res.status(500).send("Internal Server Error");
    }
});

app.post('/login', async (req, res) => {
    try {
        var find = await Attendant.findOne({
            'email': req.body.email
        }).exec();
        if (find) {
            bcrypt.compare(req.body.password, find.password, function (err, isMatch) {
                if (err) return err;
                if (isMatch) {
                    console.log(isMatch);
                    const token = jwt.sign({
                        find
                    }, 'my_secret_key');
                    if (err) {
                        throw err;
                    }
                    res.json({
                        id: find._id,
                        name: find.name,
                        email: find.email,
                        token: token
                    })
                } else {
                    res.json({
                        res: "Wrong Password"
                    });
                }
            });
        } else {
            res.json({
                res: "Email not exist"
            });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/all', async (req, res) => {
    try{
    let user = await Attendant.find().select({
        password: 0,

    });
    res.send(user);
    }
    catch(err)
    {
        res.send(err);
    }
});

app.get('/getbookings' , async(req, res) => {
    try {
        var result = await bookingQueue.find();
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.post('/bookappointment', async(req, res) => {
    try {
        var result = await bookingQueue.findById(req.body.appointmentID);
        if(result)
        {
            result.attendantID = req.body.attendantID;
            result.accepted = true;
            console.log(result);
            result = await result.save();
        }
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.get('/mywithdrawls', async (req, res) => {
    try{
    let result = await Withdraw.find({
        'attendantID': req.body.attendantID
    }).exec();
    res.send(result);
    }
    catch(err)
    {
        res.send(err);
    }
});

app.get('/:id', async (req, res) => {
    try{

    let user = await Attendant.findById(req.params.id).exec();
    res.send(user);
    }
    catch(err)
    {
        res.send(err);
    }
});

// app.get('/mywithdrawls', async (req, res) => {

//     // let result = await Withdraw.find().exec();
//     res.send("result");
// });




module.exports = app;