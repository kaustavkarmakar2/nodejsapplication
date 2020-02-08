var express = require('express');
var path = require('path');
var router = express.Router();
var db=require("../modules/db")();

// var key = "JAICRYPTO-AES256"
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');



var logout = function() {
    return function (req, res, next) {
        req.logout();
        delete req.session;
        next();
    };
};
router.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    res.redirect('/');
  });
});//end logout

// router.post('/checklogin', expressJwt({secret:process.env.SECRET_KEY}),function(req,res){
//     res.send({login:true})
// });

  ////////////////////////////////api to login///////////
router.post('/login', function(req, res) {
    var appData = {};
    var email= req.body.email;
    var password_users = req.body.password_users;
    console.log("????????",req.body)
    var token = req.body.token;
    
        db.many("SELECT * FROM public.b2c_user WHERE email = '" + req.body.email + "' AND password_users = '" + req.body.password_users + "'", function(err, rows, fields) {
            console.log(">>>>>>>>>",rows)
            if (err) {
                appData.error = 1;
                appData["data"] = "Error Occured!";
                res.status(400).json({"error":1,"data":"error occurred"});
            }else{
                    //console.log("myconsole",rows[0].password_users ,password_users,rows[0].password_users == password_users)
                    if (rows.length > 0) {
                        if (rows[0].password_users == password_users) {
                            let obj = Object.assign({},rows[0])
                            let token = jwt.sign(obj, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });

                            console.log("------------------------------------------------->>>>>>",token);
                            appData.error = 0;
                            appData["token"] = token;
                            console.log("------------------------------------------------->>>>>>",appData);
                            res.status(200).json(appData);
                        }else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(204).json({"error":1,"data":"Email and Password does not match"});
                        }
                    }else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json({"error":1,"data":"Email does not exists"});
                    }
                }
        });
});

