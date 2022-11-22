const jwt = require('jsonwebtoken');
// const User = require('../api/models/user.js');
const asyncHandler = require('express-async-handler');

const verify = asyncHandler(async (req, res, next) => {
	console.log(req);
	const authHeader = req.headers.authorization;
	// console.log(authHeader);

	if (authHeader &&
        authHeader.startsWith('Bearer')
	) {
		const token = authHeader.split(' ')[1];
		// console.log(token);

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({
					message: 'Token is not valid',
				});
			}

			req.user = user;
			next();
		});
	} else {
		res.status(401).json({
			message: 'You aren\'t authenticated',
		});
	}
});

module.exports = {
	verify
};
