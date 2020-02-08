const b2c_user_profile = require('../../models').b2c_user;
const envelope = require('../../utils/envelopes');

module.exports={

    getallb2cuserprofile(req,res){

        
        return b2c_user_profile.findAll({ 

            where: {
                id: req.params.id
            }  
        })    
       
        .then(b2c_profile =>{
            if(b2c_profile.length > 0){
                envelope.wrapSuccess(res,200,b2c_profile)
            }else{
                envelope.wrapNoContent(res,404,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))        

    },
    addb2cuserprofile(req,res){

        const userData ={

            id:req.body.id,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            photo_sm:req.body.photo_sm,
            dateofbirth:req.body.dateofbirth,
            gender:req.body.gender,
            email:req.body.email,
            alt_email:req.body.alt_email,
            phone:req.body.phone,
            alt_phone:req.body.alt_phone,
            bloodgroup:req.body.bloodgroup,
            aadhar_no:req.body.aadhar_no,
            website:req.body.website,
            pin:req.body.pin,
            facebook_link:req.body.facebook_link,
            linkedin_link:req.body.linkedin_link,
            google_link:req.body.google_link,
            mothertongue:req.body.mothertongue,
            about_me:req.body.about_me,
            resume_heading:req.body.resume_heading,
            expected_ctc:req.body.expected_ctc,
            caste:req.body.caste,
            physical_challenge:req.body.physical_challenge,
            percentage_ph:req.body.percentage_ph,
            passport_no:req.body.passport_no,
            fathers_name:req.body.fathers_name,
            fathers_occupation:req.body.fathers_occupation,
            mothers_occupation:req.body.mothers_occupation,
            created_date_time:req.body.created_date_time,
            modified_date_time:req.body.modified_date_time

        }
        return b2c_user_profile.create(userData)
        .then(b2c_profile_data =>{
            
            if(b2c_profile_data.dataValues!== undefined){
                
                envelope.wrapSuccess(res,201,b2c_profile_data)
            }else{
                envelope.wrapNoContent(res,422,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    editb2cuserprofile(req,res){

        const userData ={

            id:req.body.id,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            photo_sm:req.body.photo_sm,
            dateofbirth:req.body.dateofbirth,
            gender:req.body.gender,
            email:req.body.email,
            alt_email:req.body.alt_email,
            phone:req.body.phone,
            alt_phone:req.body.alt_phone,
            bloodgroup:req.body.bloodgroup,
            aadhar_no:req.body.aadhar_no,
            website:req.body.website,
            pin:req.body.pin,
            facebook_link:req.body.facebook_link,
            linkedin_link:req.body.linkedin_link,
            google_link:req.body.google_link,
            mothertongue:req.body.mothertongue,
            about_me:req.body.about_me,
            resume_heading:req.body.resume_heading,
            expected_ctc:req.body.expected_ctc,
            caste:req.body.caste,
            physical_challenge:req.body.physical_challenge,
            percentage_ph:req.body.percentage_ph,
            passport_no:req.body.passport_no,
            fathers_name:req.body.fathers_name,
            fathers_occupation:req.body.fathers_occupation,
            mothers_occupation:req.body.mothers_occupation,
            created_date_time:req.body.created_date_time,
            modified_date_time:req.body.modified_date_time

        }
        return b2c_user_profile.update(
            { userData },
            { where: { id: req.body.id } }
          )
        .then(b2c_profile_edit =>{
            if(b2c_profile_edit.length > 0){
                envelope.wrapSuccess(res,201,b2c_profile_edit)
            }else{
                envelope.wrapNoContent(res,400,[])
            }
        })
        .catch(error_message => envelope.wrapError(res, 404, error_message))    
    },
    deleteb2cuserprofile(req,res){
        
        return b2c_user_profile.destroy({
            where:
            {
                id:req.body.id
            }
        })    
        .then(function (deletedRecordforprofile) {
            if(deletedRecordforprofile === 1){
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