router.post('/signup', function(req, res) {
    let user={};
    let mailOptions = {};
    user.email=req.body.email;
    user.pass=req.body.password;
    user.fname=req.body.first_name;
    user.lname=req.body.last_name;
    user.phone=req.body.phone;
    user.vercode=Math.ceil(Math.random()*1000000);
    
    
    if(user.email != null && user.pass !=null && user.fname !=null && user.phone!=null && user.lname !=null){
        
        if(user.email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)&&user.pass.length>5&&user.fname.length>2&&user.lname.length>2){
            user.pass=require('crypto').createHash('md5').update(user.pass).digest("hex");
            db.tx(t=>{
                return t.one('SELECT * FROM public.user_auth WHERE email=${email};',{'email':user.email})
                .then(exists=>{
                    var ret={};
                    ret.status=2;
                    return ret;
                })
                .catch(error_min=>{
                    var ret={};                
                    return t.one('INSERT INTO public.user_details (first_name,last_name,email,phone) VALUES (${fname},${lname},${email},${phone}) RETURNING id;', user)
                    .then(user_res => {  
                        user.user_id=user_res.id;             
                        return t.one('INSERT INTO public.user_auth (user_id,first_name,last_name,email,password,phone,status,verification_code) VALUES (${user_id},${fname},${lname},${email},${pass},${phone},TRUE,${vercode}) RETURNING id;', user)
                        .then((result) => {
                            ret.status=1;
                            require('../modules/mail')(user.email,"<html><body><div><h1><text align='center'>Thank you for Signing Up at BillionSkills.com</text></h1><hr><h3>Your verification code is: <b>"+user.vercode+"</b></h3><h2>Please click <a href='"+encodeURI("http://org.billionskills.com/verify?email="+user.email+"&ver_code="+user.vercode)+"'>here</a> to complete your registration process.</h2><hr>","Complete your BillionSkills.com registration");
                            return ret;
                        })
                        .catch(error => {
                            console.log(error);
                            ret.status=0;
                            return ret;
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        ret.status=0;
                        return ret;
                    });
                })
            })
            .then(ret=>{
                res.status(200).send(ret);
                //TODO
                //mail(user.vercode,user.email);
                
            });        
        }
        else{
            res.status(400).send("names must be atleast 3 characters, email must be an email and password must be atleast 6 characters!");
        }
    }
    else{
        res.status(400).send("You must give email, first_name, phone, last_name and password fields!");
    }
});


// router.post('/login', function(req, res) {
//     let email=req.body.email;
//     let pass=req.body.password;
    
//     if(email != null && pass !=null){
//         if(email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)&&pass.length>5){
//             db.tx(t=>{
//                 return t.one('SELECT * FROM public.user_auth WHERE email=${email};',{'email':email})
//                 .then(exists=>{
//                     return t.one('SELECT id,user_id,first_name,last_name,phone,photo_sm,gender,status FROM public.user_auth WHERE email = ${email} AND password = ${pass};', {'email':email,'pass':require('crypto').createHash('md5').update(pass).digest("hex")})
//                     .then(ret => {
//                         if(ret.status){
//                             ret.status=1;
//                             var tokengen={};
//                             tokengen.user_id=ret.user_id;
//                             tokengen.ip=req.ip;
//                             tokengen.token=require('crypto').createHash('md5').update(Math.random()+" "+tokengen.ip).digest("hex");
//                             var comdate=new Date();
//                             tokengen.start_date=comdate.toISOString();
//                             comdate.setMinutes(comdate.getMinutes()+20);
//                             tokengen.end_date=comdate.toISOString();
                            
//                             return t.none('DELETE FROM public.b2c_password_token WHERE user_id=${user_id};',tokengen)
//                             .then(tokrres=>{
//                                 return t.one('INSERT INTO public.b2c_password_token(ip,auth_token,fromdate,todate,user_id) VALUES (${ip},${token},${start_date},${end_date},${user_id}) RETURNING id,auth_token;',tokengen)
//                                 .then(tokres=>{
//                                     ret.auth_token=tokres.auth_token;
//                                     ret.auth_id=tokres.id;
//                                     return ret;
//                                 })
//                                 .catch(error=>{
//                                     console.log(error);
//                                     return ret;
//                                 });
                                
//                             })
//                             .catch(error => {
//                                 console.log(error);
//                                 return ret;
//                             });
//                         }
//                         else{
//                             return {status:3};
//                         }
//                     })
//                     .catch(error => {
//                         console.log(error);
                        
//                         return {status:0};
//                     });
//                 })
//                 .catch(error=>{
//                     var ret={};
//                     console.log(error);
//                     ret.status=2;
//                     return ret;
//                 });
//             })
//             .then(ret=>{
//                 res.status(200).send(ret);
//             });        
//         }
//         else{
//             res.status(400).send("email field must be a valid email and password must be atleast 6 characters!");
//         }
//     }
//     else{
//         res.status(400).send("You must give email and password fields!");
//     }
// });


router.post('/regenerate_token', function(req, res) {
    if(req.headers['auth-token']&&req.headers['user-id']){
        var query={ip:req.ip,token:req.headers['auth-token'],date:new Date().toISOString(),user_id:req.headers['user-id']};
        db.one("SELECT * FROM public.b2c_password_token WHERE ip=${ip} AND user_id=${user_id} AND auth_token=${token};",query)
        .then(result=>{
            var tokengen={};
            tokengen.user_id=req.headers['user-id'];
            tokengen.ip=req.ip;
            tokengen.token=require('crypto').createHash('md5').update(Math.random()+" "+tokengen.ip).digest("hex");
            var comdate=new Date();
            tokengen.start_date=comdate.toISOString();
            comdate.setMinutes(comdate.getMinutes()+20);
            tokengen.end_date=comdate.toISOString();
            
            db.one('INSERT INTO public.b2c_password_token(ip,auth_token,fromdate,todate,user_id) VALUES (${ip},${token},${start_date},${end_date},${user_id}) RETURNING id,auth_token;',tokengen)
            .then(result2=>{
                res.status(200).send(result2);
            })
            .catch(error=>{
                console.log(error);
                res.sendStatus(500);
            });
        })
        .catch(error=>{
            console.log(error);
            res.status(401).send("Authentication failure!");
        });
    }
    else{
        res.status(401).send("Authentication token or User ID header is not found!");
    };
});


router.post('/verify_user', function(req, res) {
    let user={};
    user.email=req.body.email;
    user.vercode=req.body.verification_code;
    
    
    if(user.email != null && user.vercode !=null){
        if(user.email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)&&user.vercode.length==6){
            db.one('SELECT * FROM public.user_auth WHERE email=${email} AND verification_code=${vercode};',user)
            .then(exists=>{
                var ret={status:1};
                return db.none('UPDATE public.user_auth SET verification_status=TRUE WHERE id=${id};',{id:exists.id})
                .then(existsx=>{
                    ret.status=1;
                    return ret;
                })
                .catch(error=>{
                    console.log(error);
                    ret.status=0;
                    return ret;
                });
            })
            .catch(error_min=>{
                var ret={status:0};
                return ret;
            })
            .then(ret=>{
                res.status(200).send(ret);
            });        
        }
        else{
            res.status(400).send("email must be a registered email and verification_code must be atleast 6 characters!");
        }
    }
    else{
        res.status(400).send("You must give email, and verification_code fields!");
    }
});


