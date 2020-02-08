var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    host: 'mail.billionskills.com',
    port: 25,
    auth: {
        user: 'support@billionskills.com',
        pass: 'billionskills@123'
    }
}));

var mailOptions = {
    from: '"BillionSkills" <support@billionskills.com>', // sender address
};


var send=(to,html,subject,callback=null)=>{
    mailOptions.to=to;
    mailOptions.html=html;
    //mailOptions.attachments=attachments;
    mailOptions.subject=subject;
    if(callback) transporter.sendMail(mailOptions,callback);
    else transporter.sendMail(mailOptions);
}

module.exports=send;