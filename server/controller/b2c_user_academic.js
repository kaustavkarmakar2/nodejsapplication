const b2c_user_academic = require('../../models').b2c_user_academic;
const envelope = require('../../utils/envelopes');

module.exports={
    getallb2cuseracademic(req,res){

        var id = req.params.id;
        return b2c_user_academic.findAll({ 

            where: {
                id: req.params.id
            }       
              
        })   
       
        .then(b2c_user_academic =>{
            if(b2c_user_academic.length > 0){
                envelope.wrapSuccess(res,200,b2c_user_academic)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    }
}
