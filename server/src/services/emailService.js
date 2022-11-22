const nodemailer = require('nodemailer');
const token = require('../configurations/security.js');

const transport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	service: 'gmail',
	port: 465,
	secure: true,
	auth: {
		user: 'aslanteam01.noreply@gmail.com',
		pass: 'cpihfuozdprjrhtw',
	}
});

const sendConfirmationEmail = user => {
	const tokenConfirm = token.generateConfirmToken(user.email);
	const url = `http://localhost:${process.env.PORT}/api/user/confirmation/${tokenConfirm}`;

	transport.sendMail({
		from: 'aslanteam01.noreply@gmail.com',
		to: user.email,
		subject: 'New software technologies in Email Vertication Link',
		html: `<h1>Hello world!</h1><p>Link active: <a href=${url} >Join with us 🎉</a></p>`
	})
		.then(() => {
			console.log('Email sent successfully');
			console.log(url);
		})
		.catch((err) => {
			console.log('Something wrong when sent email');
			console.log(err.message);
		});
};

const sendResetPassword = user => {
	const url = `http://localhost:${process.env.PORT}/api/user/renew-password/${user.email}`;

	transport.sendMail({
		from: 'aslanteam01.noreply@gmail.com',
		to: user.email,
		subject: 'New software technologies in Email Reset password Link',
		html: `<h1>Hello world!</h1><p>Link reset password: <a href=${url} >here 😊😊</a></p>`
	})
		.then(() => {
			console.log('Email sent successfully');
			console.log(url);
		})
		.catch((err) => {
			console.log('Something wrong when sent email');
			console.log(err.message);
		});
};

const sendRenewPassword = (email, pass) => {

	transport.sendMail({
		from: 'aslanteam01.noreply@gmail.com',
		to: email,
		subject: 'New software technologies in Email Reset password Link',
		html: `<h1>Hello world!</h1><p>Here your new password ${pass}</p>`
	})
		.then(() => {
			console.log('Email sent successfully');
		})
		.catch((err) => {
			console.log('Something wrong when sent email');
			console.log(err.message);
		});
};

module.exports = {
	sendConfirmationEmail,
	sendResetPassword,
	sendRenewPassword
};
