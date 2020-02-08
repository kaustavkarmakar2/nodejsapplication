const b2c_user_project = require('../../models').b2c_user_project;
const envelope = require('../../utils/envelopes');

module.exports={

    getallb2cuserproject(req,res){

        var id = req.params.id;
        return b2c_user_project.findAll({ 

            where: {
                id: req.params.id
            }  
        })      
       
        .then(b2c_user_project =>{
            if(b2c_user_project.length > 0){
                envelope.wrapSuccess(res,200,b2c_user_project)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    },
    
    addb2cuserproject(req,res){

        const userData ={

            id:req.body.id,
            title:req.body.title,
            client:req.body.client,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            type:req.body.type,
            detail:req.body.detail,
            file_url:req.body.file_url,
            role:req.body.role,
            create_date:req.body.create_date,
            modify_date:req.body.modify_date,
            user_id:req.body.user_id
        }
        return b2c_user_project.create(userData)
        .then(b2c =>{
            console.log('---->')
            console.log(b2c.dataValues);
            if(b2c.dataValues!== undefined){
                
                envelope.wrapSuccess(res,201,b2c)
            }else{
                envelope.wrapNoContent(res,422,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    editb2cuserproject(req,res){

        const userData ={

            id:req.body.id,
            title:req.body.title,
            client:req.body.client,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            type:req.body.type,
            detail:req.body.detail,
            file_url:req.body.file_url,
            role:req.body.role,
            create_date:req.body.create_date,
            modify_date:req.body.modify_date,
            user_id:req.body.user_id
        }
        return b2c_user_project.update(
            { userData },
            { where: { id: req.body.id } }
          )
        .then(b2c_user_project =>{
            if(b2c_user_project.length > 0){
                envelope.wrapSuccess(res,201,b2c_user_project)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
  
    deleteb2cuserproject(req,res){
        
        return b2c_user_project.destroy({
            where:
            {
                id:req.body.id
            }
        })    
        .then(function (deletedRecord) {
            if(deletedRecord === 1){
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