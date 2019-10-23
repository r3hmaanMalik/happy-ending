const express = require('express');
const app = express.Router();
const Client = require('../models/client');
const BookingQueue = require('../models/bookingQueue');
const Appointment = require('../models/appointment');


//testing
app.get('/', async(req,res) => {
    res.send("Working");
});


//SignUp
app.post('/signup' , async(req , res) => {
    let client = await Client.findOne({email : req.body.email});
    if (client) return res.status(400).send('User already registered.');
    console.log(req.body);
    client = new Client(req.body);
    var result =await client.save();
    res.send(result)
});


//Login
app.post('/login' , async(req , res) => {
    
    let client = await Client.findOne({email : req.body.email});
    if (!client) return res.status(404).send('User not found.');

    //implement authentication here
    client = new Client({
        email : req.body.email,
        password : req.body.password
    });

    res.send(client);
});


//Booking Appointment
app.post('/booking', async(req,res) => {
    queue = new BookingQueue(req.body);
    var result = await queue.save();
    res.send(result);
});

//My Appointments History
app.post('/myhistory' , async(req,res) => {
    var result = await Appointment.find({clientID : req.body.clientID});
    res.send(result);
})


//Get all Clients IDs
app.get('/all', async (req,res)=>{
    var result = await Client.find().exec()
    res.send(result)
});


//Get a specific client by ID
app.get('/:id', async (req,res)=>{
    var result = await Client.findById(req.params.id).exec()
    console.log(result)
    res.send(result)
});

//Delete a specific client by ID
app.get('/delete/:id' , async(req,res) => {
    var result = await Client.findByIdAndDelete(req.params.id).exec();
    res.send(result);
})

module.exports = app;