import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.json({ status: 'OK1' });
});



router.post('/login', (req, res) => {
	console.log('req.body', req.body);
	res.json({ status: 'OK2' });
});

router.post('/signup', (req, res) => {
	console.log('req.body', req.body);
	res.json({ status: 'OK2' });
});

//router.post('/', createUser);
export default router;