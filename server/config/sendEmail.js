const nodemailer  = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  service: 'gmail',
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASSWORD,
  },
});

const sendEmail = (email, subject, text) => {

	console.log("send email callded")
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent successfully!', info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = {
	sendEmail
};
