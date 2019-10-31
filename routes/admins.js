const Service = require('../models/Service');
const Admin = require('../models/Admin');
const Attendant = require('../models/Attendant');
const Withdraw = require('../models/Withdrawl');

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

// app.post("/deleteservice", async (request, response) => {
//     try{
//         var serv = [];
//         var id = request.body.id;
//         // console.log(id);
//         var find = await Attendant.findOne({'s_id': id}).exec();
//         // console.log(find.services);
//         if(find){
//         find.services.forEach(async element => {
//             if(element._id != "5db03475716c0c13a8869585"){
//                 serv.push(element);
//             }
//         });
//         newvalues = { 
//             $set: {
//                 services: serv
//             } 
//         };
//         find.updateOne(
//             id,
//             newvalues,
//             {new: true},
//             (err, val) => {
//                 if (err) return res.status(500).send(err);
//                         var service = Service.findById(id);
//                         var result = service.deleteOne();
//                     response.json({
//                         response: "Your service has been deleted"
//                     });
//             });
//         }
//         else{
//             // var service = Service.findById(id);
//             // var result = service.deleteOne();
//             response.json({
//                 response: "Else: Your service has been deleted"
//             });
//         }
//         // response.send(find);
//     }catch(error){
//         response.status(500).send(error);
//     }
// });



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
        var attendentId = request.body.attendantID;
        var withdrawAmount = request.body.withDrawl;

        var find = await Attendant.findOne({'_id': attendentId}).exec();
        var maxBalance = find.balance;
        if(maxBalance >= withdrawAmount){
            var remainingBalance = maxBalance - withdrawAmount;
            newvalues = { 
                $set: {
                    balance: remainingBalance
                } 
            };
            Attendant.findByIdAndUpdate(
                attendentId,
                newvalues,
                {new: true},
                (err, val) => {
                    if (err) return res.status(500).send(err);
                        var withdraw = new Withdraw(request.body);
                        var resultVal = withdraw.save();
                        // response.send(resultVal);
                        response.json({
                            response: "Your withdrawls amount is = "+withdrawAmount
                        });
                });
        }
        else{
            response.json({
                response: "Your balance is not enough for withdrawls"
            });
        }
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