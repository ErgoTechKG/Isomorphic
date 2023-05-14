import jsonwebtoken from 'jsonwebtoken';
import Config from './config';

const { secretKey } = Config;

const authenticate = (req, res, next) => {
	const token = req.headers.authorization || '';
	console.log('middleware token', token)
	jsonwebtoken.verify(token, secretKey, (error, decoded) => {
		if (error) {
			console.log('error', error)
			next({ error: 'token varified failed' });
		} else {
			const { expiredAt } = decoded;
			console.log('expiredAt',expiredAt)
			if (expiredAt > new Date().getTime()) {
				next();
			} else {
				//next({ error: 'token expired' });
				next();
			}
		}
	});
};

const authError = (err, req, res, next) => {
	res.json(err);
};
export { authenticate, authError };
