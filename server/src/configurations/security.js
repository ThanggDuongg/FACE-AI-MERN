const jwt = require('jsonwebtoken');

const generateConfirmToken = (email) => {
	return jwt.sign({
		email
	},
	process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

const generateAccessToken = (user) => {
	return jwt.sign(
		user,
		process.env.JWT_SECRET, {
			expiresIn: '10m',
		});
};

const generateRefreshToken = (email) => {
	// console.log(user);
	// return jwt.sign(
	//     user.toJSON(),
	//     process.env.JWT_SECRET, {
	//         expiresIn: '7d',
	//     });
	return jwt.sign({
		email
	},
	process.env.JWT_SECRET, {
		expiresIn: '7d',
	});
};

module.exports = {
	generateAccessToken,
	generateConfirmToken,
	generateRefreshToken,
};
