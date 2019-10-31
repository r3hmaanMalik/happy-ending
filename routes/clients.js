const express = require('express');
const app = express.Router();
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");
const bookingQueue = require('../models/BookingQueue');
const Appointment = require('../models/Appointment');
const Attendant = require('../models/Attendant');
const Service = require('../models/Service');


//SignUp
app.post('/signup' , async(req , res) => {
    try{
        let client = await Client.findOne({email : req.body.email});
        if (client) return res.status(400).send('User already registered.');
        console.log(req.body);
        client = new Client(req.body);
        var result = await client.save();
        res.send(result);
    }catch(error){
        res.status(500).send("Internal Server Error");
    }
});


//Login
app.post('/login' , async(request , response) => {
    try {
        var find = await Client.findOne({
            'email': request.body.email
        }).exec();
        // console.log(find);
        if(find){
            bcrypt.compare(request.body.password, find.password, function (err, isMatch){
                if (err) return err;
                console.log(isMatch);
                if(isMatch){
                    console.log(isMatch);
                    const token = jwt.sign({
                        find
                    }, 'my_secret_key');
                    if (err){
                        throw err;
                    }
                    response.json({
                        id: find._id,
                        name: find.name,
                        email: find.email,
                        token: token
                    })
                }else{
                    response.json({
                        response: "Wrong Password"
                    });
                }
            });
        }else{
            response.json({
                response: "Email not exist"
            });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

//Get all services
app.get("/services", async (req, res) => {
    try {
        var result = await Service.find().exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});


//Booking Appointment
app.post('/booking', async(req,res) => {
    try {
        queue = new bookingQueue(req.body);
        var result = await queue.save();
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

//My Appointments History
app.post('/myhistory' , async(req,res) => {
    try {
        var result = await Appointment.find({clientID : req.body.clientID});
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

//Rate on appointment
app.post('/rateattendant', async(req,res) => {
    try {
        id = req.body.rateId;
        rating = req.body.rating;
        var result = await Attendant.findById(id).exec();
        if(result){
            var oldRating = result.rating;
            var rating = (oldRating + rating) / 2;
            var newVal = rating.toFixed(1);
            newvalues = { 
                $set: {
                    rating: newVal
                } 
            };
            Attendant.findByIdAndUpdate(
                id,
                newvalues,
                {new: true},
                (err, val) => {
                    if (err) return res.status(500).send(err);
                        res.send(val);
                });
        }    
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
    
});


//Get all Clients IDs
app.get('/all', async (req,res)=>{
    try {
        var result = await Client.find().exec();
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


//Get a specific client by ID
app.get('/:id', async (req,res)=>{
    try {
        var result = await Client.findById(req.params.id).exec();
        console.log(result);
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
    
});

//Delete a specific client by ID
app.get('/delete/:id' , async(req,res) => {
    try {
        var result = await Client.findByIdAndDelete(req.params.id).exec();
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
    
});

app.post("/forgetpassword", async (request, response) => {
    try {
        var email = request.body.email;
        var admin = await Client.findOne({
            'email': email
        }).exec();
        if (admin) {
            response.json({
                response: "Kindly check your email.Password is send to your given email address ( " + email + " )."
            });
        } else {
            response.json({
                response: "Email not register"
            });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = app;