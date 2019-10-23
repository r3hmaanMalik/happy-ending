const Service = require('../models/Service');
const Admin = require('../models/Admin');
const Withdraw = require('../models/withdrawl');

var bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const BodyParser = require("body-parser");
const express = require('express');
const app = express.Router();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

app.post("/service", async (request, response) => {
    try {
        var service = new Service(request.body);
        var result = await service.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/services", async (request, response) => {
    try {
        var result = await Service.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/deleteservice", async (request, response) => {
    try {
        var id = request.body.id;
        var service = await Service.findById(id);
        var result = await service.deleteOne();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



app.post("/add", async (request, response) => {
    try {
        var admin = new Admin(request.body);
        var result = await admin.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



app.post("/withdraw", async (request, response) => {
    try {
        var withdraw = new Withdraw(request.body);
        var result = await withdraw.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



app.post("/login", async (request, response) => {
    try {
        var find = await Admin.findOne({
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


app.post("/forgetpassword", async (request, response) => {
    try {
        var email = request.body.email;
        var admin = await Admin.findOne({
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