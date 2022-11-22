const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./api/routes/user.js');
const imageRoutes = require('./api/routes/image.js');
const {
	notFound,
	errorHandler
} = require('./middlewares/errorMiddleware.js');

dotenv.config({ path: `${__dirname}/../.env.development.local` });

const app = express();

// app.use(cors({
// 	origin: 'http://localhost:3000'
// }));
// app.use(morgan('combined'));
// app.use(express.json());

app.use(bodyParser.json({
	limit: '30mb',
	extended: true,
}));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	limit: '30mb',
	extended: true,
}));

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});

app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
