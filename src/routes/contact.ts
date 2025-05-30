import express from 'express';
// Corrected import to handle the 'default' export from contactController.ts
// We're importing the default export and naming it 'identifyContactController'
import identifyContactController from '../controllers/contactController'; // No curly braces {}

const router = express.Router();

router.post('/identify', identifyContactController);

export default router;