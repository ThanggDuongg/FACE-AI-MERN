const http = require('http');
const app = require('./app');
const connectDB = require('./configurations/database.js');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

connectDB()
	.then(() => {server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}...`);
	});})
	.catch((er) => console.log(er.message));
