const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');
const token = require('../../configurations/security.js');
const emailService = require('../../services/emailService.js');
const ROLES = require('../../constants/role.js');
const jwt = require('jsonwebtoken');
const { makeRandomPassword } = require('../../utils/index.js');

const login = asyncHandler(async (req, res) => {
	const {
		email,
		password
	} = req.body;
	const user = await User.findOne({
		email
	});

	if (user && (await user.matchPassword(password))) {
		if (user.isActive) {
			const data = {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				image: user.image,
				role: user.role,
			};
			const accessToken = token.generateAccessToken(data);
			const refreshToken = token.generateRefreshToken(user.email);
			Object.assign(data, {accessToken: accessToken, refreshToken: refreshToken});

			res.status(200).json({
				data,
				message: 'successfully',
			});
		} else {
			res.status(409).json({
				message: 'Account is not active',
			});
		}
	} else {
		res.status(401).json({
			message: 'Invalid username or password',
		});
	}
});

const register = asyncHandler(async (req, res) => {
	const {
		fullName,
		email,
		password,
		image,
		role
	} = req.body;
	console.log(req.body);

	if (!fullName || !image || !email || !role || !password) {
		res.status(400).json({
			message: 'Some fields invalid',
		});
		throw new Error('Please enter all the fields');
	}

	if (role !== ROLES.ADMIN && role !== ROLES.USER) {
		res.status(400).json({
			message: 'Your role not existed',
		});
	}

	//check user in system
	const userExisted = await User.findOne({
		email
	});

	if (userExisted) {
		res.status(400).json({
			message: 'User already exists in the system'
		});
	}

	const newUser = await User.create({
		fullName,
		email,
		password,
		image,
		role
	});

	if (newUser) {
		emailService.sendConfirmationEmail(newUser);
		res.status(201).json({
			message: 'successfully'
		});
	} else {
		res.status(400).json({
			message: 'Something wrong, can\'t create new user',
		});
		throw new Error('Failed to create new user');
	}
});

const activeAccout = asyncHandler(async(req, res) => {
	let confirmToken = req.params.token;
	try {
		let decoded = jwt.verify(confirmToken, process.env.JWT_SECRET);
		let {
			email
		} = decoded;

		const userExisted = await User.findOne({
			email
		});

		if (userExisted) {
			//update user to active account
			const dataUpdate = {
				...userExisted,
				isActive: true
			};
			userExisted.isActive = true;
			const updateUser = await User.findOneAndUpdate(email, {
				dataUpdate
			}, {
				new: true,
			});

			const data = {
				_id: updateUser._id,
				fullName: updateUser.fullName,
				email: updateUser.email,
				image: updateUser.image,
				role: updateUser.role,
			};

			// create accessToken and refreshToken
			const accessToken = token.generateAccessToken(data);
			const refreshToken = token.generateRefreshToken(email);

			res.redirect(`http://localhost:3000/confirm-email?accessToken=${accessToken}&refreshToken=${refreshToken}`);
		} else {
			res.status(401).json({
				message: 'user not existed in system',
			});
		}
	} catch (err) {
		res.status(401).json({
			message: err.message,
		});
	}
});

const resetPassword = asyncHandler(async(req, res) => {
	const {
		email
	} = req.body;
	const user = await User.findOne({
		email
	});

	if (!user) {
		res.status(401).json({
			message: 'Invalid email',
		});
	} else {
		emailService.sendResetPassword(user);
		res.status(200).json({
			message: 'Check email to renew password'
		});
	}
});

const renewPassword = asyncHandler(async(req, res) => {
	const {
		email
	} = req.params;
	const user = await User.findOne({
		email
	});
	if (!user) {
		res.status(401).json({
			message: 'Invalid email',
		});
	} else {
		const newpass = makeRandomPassword(10);
		user.password = newpass;
		await User.findOneAndUpdate(email, {
			...user,
			email,
		}, {
			new: true,
		});
		emailService.sendRenewPassword(email, newpass);
		const alert = 'Check your email to get new password';
		res.redirect(`http://localhost:3000/login?alert=${alert}`);
	}
});

const refreshToken = asyncHandler(async(req, res)=> {
	//take the refresh token 
	const {
		token: refreshToken
	} = req.body;

	if (!refreshToken)
		return res.status(401).json({
			message: 'You are not authenticated',
		});

	// if (!refreshToken.includes(refreshToken)) {
	// 	return res.status(403).json({
	// 		message: 'Refresh token is not valid!',
	// 	});
	// }

	jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({
				message: 'Token is not valid',
			});
		}

		const email = decoded.email;
		const user = User.findOne({
			email
		});

		const data = {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			username: user.username,
			image: user.image,
			role: user.role,
		};
		const accessToken = token.generateAccessToken(data);

		res.status(200).json({
			accessToken: accessToken,
			message: 'Refresh token successfully!',
		});
	});
}); 

module.exports = {
	login,
	register,
	activeAccout,
	resetPassword,
	renewPassword,
	refreshToken
};
