var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
  
    res.status(200).send({message:"Hello BillionSkills!"});
      
});

module.exports = router;