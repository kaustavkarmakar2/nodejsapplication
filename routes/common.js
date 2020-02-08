var express = require('express');
var router = express.Router();
var db=require("../modules/db")();

router.post('/designation', function(req, res) {
    db.many('SELECT id,name FROM public.designation;')
    .then(designations=>{
        res.status(200).send(designations);
    })
    .catch(error_min=>{
        console.log(error_min.code);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});

router.post('/all_package', function(req, res) {
    db.many('SELECT package_name,job_post_price,test_given_price,can_taken_price,amount,credit_limit,validity FROM public.package;')
    .then(packages=>{
        res.status(200).send(packages);
    })
    .catch(error_min=>{
        console.log(error_min.code);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});


router.post('/industry', function(req, res) {
    db.many('SELECT id,name FROM public.industry;')
    .then(industries=>{
        res.status(200).send(industries);
    })
    .catch(error_min=>{
        console.log(error_min);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});

router.post('/skills', function(req, res) {
    db.many('SELECT id,name FROM public.skills;')
    .then(skills=>{
        res.status(200).send(skills);
    })
    .catch(error_min=>{
        console.log(error_min.code);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});

router.post('/country', function(req, res) {
    db.many('SELECT id,name FROM public.country;')
    .then(countries=>{
        res.status(200).send(countries);
    })
    .catch(error_min=>{
        console.log(error_min.code);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});

router.post('/state', function(req, res) {
    let query={};
    query.id=req.body.country_id;
    
    if(query.id != null){
        db.many('SELECT id,name FROM public.state WHERE country_id=${id};',query)
        .then(states=>{
            res.status(200).send(states);
        })
        .catch(error_min=>{
            console.log(error_min.code);
            var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
            res.status(200).send(errorobj);
        }) ;   
        
    }
    else{
        res.status(400).send("You must give country_id field!");
    }
});

router.post('/city', function(req, res) {
    let query={};
    query.id=req.body.state_id;
    
    if(query.id != null){
        db.many('SELECT id,name FROM public.city WHERE state_id=${id};',query)
        .then(cities=>{
            res.status(200).send(cities);
        })
        .catch(error_min=>{
            console.log(error_min.code);
            var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
            res.status(200).send(errorobj);
        }) ;   
        
    }
    else{
        res.status(400).send("You must give state_id field!");
    }
});

router.post('/degree', function(req, res) {
    db.many('SELECT degree.id, degree.degree_name,degree.short FROM public.degree;')
    .then(packages=>{
        res.status(200).send(packages);
    })
    .catch(error_min=>{
        console.log(error_min.code);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});

router.post('/stream', function(req, res) {
    db.many('SELECT stream.id, stream.title,stream.details FROM public.stream;')
    .then(packages=>{
        res.status(200).send(packages);
    })
    .catch(error_min=>{
        console.log(error_min.message);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});


router.post('/city_details', function(req, res) {
    let query={};
    query.id=req.body.city_id;
    
    if(query.id != null){
        db.one('SELECT e1.id AS city_id,e1.name AS city_name,e2.id AS state_id,e2.name AS state_name,e3.id AS country_id, e3.name AS country_name FROM city e1,state e2,country e3  WHERE e1.id=${id} AND e1.state_id=e2.id AND e2.country_id=e3.id;',query)
        .then(city=>{
            res.status(200).send(city);
        })
        .catch(error_min=>{
            console.log(error_min.code);
            var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
            res.status(200).send(errorobj);
        }) ;   
        
    }
    else{
        res.status(400).send("You must give city_id field!");
    }
});

router.post('/blank_table_row', function(req, res) {
    let query={};
    query.table=req.body.table;
    
    if(query.table != null){
        db.many('select column_name from information_schema.columns where table_name = ${table} AND table_schema=\'public\';',query)
        .then(columns=>{
            result={};
            columns.forEach(column => {
                result[column.column_name]='';
            });
            res.status(200).send(result);
        })
        .catch(error_min=>{
            console.log(error_min.code);
            var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
            res.status(200).send(errorobj);
        }) ;   
        
    }
    else{
        res.status(400).send("You must give table field!");
    }
});


router.post('/hobby', function(req, res) {
    db.many('SELECT * FROM public.hobby;')
    .then(packages=>{
        res.status(200).send(packages);
    })
    .catch(error_min=>{
        console.log(error_min.message);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(200).send(errorobj);
    }) ;
});


router.post('/question_type', function(req, res) {
    db.many('SELECT * FROM public.type;')
    .then(packages=>{
        res.status(200).send(packages);
    })
    .catch(error_min=>{
        console.log(error_min.message);
        var errorobj = {"error_code":error_min.received,"error_msg":error_min.message};
        res.status(400).send(errorobj);
    }) ;
});
module.exports = router;
