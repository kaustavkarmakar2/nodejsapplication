var express = require('express');
var router = express.Router();
var db=require("../modules/db")();

router.post('/signup', function(req, res) {
    let user={};
    user.email=req.body.email;
    user.pass=req.body.password;
    user.name=req.body.name;
    user.phone=req.body.phone;
    user.vercode=Math.ceil(Math.random()*1000000);
    user.photo_sm='abcd';
    user.photo_lg='abcd';
    
    let org={};
    org.name=req.body.organization_name;
    org.logo='abcd';
    
    
    if(user.email != null && user.pass !=null && user.name !=null && user.phone!=null && org.name !=null){
        // db.tx(t=>{
        //     return t.one('SELECT * FROM public.user_b2b WHERE email=${email};',{'email':user.email})
        //     .then(exists=>{
        //         var ret={};
        //         ret.status=2;
        //         return ret;
        //     })
        //     .catch(error_min=>{
        //         var ret={};                
        //         return t.one('INSERT INTO public.user_b2b (name,email,password,phone,photo_sm,photo_lg,status,verification_code) VALUES (${name},${email},${pass},${phone},${photo_sm},${photo_lg},\'active\',${vercode}) RETURNING id;', user)
        //         .then(user_res => {
        //             ret.status=1;
        //             return 
        //     })
        // })
        db.one('INSERT INTO public.organization (name,logo,status) VALUES (${name},${logo}, false) RETURNING id;', org)
         .then(org_res => {
            ret.status=1;
            return t.one('INSERT INTO public.org_users_connect (org_id,user_id,module_id,designation_id) VALUES (${org},${user},1,1) RETURNING id;', {org:org_res.id,user:user_res.id})
            .then(resx => {
                ret.status=1;
                require('../modules/mail')(user.email,"<html><body style='text-align: -webkit-center; font-size: 15px; font-family: sans-serif; font-weight: bold;'><div style='margin-top: 5%;'><img src='http://billionskills.com/assets/images/logo.png' style='width: 10%;'><p style='margin-top: 0; word-spacing: 5px;'>Welcome to Billionskils.com</p><p style='line-height: 35px; word-spacing: 5px;'>Thank you for choosing us.</p><p style='line-height: 35px; word-spacing: 5px;'>Your verification code is "+user.vercode+". You are just a step ahead</p><p style='line-height: 35px; word-spacing: 5px;'>Please <a href='"+encodeURI("http://org.billionskills.com/verify?email="+user.email+"&ver_code="+user.vercode)+"' target='_blank'>click here</a> to complete your Resgistration Process</p></div></body></html>","Complete your BillionSkills.com registration");
                //require('../modules/mail')(user.email,"<html><body><div><h1><text align='center'>Thank you for Signing Up at BillionSkills.com</text></h1><hr><h3>Your verification code is: <b>"+user.vercode+"</b></h3><h2>Please click <a href='"+encodeURI("http://org.billionskills.com/verify?email="+user.email+"&ver_code="+user.vercode)+"'>here</a> to complete your registration process.</h2><hr>","Complete your BillionSkills.com registration");
                return ret;
            })
            .catch(error => {
                console.log('a');
                console.log(error);
                ret.status=0;
                return ret;
            })
            ;
        })
        .catch(error => {
            console.log('b');
            console.log(error);
            ret.status=0;
            return ret;
        })
        .then(ret=>{
            res.status(200).send(ret);
            //TODO
            //mail(user.vercode,user.email);
            
        });        
    }
    else{
        res.status(400).send("You must give email, name, phone, organization_name and password fields!");
    }
});


