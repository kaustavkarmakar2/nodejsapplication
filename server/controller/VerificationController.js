const b2c_user = require('../../models').b2c_user;
const envelope = require('../../utils/envelopes');
const VerificationToken = require('../../models').VericationTokens;
console.log("gggggggg");
module.exports={
 VerificationController(req, res){
    return b2c_user.find({
      where: { email: req.query.email }
    })
    // include: [{
    //     model: VerificationToken,
    //     where: { email: req.query.email }
    // }]
    
    
    .then(user => {
        if (user.isVerified) {
          return res.status(202).json(`Email Already Verified`);
        } else {
          return models.VerificationToken.find({
            where: { token: req.query.verificationToken }
          })
            .then((foundToken) => {
              if(foundToken){
                return user
                  .update({ isVerified: true })
                  .then(updatedUser => {
                    return res.status(403).json(`User with ${user.email} has been verified`);
                  })
                  .catch(reason => {
                    return res.status(403).json(`Verification failed`);
                  });
              } else {
                return res.status(404).json(`Token expired` );
              }
            })
            .catch(reason => {
              return res.status(404).json(`Token expired`);
            });
        }
      })
      .catch(reason => {
        return res.status(404).json(`Email not found`);
      });
    }
}
    
