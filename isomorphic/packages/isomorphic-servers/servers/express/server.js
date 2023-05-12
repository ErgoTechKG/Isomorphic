import express from 'express';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import Config from './config';
import { authenticate, authError } from './middleware';
import dotenv from 'dotenv'
import routes from './routes';
import winston from 'winston';

dotenv.config()

const { port, secretKey, expiredAfter } = Config;
const app = express();

// Create a Winston logger instance
const logger = winston.createLogger({
	transports: [
	  new winston.transports.Console(),
	  new winston.transports.File({ filename: 'logs.log' }),
	],
	format: winston.format.combine(
	  winston.format.timestamp(),
	  winston.format.json()
	),
  });
  
  // Set up a middleware to log requests
  app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
  });
  

// Connect to the database

function doesUserExists(username, password) {
	console.log(username, password)
	const user = {
		id: 1,
		username: 'demo@gmail.com',
		password: 'demodemo',
	};
	if (username === user.username && password === user.password) {
		return true;
	}
	return false;
}

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(cors());



// Set up routes
app.use('/api', routes);


// app.post('/api/login', (req, res) => {
// 	console.log(req.body)
// 	const { username, password } = req.body;
// 	const response = {};
// 	// You can use DB checking here

// 	if (doesUserExists(username, password)) {
// 		response.token = jsonwebtoken.sign(
// 			{
// 				expiredAt: new Date().getTime() + expiredAfter,
// 				username,
// 				id: 1,
// 			},
// 			secretKey
// 		);
// 	} else {
// 		response.error = 'Not found';
// 	}
// 	res.json(response);
// });
app.use('/api/secret', [authenticate, authError]);
app.post('/api/secret/test', (req, res) => {
	res.json({
		status: 200,
		message: 'succcesful',
	});
});

app.listen(port, () => {
	logger.info('Isomorphic JWT login ' + port);
});