router.post('/forgot_pass_send_otp', function(req, res) {
    let user={};
    user.email=req.body.email;
    
    if(user.email != null){
        if(user.email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)){
            db.one('SELECT user_id FROM public.user_auth WHERE email=${email};',user)
            .then(exists=>{
                return db.one('SELECT verification_code FROM public.b2c_verification_code WHERE user_id=${id} AND flag=false AND verification_type=${type};',{id:exists.user_id,type:'fpass'})
                .then(existsx=>{
                    return {status:1,verification_code:existsx.verification_code};
                })
                .catch(error=>{
                    console.log(error);
                    return db.one('INSERT INTO public.b2c_verification_code (user_id,verification_code,verification_type,flag) VALUES (${id},${vercode},${type},false) RETURNING verification_code;',{id:exists.user_id,vercode:Math.ceil(Math.random()*1000000),type:'fpass'})
                    .then(existsx=>{
                        return {status:1,verification_code:existsx.verification_code};
                    })
                    .catch(error=>{
                        console.log(error);
                        return {status:0};
                    });
                });
            })
            .catch(error=>{
                return {status:2};
            })
            .then(ret=>{
                
                if(ret.status==1)require('../modules/mail')(user.email,"<html><body><div><h1><text align='center'>Verification Code for Password Regeneration in BillionSkills.com</text></h1><hr><h3>Your verification code is: <b>"+ret.verification_code+"</b></h3><hr><center><b>Or,</b></center> <br/><h3>Please <a href='http://localhost/b2bfront/En/change_password/"+(Buffer.from(user.email).toString('base64'))+"/"+(Buffer.from(ret.verification_code).toString('base64'))+"'>Click here</a> to reset your password.</h3>","Restore your BillionSkills.com password.");
                res.status(200).send({status:ret.status});
            });        
        }
        else{
            res.status(400).send("email must be a valid email!");
        }
    }
    else{
        res.status(400).send("You must give email field!");
    }
});


router.post('/forgot_password', function(req, res) {
    let user={};
    user.email=req.body.email;
    user.vercode=req.body.verification_code;
    user.password=req.body.password;
    
    
    if(user.email != null && user.vercode !=null && user.password != null){
        if(user.email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)&&user.vercode.length==6&&user.password.length>5){
            user.password=require('crypto').createHash('md5').update(user.password).digest("hex");
            db.one('SELECT public.user_auth.user_id FROM public.b2c_verification_code,public.user_auth WHERE email=${email} AND flag=false AND verification_type=\'fpass\' AND public.b2c_verification_code.user_id=public.user_auth.user_id AND public.b2c_verification_code.verification_code=${vercode};',user)
            .then(exists=>{
                user.id=exists.user_id;
                return db.tx(t=>{
                    return t.multi('UPDATE public.user_auth SET password=${password} WHERE user_id=${id}; DELETE FROM public.password_token WHERE user_id=${id};',user)
                    .then(existsx=>{
                        return t.none('UPDATE public.b2c_verification_code SET flag=true WHERE user_id=${id} AND verification_code=${vercode};',user)
                        .then(existsx=>{
                            return {status:1};
                        })
                        .catch(error=>{
                            console.log(error);
                            return {status:0};
                        });
                    })
                    .catch(error=>{
                        console.log(error);
                        return {status:0};
                    });
                })
                .catch(error=>{
                    console.log(error);
                    
                    return {status:0};
                });
            })
            .catch(error_min=>{
                console.log(error_min);
                var ret={status:0};
                return ret;
            })
            .then(ret=>{
                res.status(200).send(ret);
            });        
        }
        else{
            res.status(400).send("email must be a registered email and verification_code and password must be atleast 6 characters! Sent data: email="+user.email+", verification_code="+user.vercode);
        }
    }
    else{
        res.status(400).send("You must give email, password and verification_code fields!");
    }
});

