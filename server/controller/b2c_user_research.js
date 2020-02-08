const b2c_user_research = require('../../models').b2c_user_research;
const envelope = require('../../utils/envelopes');


module.exports={

    getallb2cuserresearch(req,res){

        
        return b2c_user_research.findAll({ 

            where: {
                id: req.params.id
            }  
        })    
       
        .then(b2c_user_research =>{
            if(b2c_user_research.length > 0){
                envelope.wrapSuccess(res,200,b2c_user_research)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    },
    addb2cuserresearch(req,res){

        const userData ={
            id:req.body.id,
            user_id:req.body.user_id,
            title:req.body.title,           
            detail:req.body.detail,
            file_url:req.body.file_url,
            create_date_time:req.body.created_date_time,
            modify_date_time:req.body.modified_date_time
        }
        return b2c_user_research.create(userData)

        .then(b2c_research =>{
            if(b2c_research.dataValues!== undefined){
                envelope.wrapSuccess(res,201,b2c_research)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    editb2cuserresearch(req,res){

        const userData ={
            id:req.body.id,
            user_id:req.body.user_id,
            title:req.body.title,           
            detail:req.body.detail,
            file_url:req.body.file_url,
            create_date_time:req.body.created_date_time,
            modify_date_time:req.body.modified_date_time
        }
        return b2c_user_research.update(
            { userData },
            { where: { id: req.body.id } }
          )
        .then(b2c_research_edit =>{
            if(b2c_research_edit.length > 0){
                envelope.wrapSuccess(res,201,b2c_research_edit)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    deleteb2cuserresearch(req,res){
        
        return b2c_user_research.destroy({
            where:
            {
                id:req.body.id
            }
        })    
        .then(function (deletedRecordforresearch) {
            if(deletedRecordforresearch === 1){
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