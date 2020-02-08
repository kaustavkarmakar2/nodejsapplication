var express = require('express');
var router = express.Router();
var db=require("../modules/db")();

router.post('/', function(req, res) {
    
    var tokengen={};
    tokengen.ip=req.ip;
    tokengen.token=require('crypto').createHash('md5').update(Math.random()+" "+tokengen.ip).digest("hex");
    var comdate=new Date();
    tokengen.start_date=comdate.toISOString();
    comdate.setMinutes(comdate.getMinutes()+20);
    tokengen.end_date=comdate.toISOString();
    
    db.one('INSERT INTO public.apitoken(ip,auth_token,fromdate,todate) VALUES (${ip},${token},${start_date},${end_date}) RETURNING id,auth_token;',tokengen)
    .then(result=>{
        res.status(200).send(result);
    })
    .catch(error=>{
        console.log(error);
        res.sendStatus(500);
    });
});   

module.exports = router;
