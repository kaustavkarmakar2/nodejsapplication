const b2c_user = require('../../models').b2c_user;
const envelope = require('../../utils/envelopes');
const config = require('../../config/config.js');
const jwt = require("jsonwebtoken");
var express = require('express');
const session = require('express-session');

const users = express.Router();
const bcrypt = require('bcrypt');
process.env.SECRET_KEY = 'secret';
module.exports={
  signup(req,res){
      const userData ={
          first_name:req.body.first_name,
          last_name:req.body.last_name,
          email:req.body.email,
          password_users:req.body.password_users,
          phone:req.body.phone
      }
      console.log(userData.email,"bbbbbb");
      var email = req.body.email;
      return b2c_user.findOne({ 

          where: {
            email: req.body.email
          }       
            
      })      
     
      .then(users => {
        if(!users){
          const hash = bcrypt.hashSync(userData.password_users,10);
          userData.password_users=hash;
          b2c_user.create(userData)
            .then(b2c_users =>{
              
                let token= jwt.sign(b2c_users.dataValues, process.env.SECRET_KEY, {
                  expiresIn : 60*60*24
                });
                res.json({token:token,status:1})
            })
            .catch(err =>{
              res.send('error:'+err)

            })
        }else{
            res.json({error:'users already exists'})

          }
      })
      .catch(err =>{
        res.send('eror:'+err)
      })
      
  },
  login(req,res){
    var sess = req.session;
    sess.email = req.body.email;
   
    sess.pass = req.body.password_users;
    console.log(">>>>>",sess.pass);
    return b2c_user.findOne({ 

      where: {
        email: req.body.email,
       
      }       
        
    })  
    .then(user =>{
      console.log('Users',user);
      if(bcrypt.compareSync(req.body.password_users,user.password_users)){
        console.log('>>>>>>>>>>>>>>>>>>>>>',req.body.password_users);
        let token = jwt.sign(user.dataValues,process.env.SECRET_KEY,{
          expiresIn:1440
        })
        res.json({token:token,status:1})
      }
      else if(!bcrypt.compareSync(req.body.password_users,user.password_users)){
        res.json({token:'',status:2})
      }
      
      else{
        res.json({token:'',status:3})
      }
    }) 
    .catch(err =>{
      res.send('error'+err)
    })   
  }
}