router.use(function (req, res, next) {
    if(req.headers['auth-token']&&req.headers['user-id']){
        var query={ip:req.ip,token:req.headers['auth-token'],date:new Date().toISOString(),user_id:req.headers['user-id']};
        db.one("SELECT * FROM public.b2c_password_token WHERE ip=${ip} AND user_id=${user_id} AND auth_token=${token} AND ${date} BETWEEN fromdate AND todate;",query)
        .then(result=>{
            next();
        })
        .catch(error=>{
            console.log(error);
            res.status(401).send("Authentication failure!");
        });
    }
    else{
        res.status(401).send("Authentication token or User ID header is not found!");
    };
});


router.post('/change_password', function(req, res) {
    let user={};
    user.id=req.headers['user-id'];
    user.new_password=req.body.new_password;
    user.password=req.body.password;
    
    
    if(user.id != null && user.password !=null&&user.new_password!=null){
        if(user.new_password.length>5&&user.password.length>5){
            user.new_password=require('crypto').createHash('md5').update(user.new_password).digest("hex");
            user.password=require('crypto').createHash('md5').update(user.password).digest("hex");
            db.multi('UPDATE public.user_auth SET password=${new_password} WHERE user_id=${id} AND password=${password}; DELETE FROM public.b2c_password_token WHERE user_id=${id};',user)
            .then(exists=>{
                return {status:1};
            })
            .catch(error_min=>{
                console.log(error_min);
                var ret={status:0};
                return ret;
            })
            .then(ret=>{
                res.status(200).send(ret);
            });        
        }
        else{
            res.status(400).send("password and new_password must be atleast 6 characters!");
        }
    }
    else{
        res.status(400).send("You must give password and new_password fields!");
    }
});


