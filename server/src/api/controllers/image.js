const asyncHandler = require('express-async-handler');
const Clarifai = require('clarifai');

const clarify = new Clarifai.App({
	apiKey: '05a61f3cc6434dcb913b52988f397ffb'
});

const detectOneFace = asyncHandler(async (req, res) => {
	const { imageURL } = req.body;

	const responseBody = {
		entries: 0,
		data: {}
	};

	clarify.models.predict(Clarifai.FACE_DETECT_MODEL, imageURL)
		.then((response) => {
			if(!response) { throw new Error('error getting face from Clarifai'); }
			responseBody.data = response;
			//return db.updateUser(id);  //update user's stats after fetched face
		}).then((entries) => {
			responseBody.entries = entries;
			return res.json(responseBody);
		}).catch((error) => res.status(400).json('error: ' + error));
});

module.exports = {
	detectOneFace
};
