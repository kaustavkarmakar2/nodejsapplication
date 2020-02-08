const b2c_user_award = require('../../models').b2c_user_award;
const envelope = require('../../utils/envelopes');

module.exports={
    getallb2cuseraward(req,res){

        var id = req.params.id;
        return b2c_user_award.findAll({ 

            where: {
                id: req.params.id
            }  
        })      
       
        .then(b2c_user_award =>{
            if(b2c_user_award.length > 0){
                envelope.wrapSuccess(res,200,b2c_user_award)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    },   
    addb2cuseraward(req,res){
        const userData ={
            id:req.body.id,
            user_id:req.body.user_id,
            detail:req.body.detail,
            file_url:req.body.file_url,
            created_date_time:req.body.created_date_time,
            modified_date_time:req.body.modified_date_time
        }
        return b2c_user_award.create(userData)
        .then(b2c_award =>{
            if(b2c_award.dataValues!== undefined){
                envelope.wrapSuccess(res,201,b2c_award)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    editb2cuseraward(req,res){
        const userData ={
            id:req.body.id,
            user_id:req.body.user_id,
            detail:req.body.detail,
            file_url:req.body.file_url,
            created_date_time:req.body.created_date_time,
            modified_date_time:req.body.modified_date_time
        }
        return b2c_user_award.update(
            { userData },
            { where: { id: req.body.id } }
          )
        .then(b2c_user_award =>{
            if(b2c_user_award.length > 0){
                envelope.wrapSuccess(res,201,b2c_user_award)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },    
    deleteb2cuseraward(req,res){
        
        return b2c_user_award.destroy({
            where:
            {
                id:req.body.id
            }
        })       
        .then(function (deletedRecordaward) {
            if(deletedRecordaward === 1){
                res.status(200).json({message:"Deleted successfully"});          
            }
            else
            {
                res.status(404).json({message:"record not found"})
            }
        })        
        .catch(function (error){
            res.status(500).json(error);
        });   
    }
}