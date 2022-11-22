const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const uri = process.env.KEY_MONGODB;
		const conn = await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`Something wrong when connect MongoDB: ${error.message}`);
		process.exit();
	}
};

module.exports = connectDB;
