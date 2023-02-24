const nodemailer = require("nodemailer")


let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD
    },
  });

  module.exports = (emailClient,subject,url,name) => {
    let mailOption ={
        from:  process.env.EMAIL_NAME,
        to: emailClient,
        subject:`${subject} is your otp`,
        text: `Hello ${name}, ${subject} is your otp, please input in form ${url}`
    }

    transporter.sendMail(mailOption,function(error,data){
        if(error){
            console.log("error : ", error)
            return "Email not sent"
        } else{
            console.log("OTP email sent ")
            console.log(data)
            return "Email success"
        }
    })
  }