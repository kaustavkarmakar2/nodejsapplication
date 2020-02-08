const sql_config=require('../sql_config');

var db, pgp=require('pg-promise')({}), get=()=>{
    if(db)return db;
    else{
        db=pgp(sql_config);
        return db;
    } 
};

module.exports=get

