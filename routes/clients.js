const express = require('express');
const app = express.Router();
const Client = require('../models/client');
const jwt = require('jsonwebtoken');
const BookingQueue = require('../models/bookingQueue');
const Appointment = require('../models/appointment');

//SignUp
app.post('/signup' , async(req , res) => {
    try{
        let client = await Client.findOne({email : req.body.email});
        if (client) return res.status(400).send('User already registered.');
        console.log(req.body);
        client = new Client(req.body);
        var result =await client.save();
        res.send(result);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
    
});


//Login
app.post('/login' , async(req , res) => {
    try {
        var find = await Client.findOne({
            'email': request.body.email
        }).exec();
        if (find) {
            bcrypt.compare(request.body.password, find.password, function (err, isMatch) {
                if (err) return err;
                if (isMatch) {
                    console.log(isMatch);
                    const token = jwt.sign({
                        find
                    }, 'my_secret_key');
                    if (err) {
                        throw err;
                    }
                    response.json({
                        id: find._id,
                        name: find.name,
                        email: find.email,
                        token: token
                    })
                } else {
                    response.json({
                        response: "Wrong Password"
                    });
                }
            });
        } else {
            response.json({
                response: "Email not exist"
            });
        }
    } catch (error) {
        response.status(500).send(error);
    }
});


//Booking Appointment
app.post('/booking', async(req,res) => {
    try {
        queue = new BookingQueue(req.body);
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