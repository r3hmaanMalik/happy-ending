const admin = require('./routes/admins');
const clients = require('./routes/clients');
const attendants = require('./routes/attendants')


const mongoose = require('mongoose');
const express = require('express');
const BodyParser = require('body-parser');

const app = express();
app.use(BodyParser.json());


//app.use(express.json());
app.use('/api/v1/admin', admin);
app.use('/api/v1/clients', clients);
app.use('/api/v1/attendants/', attendants);

mongoose.connect('mongodb://localhost:27017/massage', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.log("Could not connect to MongoDB"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));