router.post('/select_user_details', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    
    if(query.user_id !=null){
        db.tx(t=>{
            return t.one('SELECT * FROM public.user_details WHERE id=${user_id};',query)
            .then(result=>{
                return t.oneOrNone('SELECT resume_url FROM b2c_user_resume WHERE user_id=${user_id} AND status=TRUE;'
                ,query)
                .then(result2=>{
                    if(result2!=null)result.resume_url=result2.resume_url;
                    else result.resume_url=null;
                    return result;
                    
                })
                .catch(error_min=>{
                    var ret={status:0};
                    console.log(error_min);
                    return ret;
                })
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        })
        .catch(error_min=>{
            console.log(error_min);
            res.status(500).send("internal error!");
        });        
        
    }
    else{
        res.status(400).send("user_id header is required!");
    }
});

// router.post('/subscribe_package', function(req, res) {
//     let org_p_map={};
//     org_p_map.package_id=req.body.package_id;
//     org_p_map.org_id=req.headers['org-id'];
//     org_p_map.amount=req.body.amount;
//     org_p_map.credit_limit=req.body.credit_limit;
//     org_p_map.status=req.body.status;
//     org_p_map.expire=req.body.expire;


//     if(org_p_map.package_id != null && org_p_map.org_id !=null&& org_p_map.amount !=null&& org_p_map.credit_limit !=null&& org_p_map.status !=null&& org_p_map.expire !=null){
//         db.none('INSERT INTO public.org_package_map (package_id,org_id,amount,credit_limit,status,expire,copyflag) VALUES (${package_id},${org_id},${amount},${credit_limit},${status},${expire},true);',org_p_map)
//         .then(exists=>{
//             var ret={status:1};
//             return ret;
//         })
//         .catch(error_min=>{
//             var ret={status:0};
//             console.log(error_min);
//             return ret;
//         })
//         .then(ret=>{
//             res.status(200).send(ret);
//         });        

//     }
//     else{
//         res.status(400).send("You must give package_id, status, expire, credit_limit and amount fields!");
//     }
// });

router.post('/update_user_detail', function(req, res) {
    let user={};
    user.id=req.headers['user-id'];
    user.field_name=req.body.field_name;
    user.field_data=req.body.field_data;    
    
    
    
    if(!['email'].includes(user.field_name) && user.id != null && user.field_data !=null&& user.field_name !=null){
        db.multi((['first_name','last_name','phone','photo_sm','gender'].includes(user.field_name)?'UPDATE public.user_auth SET '+user.field_name+'= ${field_data} WHERE user_id=${id} RETURNING id;':'')+'UPDATE public.user_details SET '+user.field_name+'= ${field_data} WHERE id=${id} RETURNING id;',user)
        .then(result=>{
            var ret={status:1};
            return ret;
        })
        .catch(error_min=>{
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(400).send("Please check the documentation for usage!");
    }
});



router.post('/dynamic_professional', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;  
    query.company=req.body.company;  
    query.designation_id=req.body.designation_id;  
    query.from=req.body.from;  
    query.to=req.body.to; 
    query.to=query.to?query.to:null;
    query.industry_id=req.body.industry_id;  
    query.website=req.body.website; 
    query.current_ctc=req.body.current_ctc;   
    query.notice_period=req.body.notice_period;  
    
    
    if(query.user_id!=null &&query.id!=null &&query.operation!=null &&query.company!=null &&query.designation_id!=null &&query.from!=null &&query.industry_id!=null &&query.website!=null &&query.current_ctc!=null &&query.notice_period!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_professional (user_id,company,designation_id,"from","to",industry_id,website,current_ctc,notice_period) VALUES (${user_id},${company},${designation_id},${from},${to},${industry_id},${website},${current_ctc},${notice_period}) RETURNING id':
        (query.operation==='update')?'UPDATE public.b2c_user_professional SET company=${company},designation_id=${designation_id},"from"=${from},"to"=${to},industry_id=${industry_id},website=${website},current_ctc=${current_ctc},notice_period=${notice_period} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_professional WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});


router.post('/professional', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null && query.user_id!=null){
        db.many('SELECT b2cup.id, b2cup.user_id, b2cup.company, desig.name as designation, b2cup.from, b2cup.to, ind.name as industry, b2cup.website, b2cup.current_ctc, b2cup.notice_period FROM b2c_user_professional b2cup LEFT JOIN designation desig ON desig.id = b2cup.designation_id LEFT JOIN industry ind ON ind.id = b2cup.industry_id WHERE b2cup.user_id = ${user_id} '+((query.id!=0)? 'AND b2cup.id = ${id}': '')+' ORDER BY b2cup.to DESC;',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});



router.post('/dynamic_academic', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;
    query.board=req.body.board;  
    query.organization=req.body.organization;  
    query.from=req.body.from;  
    query.to=req.body.to; 
    query.to=query.to?query.to:null;
    query.degree_id=req.body.degree_id;  
    query.stream_id=req.body.stream_id;  
    query.marks_per=req.body.marks_per; 
    
    if(query.user_id!=null &&query.id!=null &&query.operation!=null &&query.board!=null &&query.organization!=null &&query.from!=null &&query.degree_id!=null &&query.stream_id!=null &&query.marks_per!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_academic (user_id,board,organization,"from","to",degree_id,stream_id,marks_per) VALUES (${user_id},${board},${organization},${from},${to},${degree_id},${stream_id},${marks_per}) RETURNING id':
        (query.operation==='update')?'UPDATE public.b2c_user_academic SET board=${board},organization=${organization},"from"=${from},"to"=${to},degree_id=${degree_id},stream_id=${stream_id},marks_per=${marks_per} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_academic WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});


router.post('/update_skill', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.skill_ids=req.body.skill_id;  
    query.rank=0;
    
    if(query.user_id!=null &&query.rank!=null){
        query.skills_query='DELETE FROM public.b2c_user_skill WHERE user_id=${user_id} RETURNING id;';
        if(query.skill_ids!=null)
        query.skill_ids.forEach(element => {
            query.skills_query+='INSERT INTO public.b2c_user_skill (user_id,skill_id,rank) VALUES (${user_id},'+element+',${rank}) RETURNING id;';
        });
        
        console.log(query);
        
        db.tx(t=>{
            return t.multi(query.skills_query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});


router.post('/academic', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null&&query.user_id!=null){
        db.many('SELECT b2cua.id, b2cua.user_id, b2cua.board, b2cua.organization, dgr.degree_name, dgr.short, strm.title,  b2cua.from,  b2cua.to,  b2cua.marks_per FROM b2c_user_academic b2cua LEFT JOIN degree dgr ON dgr.id = b2cua.degree_id LEFT JOIN stream strm ON strm.id = b2cua.stream_id WHERE b2cua.user_id = ${user_id} '+((query.id!=0)? 'AND b2cua.id = ${id}': '')+' ORDER BY b2cua.to DESC;',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});

router.post('/user_skill', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    
    if(query.user_id!=null){
        db.manyOrNone('SELECT * FROM b2c_user_skill e1 INNER JOIN skills e2 ON (e2.id=e1.skill_id) WHERE e1.user_id=${user_id};',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});


router.post('/user_hobby', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    
    if(query.user_id!=null){
        db.manyOrNone('SELECT * FROM b2c_user_hobby e1 INNER JOIN hobby e2 ON (e2.id=e1.hobby_id) WHERE e1.user_id=${user_id};',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});



router.post('/update_hobby', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.hobby_ids=req.body.hobby_id;
    
    if(query.user_id!=null &&query.hobby_ids!=null){
        query.hobby_query='DELETE FROM public.b2c_user_hobby WHERE user_id=${user_id} RETURNING id;';
        if(query.hobby_ids!=null)
        query.hobby_ids.forEach(element => {
            query.hobby_query+='INSERT INTO public.b2c_user_hobby (user_id,hobby_id) VALUES (${user_id},'+element+') RETURNING id;';
        });
        
        console.log(query);
        
        db.tx(t=>{
            return t.multi(query.hobby_query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});


router.post('/resume_upload', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.resume_url=req.body.resume_url;
    query.file_name=req.body.file_name;
    
    if(query.user_id!=null &&query.resume_url!=null &&query.file_name!=null){
        query.query='UPDATE b2c_user_resume SET status=FALSE WHERE user_id=${user_id} RETURNING id;'+
        'INSERT INTO b2c_user_resume (resume_url,file_name,user_id,status) VALUES (${resume_url},${file_name},${user_id},TRUE) RETURNING id;';
        
        console.log(query);
        
        db.tx(t=>{
            return t.multi(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});




router.post('/dynamic_project', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.title=req.body.title;
    query.type=req.body.type;  
    query.client=req.body.client;  
    query.start_date=req.body.start_date;  
    query.end_date=req.body.end_date; 
    query.end_date=query.end_date?query.end_date:null;
    query.role=req.body.role;  
    query.detail=req.body.detail;  
    query.file_url=req.body.file_url; 
    query.operation=req.body.operation; 

    if(query.user_id!=null && query.id!=null && query.operation!=null && query.title!=null && query.type!=null 
        && query.client!=null && query.start_date!=null && query.role!=null && query.detail!=null && query.file_url!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_project (user_id,title,type,client,start_date,end_date,role,detail,file_url) VALUES (${user_id},${title},${type},${client},${start_date},${end_date},${role},${detail},${file_url}) RETURNING id;':
        (query.operation==='update')?'UPDATE public.b2c_user_project SET user_id=${user_id},title=${title},type=${type},client=${client},start_date=${start_date},end_date=${end_date},role=${role},detail=${detail},file_url=${file_url} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_project WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});



router.post('/project', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null&&query.user_id!=null){
        db.many('SELECT * FROM b2c_user_project e1 WHERE user_id=${user_id} '+(query.id!=0?' AND e1.id=${id}':'')+';',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});



router.post('/dynamic_publication', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.title=req.body.title;
    query.type=req.body.type;  
    query.client=req.body.client;  
    query.author=req.body.author;  
    query.publish_year=req.body.publish_year;
    query.catation=req.body.catation;  
    query.detail=req.body.detail;  
    query.file_url=req.body.file_url; 
    query.url=req.body.url; 
    query.version=req.body.version; 
    query.operation=req.body.operation; 
    
    if(query.user_id!=null &&query.id!=null &&query.operation!=null &&query.title!=null &&query.type!=null 
        &&query.client!=null &&query.author!=null &&query.publish_year!=null &&query.catation!=null 
        &&query.version!=null &&query.detail!=null &&query.file_url!=null &&query.url!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_publication (user_id,title,type,client,author,publish_year,catation,version,url,detail,file_url) VALUES (${user_id},${title},${type},${client},${author},${publish_year},${catation},${version},${url},${detail},${file_url}) RETURNING id;':
        (query.operation==='update')?'UPDATE public.b2c_user_publication SET user_id=${user_id},title=${title},type=${type},client=${client},author=${author},publish_year=${publish_year},catation=${catation},version=${version},url=${url},detail=${detail},file_url=${file_url} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_publication WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});



router.post('/publication', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null&&query.user_id!=null){
        db.many('SELECT * FROM b2c_user_publication e1 WHERE user_id=${user_id} '+(query.id!=0?' AND e1.id=${id}':'')+';',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});



router.post('/dynamic_research', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.title=req.body.title;
    query.detail=req.body.detail;  
    query.file_url=req.body.file_url; 
    query.operation=req.body.operation; 
    
    if(query.user_id!=null &&query.id!=null &&query.operation!=null &&query.title!=null 
        &&query.detail!=null &&query.file_url!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_research (user_id,title,detail,file_url) VALUES (${user_id},${title},${detail},${file_url}) RETURNING id;':
        (query.operation==='update')?'UPDATE public.b2c_user_research SET user_id=${user_id},title=${title},detail=${detail},file_url=${file_url} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_research WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});



router.post('/research', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null&&query.user_id!=null){
        db.many('SELECT * FROM b2c_user_research e1 WHERE user_id=${user_id} '+(query.id!=0?' AND e1.id=${id}':'')+';',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});



router.post('/dynamic_award', function(req, res) {
    let query={},query2={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.title=req.body.title;
    query.detail=req.body.detail;  
    query.file_url=req.body.file_url; 
    query.operation=req.body.operation; 
    
    if(query.user_id!=null &&query.id!=null &&query.operation!=null &&query.title!=null 
        &&query.detail!=null &&query.file_url!=null){
        
        query.query=(query.operation==='insert')?'INSERT INTO public.b2c_user_award (user_id,title,detail,file_url) VALUES (${user_id},${title},${detail},${file_url}) RETURNING id;':
        (query.operation==='update')?'UPDATE public.b2c_user_award SET user_id=${user_id},title=${title},detail=${detail},file_url=${file_url} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.b2c_user_award WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null)
        db.tx(t=>{
            return t.one(query.query,query)
            .then(result=>{
                result.status=1;
                return result;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            })
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
        else res.status(400).send("Operation not permitted.");
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});



router.post('/award', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;
    
    if(query.id !=null&&query.user_id!=null){
        db.many('SELECT * FROM b2c_user_award e1 WHERE user_id=${user_id} '+(query.id!=0?' AND e1.id=${id}':'')+';',query)
        .then(result=>{
            return result;
        })
        .catch(error_min=>{ 
            var ret={status:0};
            console.log(error_min);
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation for usage!");
    }
});


module.exports = router;
