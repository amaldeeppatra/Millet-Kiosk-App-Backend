const nodemailer = require('nodemailer');
require('dotenv').config();

function sendmail(to, subject, htmlContent){
	let mailTransporter =
	nodemailer.createTransport(
		{
			service: 'gmail',
			auth: {
				user: process.env.fromEmail,
				pass: process.env.googleAppPassword
			}
		}
	);
	
    let mailDetails = {
        from: process.env.fromEmail,
        to: to,
        subject: subject,
        html: htmlContent
    };

    mailTransporter
	.sendMail(mailDetails,
		function (err, data) {
			if (err) {
				console.log('Error Occurs');
			} else {
				console.log('Email sent successfully');
			}
		});
}

module.exports = sendmail;