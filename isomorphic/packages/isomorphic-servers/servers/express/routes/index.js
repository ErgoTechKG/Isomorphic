import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.json({ status: 'OK1' });
});


//router.post('/', createUser);
export default router;