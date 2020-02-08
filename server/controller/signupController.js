const b2c_user = require('../../models').b2c_user;
const VerificationToken = require('../../models').vericationtokens;
const crypto= require("crypto-random-string");
const { sendVerificationEmail } = require('./sendgrid');

module.exports={
    SignUpController(req, res, next) {
    return b2c_user.findOrCreate({
        where: { email:  req.body.email },
        defaults: req.body
    })
    .spread((user, created) => {
        // if user email already exists
        if(!created) {
        return res.status(409).json('User with email address already exists');
        } else {
        return VerificationToken.create({
            userId: user.id,
            token: crypto(16)
           
        })
        .then((result) => {
            console.log(token);
            sendVerificationEmail(user.email, result.token);
            return res.status(200).json(`${user.email} account created successfully`);
        })
        .catch((error) => {
            return res.status(500).json(error);
        });
        }
    })
        .catch((error) => {
            return res.status(500).json(error);
        });
    }
}

// export default SignUpController;