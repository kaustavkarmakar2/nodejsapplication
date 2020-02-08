var express = require('express');
var app = express.Router();
var b2c_user_academic = require('./../server/controller/b2c_user_academic');
var b2c_user = require('./../server/controller/b2c_user_login');
var b2c_user_profile = require('./../server/controller/b2c_user_profile');
var b2c_user_award = require('./../server/controller/b2c_user_award');
var b2c_user_project = require('./../server/controller/b2c_user_project');
var b2c_user_publication = require('./../server/controller/b2c_user_publication');
var b2c_user_research = require('./../server/controller/b2c_user_research');
var b2c_user_verfication = require('./../server/controller/VerificationController');
var b2c_user_email_verify = require('./../server/controller/signupController');
var bodyParser = require('body-parser');
var session = require('express-session');

// app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
// app.use(bodyParser.json());      
// app.use(bodyParser.urlencoded({extended: true}));






app.delete('/users/research/delete',b2c_user_research.deleteb2cuserresearch);
app.put('/users/research/edit',b2c_user_research.editb2cuserresearch);
app.post('/users/research/add',b2c_user_research.addb2cuserresearch);
app.get('/users/:id/research',b2c_user_research.getallb2cuserresearch);
app.delete('/users/publication/delete',b2c_user_publication.deleteb2cuserpublication);
app.put('/users/publication/edit',b2c_user_publication.editb2cuserpublication);
app.post('/users/publication/add',b2c_user_publication.addb2cuserpublication);
app.get('/users/:id/publication',b2c_user_publication.getallb2cuserpublication);
app.delete('/users/project/delete',b2c_user_project.deleteb2cuserproject);
app.put('/users/project/edit',b2c_user_project.editb2cuserproject);
app.post('/users/projects/add',b2c_user_project.addb2cuserproject);
app.get('/users/:id/projects',b2c_user_project.getallb2cuserproject);
app.delete('/users/awards/delete',b2c_user_award.deleteb2cuseraward);
app.put('/users/awards/edit',b2c_user_award.editb2cuseraward);
app.post('/users/awards/add',b2c_user_award.addb2cuseraward);
app.get('/users/:id/awards',b2c_user_award.getallb2cuseraward);
app.get('/users/:id/academics',b2c_user_academic.getallb2cuseracademic);
app.delete('/users/profile/delete',b2c_user_profile.deleteb2cuserprofile);
app.put('/users/profile/edit',b2c_user_profile.editb2cuserprofile);
app.post('/users/profile/add',b2c_user_profile.addb2cuserprofile);
app.get('/users/:id/profile',b2c_user_profile.getallb2cuserprofile);
app.post('/login',b2c_user.login);
app.post('/signup',b2c_user.signup);
app.post('/verification', b2c_user_verfication.VerificationController);
app.post('/signupemail',b2c_user_email_verify.SignUpController);
app.post('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });

});
module.exports=app;


