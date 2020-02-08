const b2c_user_publication = require('../../models').b2c_user_publication;
const envelope = require('../../utils/envelopes');



module.exports={

    getallb2cuserpublication(req,res){

        
        return b2c_user_publication.findAll({ 

            where: {
                id: req.params.id
            }  
        })    
       
        .then(b2c_user_publication =>{
            if(b2c_user_publication.length > 0){
                envelope.wrapSuccess(res,200,b2c_user_publication)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    },
    addb2cuserpublication(req,res){

        const userData ={
            // id:req.body.id,
            // user_id:req.body.user_id,
            title:req.body.title,
            type:req.body.type,
            client:req.body.client,
            author:req.body.author,
            publish_year:req.body.publish_year,
            catation:req.body.catation,
            version:req.body.version,
            url:req.body.url,
            detail:req.body.detail,
            file_url:req.body.file_url,
            create_date_time:req.body.created_date_time,
            modify_date_time:req.body.modified_date_time
        }
        return b2c_user_publication.create(userData)

        .then(b2c_publication =>{
            if(b2c_publication.dataValues!== undefined){
                envelope.wrapSuccess(res,201,b2c_publication)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    editb2cuserpublication(req,res){

        const userData ={
            id:req.body.id,
            user_id:req.body.user_id,
            title:req.body.title,
            type:req.body.type,
            client:req.body.client,
            author:req.body.author,
            publish_year:req.body.publish_year,
            catation:req.body.catation,
            version:req.body.version,
            url:req.body.url,
            detail:req.body.detail,
            file_url:req.body.file_url,
            create_date_time:req.body.created_date_time,
            modify_date_time:req.body.modified_date_time
        }
        return b2c_user_publication.update(
            { userData },
            { where: { id: req.body.id } }
          )
        .then(b2c_pubilcation_edit =>{
            if(b2c_pubilcation_edit.length > 0){
                envelope.wrapSuccess(res,201,b2c_pubilcation_edit)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    deleteb2cuserpublication(req,res){
        
        return b2c_user_publication.destroy({
            where:
            {
                id:req.body.id
            }
        })    
        .then(function (deletedRecordforpublication) {
            if(deletedRecordforpublication === 1){
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