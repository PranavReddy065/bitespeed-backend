import express from 'express';

import identifyContactController from '../controllers/contactController'; 

const router = express.Router();

router.post('/identify', identifyContactController);

export default router;