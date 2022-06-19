
//const nodeEmailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fs = require('fs');

const getFileContent = (template_content) => {
    let contents = fs.readFileSync(`assets/mails/${template_content.template_name}`, 'utf-8');
    return contents;
}

const transTemplate = (template_content) => {
    var template = require('es6-template-strings');
    return template(getFileContent(template_content), {...template_content})
}

const sendMail = async(msg) => {
    try{
        await sgMail.send(msg);
        console.log("Message Sent!")
    }catch(e){
        console.error(e)
        if(e.response) console.error(e.response.body);
    }
}

const sendEmail = (userEmail, template_content) => {
    const { email_address, subject, template_name } = template_content

    let astigMailOption = {
        from: process.env.SENDGRIDMAIL,
        to: userEmail,
        subject,    
        html: transTemplate(template_content)
    };

    sendMail(astigMailOption)
}

module.exports = sendEmail