router.post('/login', function(req, res) {
    let email=req.body.email;
    let pass=req.body.password;
    
    if(email != null && pass !=null){
        db.tx(t=>{
            return t.one('SELECT * FROM public.user_b2b WHERE email=${email};',{'email':email})
            .then(exists=>{
                var ret={};
                return t.one('SELECT id,status,name,photo_sm,verification_status,verification_code FROM public.user_b2b WHERE email = ${email} AND password = ${pass};', {'email':email,'pass':pass})
                .then(user => {
                    ret.status=1;
                    ret.name=user.name;
                    ret.user_id=user.id;
                    ret.photo_sm=user.photo_sm;
                    ret.verification_status=user.verification_status;
                    return t.one('SELECT org_id,module_id,status FROM public.org_users_connect WHERE user_id=${user_sl} AND status=true;', {'user_sl':user.id})
                    .then(org_connect => {
                        ret.org_users_connect_status=org_connect.status;
                        ret.org_id=org_connect.org_id;
                        return t.multi('SELECT name,logo FROM public.organization WHERE id=${o_id};SELECT module_name FROM public.org_module WHERE id=${m_id};', {'o_id':org_connect.org_id,'m_id':org_connect.module_id})
                        .then(data => {
                            //console.log(data);
                            ret.organization_name=data[0][0].name;
                            ret.organization_logo=data[0][0].logo;
                            ret.org_module_name=data[1][0].module_name;
                            
                            var tokengen={};
                            tokengen.user_id=user.id;
                            tokengen.ip=req.ip;
                            tokengen.token=require('crypto').createHash('md5').update(Math.random()+" "+tokengen.ip).digest("hex");
                            var comdate=new Date();
                            tokengen.start_date=comdate.toISOString();
                            comdate.setMinutes(comdate.getMinutes()+20);
                            tokengen.end_date=comdate.toISOString();
                            tokengen.org_id=org_connect.org_id;
                            
                            return t.none('DELETE FROM public.password_token WHERE user_id=${user_id} AND org_id=${org_id};',tokengen)
                            .then(tokrres=>{
                                return t.one('INSERT INTO public.password_token(ip,auth_token,fromdate,todate,user_id,org_id) VALUES (${ip},${token},${start_date},${end_date},${user_id},${org_id}) RETURNING id,auth_token;',tokengen)
                                .then(tokres=>{
                                    ret.auth_token=tokres.auth_token;
                                    ret.auth_id=tokres.id;
                                    return ret;
                                })
                                .catch(error=>{
                                    console.log(error);
                                    return ret;
                                });
                            })
                            .catch(error=>{
                                console.log(error);
                                return ret;
                            });
                            
                        })
                        .catch(error => {
                            console.log(error);
                            return ret;
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        return ret;
                    });
                })
                .catch(error => {
                    ret.status=0;
                    return ret;
                });
            })
            .catch(error=>{
                var ret={};
                ret.status=2;
                return ret;
            });
        })
        .then(ret=>{
            res.status(200).send(ret);
        });   
    }
    else{
        res.status(400).send("You must give email and password fields!");
    }
});


router.post('/regenerate_token', function(req, res) {
    if(req.headers['auth-token']&&req.headers['user-id']&&req.headers['org-id']){
        var query={ip:req.ip,token:req.headers['auth-token'],date:new Date().toISOString(),user_id:req.headers['user-id'],org_id:req.headers['org-id']};
        db.one("SELECT * FROM public.password_token WHERE ip=${ip} AND user_id=${user_id} AND auth_token=${token} AND org_id=${org_id};",query)
        .then(result=>{
            var tokengen={};
            tokengen.user_id=req.headers['user-id'];
            tokengen.ip=req.ip;
            tokengen.token=require('crypto').createHash('md5').update(Math.random()+" "+tokengen.ip).digest("hex");
            var comdate=new Date();
            tokengen.start_date=comdate.toISOString();
            comdate.setMinutes(comdate.getMinutes()+20);
            tokengen.end_date=comdate.toISOString();
            tokengen.org_id=req.headers['org-id'];
            
            db.one('INSERT INTO public.password_token(ip,auth_token,fromdate,todate,user_id,org_id) VALUES (${ip},${token},${start_date},${end_date},${user_id},${org_id}) RETURNING id,auth_token;',tokengen)
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
        res.status(401).send("Authentication token, User ID or Organization ID header is not found!");
    };
});


router.post('/verify_user', function(req, res) {
    let user={};
    user.email=req.body.email;
    user.vercode=req.body.verification_code;
    
    
    if(user.email != null && user.vercode !=null){
        if(user.email.match(/^[^0-9][_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)&&user.vercode.length==6){
            db.one('SELECT * FROM public.user_b2b WHERE email=${email} AND verification_code=${vercode};',user)
            .then(exists=>{
                var ret={status:1};
                return db.none('UPDATE public.user_b2b SET verification_status=TRUE WHERE id=${id};',{id:exists.id})
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
            db.one('SELECT id FROM public.user_b2b WHERE email=${email};',user)
            .then(exists=>{
                return db.one('SELECT verification_code FROM public.verification_code WHERE user_id=${id} AND flag=false AND verification_type=${type};',{id:exists.id,type:'fpass'})
                .then(existsx=>{
                    return {status:1,verification_code:existsx.verification_code};
                })
                .catch(error=>{
                    console.log(error);
                    return db.one('INSERT INTO public.verification_code (user_id,verification_code,verification_type,flag) VALUES (${id},${vercode},${type},false) RETURNING verification_code;',{id:exists.id,vercode:Math.ceil(Math.random()*1000000),type:'fpass'})
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
            db.one('SELECT user_id FROM public.verification_code,public.user_b2b WHERE email=${email} AND flag=false AND verification_type=\'fpass\' AND user_id=public.user_b2b.id AND public.verification_code.verification_code=${vercode};',user)
            .then(exists=>{
                user.id=exists.user_id;
                return db.tx(t=>{
                    return t.multi('UPDATE public.user_b2b SET password=${password} WHERE id=${id}; DELETE FROM public.password_token WHERE user_id=${id};',user)
                    .then(existsx=>{
                        return t.none('UPDATE public.verification_code SET flag=true WHERE user_id=${id} AND verification_code=${vercode};',user)
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
    if(req.headers['auth-token']&&req.headers['user-id']&&req.headers['org-id']){
        var query={ip:req.ip,token:req.headers['auth-token'],date:new Date().toISOString(),user_id:req.headers['user-id'],org_id:req.headers['org-id']};
        db.one("SELECT * FROM public.password_token WHERE ip=${ip} AND user_id=${user_id} AND auth_token=${token} AND org_id=${org_id} AND ${date} BETWEEN fromdate AND todate;",query)
        .then(result=>{
            next();
        })
        .catch(error=>{
            console.log(error);
            res.status(401).send("Authentication failure!");
        });
    }
    else{
        res.status(401).send("Authentication token, User ID or Organization ID header is not found!");
    };
});


router.post('/change_password', function(req, res) {
    let user={};
    user.id=req.headers['user-id'];
    user.new_password=req.body.new_password;
    user.password=req.body.password;
    
    
    if(user.id != null && user.password !=null&&user.new_password!=null){
        if(user.new_password.length>5&&user.password.length>5){
            db.multi('UPDATE public.user_b2b SET password=${new_password} WHERE id=${id} AND password=${password}; DELETE FROM public.password_token WHERE user_id=${id};',user)
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

router.post('/subscribe_package', function(req, res) {
    let org_p_map={};
    org_p_map.package_id=req.body.package_id;
    org_p_map.org_id=req.headers['org-id'];
    org_p_map.amount=req.body.amount;
    org_p_map.credit_limit=req.body.credit_limit;
    org_p_map.status=req.body.status;
    org_p_map.expire=req.body.expire;
    
    
    if(org_p_map.package_id != null && org_p_map.org_id !=null&& org_p_map.amount !=null&& org_p_map.credit_limit !=null&& org_p_map.status !=null&& org_p_map.expire !=null){
        db.none('INSERT INTO public.org_package_map (package_id,org_id,amount,credit_limit,status,expire,copyflag) VALUES (${package_id},${org_id},${amount},${credit_limit},${status},${expire},true);',org_p_map)
        .then(exists=>{
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
        res.status(400).send("You must give package_id, status, expire, credit_limit and amount fields!");
    }
});

router.post('/update_user_detail', function(req, res) {
    let user={};
    user.id=req.headers['user-id'];
    user.field_name=req.body.field_name;
    user.field_data=req.body.field_data;    
    
    if(user.id != null && user.field_data !=null&& user.field_name !=null){
        db.one('UPDATE public.user_b2b SET '+user.field_name+'= ${field_data} WHERE id=${id} RETURNING id;',user)
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
        res.status(400).send("You must give field_name and field_data fields!");
    }
});


router.post('/update_organization_detail', function(req, res) {
    let user={},org={};
    user.id=req.headers['user-id'];
    org.id=req.headers['org-id'];
    org.field_name=req.body.field_name;
    org.field_data=req.body.field_data;    
    
    if(user.id != null && org.field_data !=null&& org.field_name !=null && org.id!=null){
        db.one('SELECT status FROM public.org_users_connect WHERE org_sl=${org_id} AND user_sl=${user_id} AND status=TRUE;',{org_id:org.id,user_id:user.id})
        .then(result=>{
            return db.one('UPDATE public.organization SET '+org.field_name+'= ${field_data} WHERE id=${id} RETURNING id;',org)
            .then(result=>{
                var ret={status:1};
                return ret;
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            });
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
        res.status(400).send("You must give field_name and field_data fields!");
    }
});

router.post('/create_group', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    query.org_id=req.headers['org-id'];
    query.name=req.body.name;  
    
    if(query.user_id != null && query.org_id !=null&& query.name !=null){
        db.one('INSERT INTO public.candidates_groups (org_id,user_id,name,status) VALUES (${org_id},${user_id},${name},true) RETURNING id,status;',query)
        .then(result=>{
            return {id:result.id,status:result.status};
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
        res.status(400).send("You must give name field!");
    }
});

router.post('/all_group', function(req, res) {
    let query={};
    query.org_id=req.headers['org-id'];
    
    if(query.org_id !=null){
        db.many('SELECT id,name,status, (SELECT COUNT(*) AS can_count FROM public.can_group_map WHERE group_id=public.candidates_groups.id) FROM public.candidates_groups WHERE org_id=${org_id};',query)
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
        res.status(500).send("Internal error!");
    }
});

router.post('/modify_group', function(req, res) {
    let query={};
    query.group_id=req.body.group_id;
    query.org_id=req.headers['org-id'];
    query.name=req.body.name;  
    
    if(query.group_id != null && query.org_id !=null&& query.name !=null){
        db.one('UPDATE public.candidates_groups SET name=${name} WHERE id=${group_id} AND org_id=${org_id} RETURNING id;',query)
        .then(result=>{
            return {id:result.id,status:1};
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
        res.status(400).send("You must give group_id and name fields!");
    }
});

router.post('/select_group_candidate', function(req, res) {
    let query={};
    query.group_id=req.body.group_id;
    query.org_id=req.headers['org-id'];
    
    if(query.org_id !=null&&query.group_id !=null){
        db.many('select e2.*, (select count(*) as group_count from can_group_map where group_id <> e1.group_id and can_id = e1.can_id) from can_group_map e1, candidate_details e2,candidates_groups e3 where e1.can_id = e2.id and e1.group_id=e3.id and e3.org_id=${org_id}'+((query.group_id!='0')?' and e1.group_id = ${group_id};':';'),query)
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
        res.status(500).send("group_id field is required!");
    }
});


router.post('/insert_candidate', function(req, res) {
    let query={},query2={};
    query.org_id=req.headers['org-id'];
    query.user_id=req.body.user_id;  
    query.f_name=req.body.first_name;  
    query.l_name=req.body.last_name;  
    query.gender=req.body.gender;  
    query.email=req.body.email;  
    query.phone=req.body.phone; 
    query2.group_id=(req.body.group_id!=null?req.body.group_id:0);   
    query.is_pooled=(req.body.is_pooled!=null?true:false);  
    
    if(query.user_id != null && query.org_id !=null&& query.f_name !=null&& query.l_name !=null&& query.gender !=null&& query.email !=null&& query.phone !=null){
        db.tx(t=>{
            return t.one('INSERT INTO public.candidate_details (org_id,user_id,first_name,last_name,gender,email,phone,is_pooled) VALUES (${org_id},${user_id},${f_name},${l_name},${gender},${email},${phone},${is_pooled}) RETURNING id;',query)
            .then(result=>{
                if(query2.group_id!=0){
                    query2.can_id=result.id;
                    return t.one('INSERT INTO public.can_group_map(group_id,can_id) VALUES (${group_id},${can_id}) RETURNING id;',query2)
                    .then(result2=>{
                        return {can_group_map_id:result2.id,can_id:result.id,status:1};
                    })
                    .catch(error_min=>{
                        var ret={status:0};
                        console.log(error_min);
                        return ret;
                    });
                }
                else return {status:1,can_id:result.id};
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
        res.status(400).send("You must give org_id,user_id,first_name,last_name,gender,email,phone fields! Optional fields are group_id and is_pooled.");
    }
});


router.post('/update_candidate', function(req, res) {
    let query={};
    query.can_id=req.body.candidate_id;
    query.org_id=req.headers['org-id'];
    query.field_name=req.body.field_name;
    query.field_data=req.body.field_data;    
    
    if(query.can_id != null && query.org_id !=null&& query.field_name !=null && query.field_data!=null){
        db.one('UPDATE public.candidate_details SET "'+query.field_name+'"= ${field_data} WHERE id=${can_id} AND org_id=${org_id} RETURNING id;',query)
        .then(result=>{
            return {can_id:result.id,status:1};
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
        res.status(400).send("You must give candidate_id, field_name and field_data fields!");
    }
});


router.post('/import_candidate_group', function(req, res) {
    let query={};
    query.can_id=req.body.candidate_id;
    query.org_id=req.headers['org-id'];
    query.group_id=req.body.group_id;
    
    if(query.can_id != null && query.group_id !=null){

        db.one('INSERT INTO public.can_group_map(group_id,can_id) SELECT ${group_id},${can_id} WHERE NOT EXISTS( SELECT id FROM public.can_group_map WHERE group_id=${group_id} AND can_id=${can_id} ) RETURNING id;',query)
        .then(result=>{
            return {id:result.id,status:1};
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
        res.status(400).send("You must give candidate_id and group_id fields!");
    }
});


router.post('/dynamic_professional', function(req, res) {
    let query={},query2={};
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;  
    query.can_id=req.body.can_id;  
    query.company=req.body.company;  
    query.designation_id=req.body.designation_id;  
    query.from=req.body.from;  
    query.to=req.body.to; 
    query.industry_id=req.body.industry_id;  
    query.website=req.body.website; 
    query.current_ctc=req.body.current_ctc;   
    query.notice_period=req.body.notice_period;  
    
    if(query.org_id!=null &&query.user_id!=null &&query.id!=null &&query.operation!=null &&query.can_id!=null &&query.company!=null &&query.designation_id!=null &&query.from!=null &&query.to!=null &&query.industry_id!=null &&query.website!=null &&query.current_ctc!=null &&query.notice_period!=null){

        query.query=(query.operation==='insert')?'INSERT INTO public.candidate_professional (can_id,company,designation_id,"from","to",industry_id,website,current_ctc,notice_period) VALUES (${can_id},${company},${designation_id},${from},${to},${industry_id},${website},${current_ctc},${notice_period}) RETURNING id':
        (query.operation==='update')?'UPDATE public.candidate_professional SET can_id=${can_id},company=${company},designation_id=${designation_id},"from"=${from},"to"=${to},industry_id=${industry_id},website=${website},current_ctc=${current_ctc},notice_period=${notice_period} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.candidate_professional WHERE id=${id} RETURNING id;':
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


router.post('/dynamic_professional_select', function(req, res) {
    let query={};
    query.id=req.body.id;
    query.can_id=req.body.can_id;
    
    if(query.id !=null&&query.can_id !=null){
        db.many('SELECT * FROM public.candidate_professional WHERE can_id=${can_id}'+((query.id!='0')?' AND id = ${id};':';'),query)
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
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;  
    query.can_id=req.body.can_id;  
    query.board=req.body.board;  
    query.organization=req.body.organization;  
    query.from=req.body.from;  
    query.to=req.body.to; 
    query.degree_id=req.body.degree_id;  
    query.stream_id=req.body.stream_id;  
    query.marks_per=req.body.marks_per; 
    
    if(query.org_id!=null &&query.user_id!=null &&query.id!=null &&query.operation!=null &&query.can_id!=null &&query.board!=null &&query.organization!=null &&query.from!=null &&query.to!=null &&query.degree_id!=null &&query.stream_id!=null &&query.marks_per!=null){

        query.query=(query.operation==='insert')?'INSERT INTO public.candidate_academic (can_id,board,organization,"from","to",degree_id,stream_id,marks_per) VALUES (${can_id},${board},${organization},${from},${to},${degree_id},${stream_id},${marks_per}) RETURNING id':
        (query.operation==='update')?'UPDATE public.candidate_academic SET can_id=${can_id},board=${board},organization=${organization},"from"=${from},"to"=${to},degree_id=${degree_id},stream_id=${stream_id},marks_per=${marks_per} WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.candidate_academic WHERE id=${id} RETURNING id;':
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


router.post('/dynamic_academic_select', function(req, res) {
    let query={};
    query.id=req.body.id;
    query.can_id=req.body.can_id;
    
    if(query.id !=null&&query.can_id !=null){
        db.many('SELECT * FROM public.candidate_academic WHERE can_id=${can_id}'+((query.id!='0')?' AND id = ${id};':';'),query)
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


router.post('/select_job', function(req, res) {
    let query={};
    query.org_id=req.headers['org-id'];
    query.id=req.body.id;
    
    if(query.org_id !=null && query.id!=null){
        db.many('SELECT * FROM public.jobs WHERE org_id=${org_id} '+((query.id==='0')?';':' AND id=${id};'),query)
        .then(result=>{
            var skills_queries='',count_queries='';
            result.forEach(job=>{
                skills_queries+='SELECT name FROM jobs_skills,skills WHERE jobs_id='+job.id+' AND skills_id=skills.id;';
                count_queries+='SELECT count(*) FROM jobs_apply WHERE jobs_id='+job.id+';';
            });
            
            return db.multi(skills_queries+count_queries)
            .then(result2=>{
                for(i=0;i<result.length;i++){
                    result[i].skills=Array();
                    result2[i].forEach(skill=>{
                        result[i].skills.push(skill.name);
                    })
                    result[i].count=result2[result.length+i][0].count;
                }
                return result;
                
            })
            .catch(error_min=>{
                var ret={status:0};
                console.log(error_min);
                return ret;
            });
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


router.post('/insert_job', function(req, res) {
    let jobs={};
    jobs.org_id=req.headers['org-id'];
    jobs.user_id=req.headers['user-id'];
    jobs.title=req.body.title;  
    jobs.desc=req.body.desc;  
    jobs.location_id=req.body.location_id;  
    jobs.type=req.body.type;  
    jobs.salary=req.body.salary;  
    jobs.designation_id=req.body.designation_id;  
    jobs.experience =req.body.experience;  
    jobs.min_qualification_id=req.body.min_qualification_id;  
    jobs.external_link=req.body.external_link;  
    jobs.candidate_group_id=req.body.candidate_group_id;  
    jobs.report_email=req.body.report_email;  
    jobs.response_flag=req.body.response_flag;  
    jobs.file=req.body.file;  
    jobs.cutoff_marks=req.body.cutoff_marks;  
    jobs.start_time=req.body.start_time;  
    jobs.end_time=req.body.end_time;  
    jobs.skills=req.body.skills;  
    
    if(jobs.org_id !=null&& jobs.user_id !=null&& jobs.title !=null&& jobs.desc !=null&&jobs.location_id !=null&& jobs.type !=null&& jobs.salary !=null&& jobs.designation_id !=null&& jobs.experience  !=null&&jobs.min_qualification_id !=null&&jobs.external_link !=null&&jobs.candidate_group_id !=null&& jobs.report_email !=null&& jobs.response_flag !=null&& jobs.file !=null&& jobs.cutoff_marks !=null&& jobs.start_time !=null&& jobs.end_time !=null&&jobs.skills !=null){
        jobs.skills_query='';
        jobs.skills.forEach(element => {
            jobs.skills_query+='INSERT INTO public.jobs_skills(jobs_id,skills_id) VALUES (${jobs_sl},'+element+');';
        });
        db.tx(t=>{
            return t.one('INSERT INTO public.jobs (org_id,user_id,title,"desc",location_id,type,salary,designation_id,experience,min_qualification_id,external_link,candidate_group_id,report_email,response_flag,file,cutoff_marks,start_time,end_time) VALUES (${org_id},${user_id},${title},${desc},${location_id},${type},${salary},${designation_id},${experience},${min_qualification_id},${external_link},${candidate_group_id},${report_email},${response_flag},${file},${cutoff_marks},${start_time},${end_time}) RETURNING id;',jobs)
            .then(result=>{
                return t.multi(jobs.skills_query,{jobs_sl:result.id})
                .then(result2=>{
                    result.status=1;
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
        });   
        
    }
    else{
        res.status(400).send("Please check the documentation for usage!");
    }
});


router.post('/modify_job', function(req, res) {
    let query={};
    query.job_id=req.body.job_id;
    query.org_id=req.headers['org-id'];
    query.field_name=req.body.field_name;
    query.field_data=req.body.field_data;    
    
    if(query.job_id != null && query.org_id !=null&& query.field_name !=null && query.field_data!=null){
        db.one('UPDATE public.jobs SET "'+query.field_name+'"= ${field_data} WHERE id=${job_id} AND org_id=${org_id} RETURNING id;',query)
        .then(result=>{
            return {job_id:result.id,status:1};
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
        res.status(400).send("You must give job_id, field_name and field_data fields!");
    }
});


router.post('/change_job_status', function(req, res) {
    let query={};
    query.job_id=req.body.job_id;
    query.org_id=req.headers['org-id'];
    query.status=req.body.response_flag;
    query.start_time=req.body.start_time;  
    query.end_time=req.body.end_time;    
    
    if(query.job_id != null && query.org_id !=null&& query.status !=null && query.start_time!=null && query.end_time!=null){
        db.one('UPDATE public.jobs SET response_flag= ${status},start_time= ${start_time},end_time= ${end_time} WHERE id=${job_id} AND org_id=${org_id} RETURNING id;',query)
        .then(result=>{
            return {job_id:result.id,status:1};
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

router.post('/select_candidate', function(req, res) {
    let query={};
    query.can_id=req.body.candidate_id;
    query.org_id=req.headers['org-id'];
    
    if(query.org_id !=null&&query.can_id !=null){
        db.one('select *, (select count(*) as group_count from can_group_map where can_id = ${can_id}) from candidate_details where id=${can_id} and org_id=${org_id}',query)
        .then(result=>{
            return db.many('select candidates_groups.name from candidates_groups, can_group_map where candidates_groups.id = can_group_map.group_id and can_group_map.can_id = ${can_id};',query)
            .then(result2=>{
                result.group_names=[];
                result2.forEach(element => {
                    result.group_names.push(element.name);
                });
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
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("candidate_id field is required!");
    }
});


router.post('/select_user', function(req, res) {
    let query={};
    query.user_id=req.headers['user-id'];
    
    if(query.user_id !=null){
        db.one('SELECT email,name,phone,address,photo_sm,photo_lg,designation_id,city_id,status,verification_status FROM public.user_b2b WHERE id=${user_id};',query)
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
        res.status(500).send("candidate_id field is required!");
    }
});


router.post('/dynamic_questionbank', function(req, res) {
    let query={},query2={};
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;  
    query.name=req.body.name;  
    query.archive_status=req.body.archive_status;  
    query.cat_id=req.body.cat_id;  
    query.explicit_logic=req.body.explicit_logic;  
    query.admin_flag=req.body.admin_flag; 
    query.type_id=req.body.type_id;  
    
    if(query.org_id!=null &&query.user_id!=null &&query.id!=null &&query.operation!=null &&query.name!=null &&query.archive_status!=null &&query.cat_id!=null &&query.explicit_logic!=null &&query.admin_flag!=null &&query.type_id!=null){

        query.query=(query.operation==='insert')?'INSERT INTO public.question_bank (user_id,org_id,name,archive_status,explicit_logic,admin_flag,type_id,modified_date_time,create_date_time) VALUES (${user_id},${org_id},${name},${archive_status},${explicit_logic},${admin_flag},${type_id},now(),now()) RETURNING id;':
        (query.operation==='update')?'UPDATE public.question_bank SET user_id=${user_id},org_id=${org_id},name=${name},archive_status=${archive_status},explicit_logic=${explicit_logic},admin_flag=${admin_flag},type_id=${type_id},modified_date_time=now() WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.question_bank WHERE id=${id} RETURNING id;':
        null;
        query.query2='';
        if(query.query!=null){
            if(query.operation==='delete'||query.operation==='update')
                query.query2+='DELETE FROM public.category_qb_map WHERE qb_id=${id};';
            if(query.operation==='insert'||query.operation==='update'){
                query.cat_id.forEach(cat_id => {
                    query.query2+='INSERT INTO public.category_qb_map(cat_id,qb_id,create_date_time,modified_date_time) VALUES ('+cat_id+',${id},now(),now());';
                });
            }
            
            db.tx(t=>{
                return t.one(query.query,query)
                .then(result=>{
                    query.id=result.id;
                    return t.multi(query.query2,query)
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
        else res.status(400).send("Operation not permitted.");
        
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});


router.post('/view_questionbank', function(req, res) {
    let query={};
    query.id=req.body.id;
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    
    if(query.org_id !=null&&query.id !=null&&query.user_id !=null){
        db.many('select e1.*, e2.type_name from question_bank e1 JOIN type e2 ON e1.type_id=e2.id WHERE e1.org_id=${org_id} AND e1.user_id=${user_id}'+(query.id=='0'?";":"AND e1.id=${id};"),query)
        .then(result=>{
            query.query='';
            result.forEach(element=>{
                query.query+="SELECT e2.id,e2.name FROM category_qb_map e1 LEFT JOIN qb_category e2 ON e1.cat_id = e2.id WHERE e1.qb_id='"+element.id+"';";
                
                query.query+="SELECT COUNT(*) FROM questions_qb_map e1 WHERE e1.qb_id='"+element.id+"';";
            })
            return db.multi(query.query,query)
            .then(result2=>{
                let count=0;
                result2.forEach(element => {
                    //result[count++].category = element;
                    console.log(relult.length);
                    // if(count==1)result[count++].category=element;
                    // else result[count++].total_questions=element;
                    //console.log(element[0].count);
                });
                console.log(result);
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
        .then(ret=>{
            res.status(200).send(ret);
        });        
        
    }
    else{
        res.status(500).send("Please check the documentation!");
    }
});


router.post('/operate_category', function(req, res) {
    let query={},query2={};
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    query.id=req.body.id;  
    query.operation=req.body.operation;  
    query.name=req.body.name;  
    query.archive_status=req.body.archive_status;
    
    if(query.org_id!=null &&query.user_id!=null &&query.id!=null &&query.operation!=null &&query.name!=null &&query.archive_status!=null){

        query.query=(query.operation==='insert')?'INSERT INTO public.qb_category (user_id,org_id,name,archive_status,modified_date_time,create_date_time) VALUES (${user_id},${org_id},${name},${archive_status},now(),now()) RETURNING id;':
        (query.operation==='update')?'UPDATE public.qb_category SET user_id=${user_id},org_id=${org_id},name=${name},archive_status=${archive_status},modified_date_time=now() WHERE id=${id} RETURNING id;':
        (query.operation==='delete')?'DELETE FROM public.qb_category WHERE id=${id} RETURNING id;':
        null;
        
        if(query.query!=null){

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
        }
        else res.status(400).send("Operation not permitted.");
        
        
    }
    else{
        res.status(400).send("Please check the documentation for usage.");
    }
});

router.post('/view_question', (req, res)=>{
    let query = {};
    query.ques_id = req.body.ques_id;
    query.qb_id = req.body.qb_id;

    if(query.qb_id != null){
        db.any('SELECT q.id,q.type_id,q.difficulty_level,q.weightage,q.marks,q.used,q.body,q.archive_status,q.cal_logic,q.hint,q.status,qb.name,qqm.qb_id,qqm.status FROM public.questions q INNER JOIN public.questions_qb_map qqm ON qqm.ques_id = q.id INNER JOIN public.question_bank qb ON qb.id = qqm.qb_id WHERE qqm.ques_id = ${ques_id}'+(query.qb_id===0? ';':' AND qqm.qb_id = ${qb_id};'),query)
        .then(question=>{
        res.status(200).send(question);
        })
        .catch(error=>{
        console.log(error);
        res.status(401).send("Question Not Found!");
        })
    }else{
        res.status(401).send("Question Id Missing...");
    }
});

router.post('/view_category', function(req, res) {
    let query={};
    query.id=req.body.id;
    query.org_id=req.headers['org-id'];
    query.user_id=req.headers['user-id'];
    
    if(query.org_id !=null&&query.id !=null&&query.user_id !=null){
        db.many('select id,name,archive_status from public.qb_category e1 WHERE e1.org_id=${org_id} AND e1.user_id=${user_id}'+(query.id==='0'?";":"AND e1.id=${id};"),query)
        .then(result=>{
            result.status=1;
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
        res.status(500).send("Please check the documentation!");
    }
});


// router.post('/dynamic_questionbank', function(req, res) {
//     let query={},query2={};
//     query.org_id=req.headers['org-id'];
//     query.user_id=req.headers['user-id'];
//     query.id=req.body.id;  
//     query.type_id=req.body.type_id;  
//     query.difficulty_level=req.body.difficulty_level;  
//     query.weightage=req.body.weightage;  
//     query.marks=req.body.marks;  
//     query.used=req.body.used;  
//     query.body=req.body.body;  
//     query.archive_status=req.body.archive_status;  
//     query.cal_logic=req.body.cal_logic;  
//     query.hint=req.body.hint;  
//     query.tolerance=req.body.tolerance;  
//     query.status=req.body.status;  
//     query.operation=req.body.operation;  
//     query.qb_id=req.body.qb_id;  
//     query.qb_map_status=req.body.qb_map_status;  
//     query.options_array=req.body.options_array;  
    
//     if(query.org_id!=null &&query.user_id!=null &&query.id!=null &&query.type_id!=null &&query.difficulty_level!=null &&query.weightage!=null &&query.marks!=null &&query.used!=null &&query.body!=null &&query.archive_status!=null &&query.cal_logic!=null &&query.hint!=null &&query.tolerance!=null &&query.status!=null &&query.operation!=null &&query.qb_id!=null &&query.qb_map_status!=null &&query.options_array!=null ){

//         query.query=(query.operation==='insert')?'INSERT INTO public.questions (user_id,org_id,type_id,difficulty_level,weightage,marks,used,body,archive_status,cal_logic,hint,tolerance,status,modified_date_time,create_date_time) VALUES (${user_id},${org_id},${type_id},${difficulty_level},${weightage},${marks},${used},${body},${archive_status},${cal_logic},${hint},${tolerance},${status},now(),now()) RETURNING id;':
//         (query.operation==='update')?'UPDATE public.questions SET user_id=${user_id},org_id=${org_id},type_id=${type_id},difficulty_level=${difficulty_level},weightage=${weightage},marks=${marks},used=${used},body=${body},archive_status=${archive_status},cal_logic=${cal_logic},hint=${hint},tolerance=${tolerance},status=${status},modified_date_time=now() WHERE id=${id} RETURNING id;':
//         (query.operation==='delete')?'DELETE FROM public.questions WHERE id=${id} RETURNING id;':
//         null;
//         query.query2='';
//         if(query.query!=null){
//             if(query.operation==='delete'||query.operation==='update')
//                 query.query2+='DELETE FROM public.questions_qb_map WHERE ques_id=${id};DELETE FROM public.options WHERE ques_id=${id};';
//             if(query.operation==='insert'||query.operation==='update'){
//                     query.query2+='INSERT INTO public.questions_qb_map(ques_id,qb_id,org_id,user_id,create_date_time,status) VALUES (${id},${qb_id},${org_id},${user_id},now(),${qb_map_status});';
//                 query.options_array.forEach(options => {
//                     query.query2+='INSERT INTO public.options(ques_id,body,order,weightage,correct_flag,calculation_type) VALUES (${id},\''+options.body+'\',\''+options.order+'\',\''+options.weightage+'\',\''+options.correct_flag+'\',\''+options.calculation_type+'\');';
//                 });
//             }
            
//             db.tx(t=>{
//                 return t.one(query.query,query)
//                 .then(result=>{
//                     query.id=result.id;
//                     return t.multi(query.query2,query)
//                     .then(result=>{
//                         result.status=1;
//                         return result;
//                     })
//                     .catch(error_min=>{
//                         var ret={status:0};
//                         console.log(error_min);
//                         return ret;
//                     })                })
//                 .catch(error_min=>{
//                     var ret={status:0};
//                     console.log(error_min);
//                     return ret;
//                 })
//             })
//             .then(ret=>{
//                 res.status(200).send(ret);
//             }); 
//         }
//         else res.status(400).send("Operation not permitted.");
        
        
//     }
//     else{
//         res.status(400).send("Please check the documentation for usage.");
//     }
// });

router.post('/modify_mcq_question', (req, res)=>{
    let op = req.body.operation;
    let questions = {};
    let qqb_map = {};
    var query1 = '';
    var query2 = '';
  
    questions.id = (op == 'insert')? 0 : req.body.id;
    questions.type_id = req.body.type_id;
    questions.difficulty_level = req.body.difficulty_level;
    questions.weightage = req.body.weightage;
    questions.marks = req.body.marks;
    questions.used = req.body.used;
    questions.body = req.body.body;
    questions.archive_status = req.body.archive_status;
    questions.cal_logic = req.body.cal_logic;
    questions.status = req.body.status;
    questions.scale1 = req.body.scale1;
    questions.scale2 = req.body.scale2;
    questions.man_flag = req.body.man_flag;
    questions.multi_select = req.body.multi_select;
    questions.hint = req.body.hint;
    questions.matrix_dropdown_type = req.body.matrix_dropdown_type;
  
    questions.options=req.body.options;
  
    qqb_map.qb_id = req.body.qb_id;
    qqb_map.status = req.body.status;
    qqb_map.qb_order = req.body.order;
    questions.option_query = '';
  
    if(op == 'insert'){
      query1 = "INSERT INTO public.questions (type_id, difficulty_level, weightage, marks, used, body, archive_status, cal_logic, status, scale1, scale2, man_flag, multi_select, hint, matrix_dropdown_type)";
      query1 += " VALUES (${type_id}, ${difficulty_level}, ${weightage}, ${marks}, ${used}, ${body}, ${archive_status}, ${cal_logic}, ${status}, ${scale1}, ${scale2}, ${man_flag}, ${multi_select}, ${hint}, ${matrix_dropdown_type}) RETURNING id;";
  
      query2 = "INSERT INTO public.questions_qb_map (ques_id, qb_id, status, qb_order) VALUES(${id}, ${qb_id}, ${status}, ${qb_order});";
    }else if(op == 'update'){
      query1 = "UPDATE public.questions SET type_id=${type_id}, difficulty_level=${difficulty_level}, weightage=${weightage}, marks=${marks}, used=${used}, body=${body}, archive_status=${archive_status}, cal_logic=${cal_logic}, status=${status}, scale1=${scale1}, scale2=${scale2}, man_flag=${man_flag}, multi_select=${multi_select}, hint=${hint}, matrix_dropdown_type=${matrix_dropdown_type} WHERE id=${id};";
      query2 = "UPDATE public.questions_qb_map SET qb_id=${qb_id}, status=${status}, qb_order=${qb_order} WHERE ques_id=${id};";
      query3 = "DELETE FROM public.options WHERE ques_id = ${id};";
    }else if(op == 'delete'){
      query1 = "DELETE FROM public.questions WHERE id = ${id};";
      query2 = "DELETE FROM public.questions_qb_map WHERE ques_id = ${id};";
      query3 = "DELETE FROM public.options WHERE ques_id = ${id};";
    }
  
    if(questions.id != null && questions.type_id != null && questions.difficulty_level != null && questions.weightage != null && questions.marks != null && questions.used != null && questions.body != null && questions.archive_status != null && questions.cal_logic != null && questions.status != null && questions.scale1 != null && questions.scale2 != null && questions.man_flag != null && questions.multi_select != null && questions.hint != null && questions.matrix_dropdown_type != null){
      if(op == 'insert'){
        db.one(query1, questions)
        .then(result=>{
          for(var i=0; i<questions.options.length; i++){
            questions.option_query+="INSERT INTO public.options (ques_id, body, op_order, weightage, correct_flag, calculation_type, pos, order_flag, random_flag, tolerance, rank_flag) VALUES( ${id}, '"+questions.options[i].body+"', '"+questions.options[i].order+"', '"+questions.options[i].weightage+"', '"+questions.options[i].correct_flag+"', '"+questions.options[i].calculation_type+"', '"+questions.options[i].pos+"', '"+questions.options[i].order_flag+"', '"+questions.options[i].random_flag+"', '"+questions.options[i].tolerance+"', '"+questions.options[i].rank_flag+"');";
          }
          qqb_map.id = result.id;
          return db.none(query2, qqb_map)
          .then(existsx=>{
            return db.multi(questions.option_query, {id: result.id})
            .then(existsx=>{
              return {id: result.id, status: 1};
            })
            .catch(errors=>{
              console.log(errors);
              return {status: 0};
            })
          })
          .catch(error=>{
            console.log(error);
            return {status: 0};
          })
        })
        .catch(errors_min=>{
          console.log(errors_min);
          return {status: 0};
        })
        .then(ret=>{
          res.status(200).send(ret);
        })
      }else if(op == 'update'){
        db.none(query3, questions)
        .then(exists=>{
          for(var i=0; i<questions.options.length; i++){
            questions.option_query+="INSERT INTO public.options (ques_id, body, op_order, weightage, correct_flag, calculation_type, pos, order_flag, random_flag, tolerance, rank_flag) VALUES ( ${id}, '"+questions.options[i].body+"', '"+questions.options[i].order+"', '"+questions.options[i].weightage+"', '"+questions.options[i].correct_flag+"', '"+questions.options[i].calculation_type+"', '"+questions.options[i].pos+"', '"+questions.options[i].order_flag+"', '"+questions.options[i].random_flag+"', '"+questions.options[i].tolerance+"', '"+questions.options[i].rank_flag+"');";
          }
          return db.multi(query1, questions,query2, qqb_map)
          .then(existsx=>{
            return db.multi(questions.option_query, questions)
            .then(existsx=>{
              return {status: 1};
            })
            .catch(error=>{
              console.log(error);
              return {status: 2};
            })
          })
          .catch(errors=>{
            console.log(errors);
            return {status: 3};
          })
        })
        .catch(errors_min=>{
          console.log(errors_min);
          return {status: 4};
        })
        .then(ret=>{
          res.status(200).send(ret);
        })
      }else if(op == 'delete'){
        return db.multi(query1+query2+query3 ,questions)
        .then(existsx=>{
          return {status:1};
        })
        .catch(errors=>{
          console.log(errors);
          return {status:0};
        })
        .then(ret=>{
            res.status(200).send(ret);
        }); 
      }
    }else{
      res.status(401).send("Values Missing...");
    }
  });
    
    router.post('/view_mcq_question', (req, res)=>{
      let query = {};
      query.id = req.body.id;
    
      if(query.id != null){
        db.one("SELECT q.id, q.type_id, q.difficulty_level, q.weightage, q.marks, q.used, q.body, q.archive_status, q.cal_logic, q.status, q.scale1, q.scale2, q.man_flag, q.multi_select, q.hint, q.matrix_dropdown_type, qqb_map.qb_id, qqb_map.status as qqb_status, qqb_map.qb_order FROM public.questions q LEFT OUTER JOIN public.questions_qb_map qqb_map on qqb_map.ques_id = q.id WHERE q.id = ${id};", query)
        .then(question=>{
          return db.many("SELECT * FROM public.options WHERE ques_id = ${id};", query)
          .then(result2=>{
            console.log(result2);
            question.options=[];
            for(var i=0; i<result2.length; i++) {
                question.options[i] = {
                    body: result2[i].body,
                    op_order: result2[i].op_order,
                    correct_flag: result2[i].correct_flag,
                    calculation_type: result2[i].calculation_type,
                    pos: result2[i].pos,
                    order_flag: result2[i].order_flag,
                    random_flag: result2[i].random_flag,
                    tolerance: result2[i].toleranc,
                    rank_fla: result2[i].rank_flag
                }
            }
            return question;
          })
          .catch(error=>{
            console.log(error);
            return {status: 0}
          })
        })
        .catch(error_min=>{
          console.log(error_min);
          var ret={status:1};
          return ret;
        })
        .then(ret=>{
          res.status(200).send(ret);
        }); 
      }else{
        res.status(401).send("Question Id Missing...");
      }
    });
    
    router.post('/modify_essay_question', (req, res)=>{
        let op = req.body.operation;
        let ques = {};
        let qqb_map = {};
        var query1 = '';
        var query2 = '';
      
      qqb_map.qb_id = req.body.qb_id;
      qqb_map.status = req.body.status;
      qqb_map.qb_order = req.body.order;
    
      ques.id = (op == 'insert')? 0 : req.body.id;
      ques.type_id = req.body.type_id;
      ques.difficulty_level = req.body.difficulty_level;
      ques.weightage = req.body.weightage;
      ques.used = req.body.used;
      ques.body = req.body.body;
      ques.archive_status = req.body.archive_status;
      ques.cal_logic = req.body.cal_logic;
      ques.scale1 = req.body.scale1;
      ques.scale2 = req.body.scale2;
      ques.man_flag = req.body.man_flag;
      ques.multi_select = req.body.multi_select;
      ques.hint = req.body.hint;
      ques.matrix_dropdown_type = req.body.matrix_dropdown_type;
    
      if(op == 'insert'){
        query1 = "INSERT INTO public.questions (type_id, difficulty_level, weightage, used, body, archive_status, cal_logic, scale1, scale2, man_flag, multi_select, hint, matrix_dropdown_type) VALUES (${type_id}, ${difficulty_level}, ${weightage}, ${used}, ${body}, ${archive_status}, ${cal_logic}, ${scale1}, ${scale2}, ${man_flag}, ${multi_select}, ${hint}, ${matrix_dropdown_type}) RETURNING id;";
        query2 = "INSERT INTO public.questions_qb_map (ques_id, qb_id, status, qb_order) VALUES (${id}, ${qb_id}, ${status}, ${qb_order});";
      }else if(op == 'update'){
        query1 = "UPDATE public.questions SET type_id = ${type_id}, difficulty_level = ${difficulty_level}, weightage=${weightage}, used=${used}, body=${body}, archive_status=${archive_status}, cal_logic=${cal_logic}, scale1=${scale1}, scale2=${scale2}, man_flag=${man_flag}, multi_select=${multi_select}, hint=${hint}, matrix_dropdown_type=${matrix_dropdown_type} WHERE id = ${id} RETURNING id;";
        query2 = "UPDATE public.questions_qb_map SET qb_id=${qb_id}, status=${status}, qb_order=${qb_order} WHERE ques_id = ${id};";
      }else if(op == 'delete'){
        query1 = "DELETE FROM public.questions WHERE id = ${id} RETURNING id;";
        query2 = "DELETE FROM public.questions_qb_map WHERE ques_id = ${id};";
      }
    
      if(qqb_map.qb_id!=null && qqb_map.status!=null && qqb_map.qb_order!=null && ques.type_id!=null && ques.difficulty_level!=null && ques.weightage!=null && ques.used!=null && ques.body!=null && ques.archive_status!=null && ques.cal_logic!=null && ques.scale1!=null && ques.scale2!=null && ques.man_flag!=null && ques.multi_select!=null && ques.hint!=null && ques.matrix_dropdown_type!=null){
        if(op == 'insert'){
          db.one(query1, ques)
          .then(result=>{
            qqb_map.id = result.id;
            return db.none(query2, qqb_map)
            .then(exists=>{
              return {id: result.id};
            })
            .catch(error=>{
              console.log(error);
              return {status: 0}
            });
          })
          .catch(error_min=>{
            console.log(error_min);
            return {status: 0};
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }else if(op =='update'){
          db.one(query1, ques)
          .then(result=>{
            qqb_map.id = result.id;
            return db.none(query2, qqb_map)
            .then(exists=>{
              return {id: result.id};
            })
            .catch(error=>{
              console.log(error);
              return {status: 1}
            });
          })
          .catch(error_min=>{
            console.log(error_min);
            return {status: 2};
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }else if(op == 'delete'){
          db.multi(query1+query2, ques)
          .then(result=>{
            return {id: result.id};
          })
          .catch(error=>{
            console.log(error);
            let ret = {status: 0};
            return ret;
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }
      }else{
        res.status(401).send('Values missing...');
      }
    });
    
    router.post('/view_essay_question', (req, res)=>{
        let query = {};
        query.id = req.body.id;
    
      if(query.id != null){
        db.one("SELECT questions_qb_map.qb_id,questions_qb_map.status,questions_qb_map.qb_order,questions.id,questions.org_id,questions.user_id,questions.type_id,questions.difficulty_level,questions.weightage,questions.marks,questions.used,questions.body,questions.archive_status,questions.cal_logic,questions.status,questions.scale1,questions.scale2,questions.man_flag,questions.multi_select,questions.hint,questions.matrix_dropdown_type,questions.create_date_time,questions.modified_date_time FROM public.questions INNER JOIN public.questions_qb_map ON questions.id = questions_qb_map.ques_id WHERE questions.id = ${id};",query)
        .then(result=>{
          res.status(200).send(result);
        })
        .catch(error=>{
          console.log(error);
          res.status(500).send('Found No Essay Question...');
        })
      }else{
        res.status(401).send("Question ID missing...");
      }
    });
    
    router.post('/modify_neumeric_question', (req, res)=>{
      let ques = {};
      let qqb_map = {};
      var query1 = '';
      var query2 = '';
      let op = req.body.operation;
    
      qqb_map.qb_id = req.body.qb_id;
      qqb_map.status = req.body.status;
      qqb_map.qb_order = req.body.order;
    
      ques.id = (op == 'insert')? 0 : req.body.id;
      ques.type_id = req.body.type_id;
      ques.difficulty_level = req.body.difficulty_level;
      ques.weightage = req.body.weightage;
      ques.used = req.body.used;
      ques.body = req.body.body;
      ques.archive_status = req.body.archive_status;
      ques.cal_logic = req.body.cal_logic;
      ques.scale1 = req.body.scale1;
      ques.scale2 = req.body.scale2;
      ques.man_flag = req.body.man_flag;
      ques.multi_select = req.body.multi_select;
      ques.hint = req.body.hint;
      ques.matrix_dropdown_type = req.body.matrix_dropdown_type;
    
      if(op == 'insert'){
        query1 = "INSERT INTO public.questions (type_id, difficulty_level, weightage, used, body, archive_status, cal_logic, scale1, scale2, man_flag, multi_select, hint, matrix_dropdown_type) VALUES (${type_id}, ${difficulty_level}, ${weightage}, ${used}, ${body}, ${archive_status}, ${cal_logic}, ${scale1}, ${scale2}, ${man_flag}, ${multi_select}, ${hint}, ${matrix_dropdown_type}) RETURNING id;";
        query2 = "INSERT INTO public.questions_qb_map (ques_id, qb_id, status, qb_order) VALUES (${id}, ${qb_id}, ${status}, ${qb_order});";
      }else if(op == 'update'){
        query1 = "UPDATE public.questions SET type_id = ${type_id}, difficulty_level = ${difficulty_level}, weightage=${weightage}, used=${used}, body=${body}, archive_status=${archive_status}, cal_logic=${cal_logic}, scale1=${scale1}, scale2=${scale2}, man_flag=${man_flag}, multi_select=${multi_select}, hint=${hint}, matrix_dropdown_type=${matrix_dropdown_type} WHERE id = ${id} RETURNING id;";
        query2 = "UPDATE public.questions_qb_map SET qb_id=${qb_id}, status=${status}, qb_order=${qb_order} WHERE ques_id = ${id};";
      }else if(op == 'delete'){
        query1 = "DELETE FROM public.questions WHERE id = ${id} RETURNING id;";
        query2 = "DELETE FROM public.questions_qb_map WHERE ques_id = ${id};";
      }
    
      if(qqb_map.qb_id!=null && qqb_map.status!=null && qqb_map.qb_order!=null && ques.type_id!=null && ques.difficulty_level!=null && ques.weightage!=null && ques.used!=null && ques.body!=null && ques.archive_status!=null && ques.cal_logic!=null && ques.scale1!=null && ques.scale2!=null && ques.man_flag!=null && ques.multi_select!=null && ques.hint!=null && ques.matrix_dropdown_type!=null){
        if(op == 'insert'){
          db.one(query1, ques)
          .then(result=>{
            qqb_map.id = result.id;
            return db.none(query2, qqb_map)
            .then(exists=>{
              return {id: result.id, status: 1};
            })
            .catch(error=>{
              console.log(error);
              return {status: 0}
            });
          })
          .catch(error_min=>{
            console.log(error_min);
            return {status: 0};
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }else if(op =='update'){
          db.one(query1, ques)
          .then(result=>{
            qqb_map.id = result.id;
            return db.none(query2, qqb_map)
            .then(exists=>{
              return {id: result.id, status: 1};
            })
            .catch(error=>{
              console.log(error);
              return {status: 0}
            });
          })
          .catch(error_min=>{
            console.log(error_min);
            return {status: 0};
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }else if(op == 'delete'){
          db.multi(query1+query2, ques)
          .then(result=>{
            return {status: 1};
          })
          .catch(error=>{
            console.log(error);
            let ret = {status: 0};
            return ret;
          })
          .then(ret=>{
            res.status(200).send(ret);
          });
        }
      }else{
        res.status(401).send('Values missing...');
      }
    });
    
    router.post('/view_neumeric_question', (req, res)=>{
        let query = {};
        query.id = req.body.id;
    
      if(query.id != null){
        db.one("SELECT questions_qb_map.qb_id,questions_qb_map.status,questions_qb_map.qb_order,questions.id,questions.org_id,questions.user_id,questions.type_id,questions.difficulty_level,questions.weightage,questions.marks,questions.used,questions.body,questions.archive_status,questions.cal_logic,questions.status,questions.scale1,questions.scale2,questions.man_flag,questions.multi_select,questions.hint,questions.matrix_dropdown_type,questions.create_date_time,questions.modified_date_time FROM public.questions INNER JOIN public.questions_qb_map ON questions.id = questions_qb_map.ques_id WHERE questions.id = ${id};",query)
        .then(result=>{
          res.status(200).send(result);
        })
        .catch(error=>{
          console.log(error);
          res.status(500).send('Found No Essay Question...');
        })
      }else{
        res.status(401).send("Question ID missing...");
      }
    });

module.exports = router;
