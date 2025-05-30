import { Request, Response } from 'express';
import { identifyContactService } from '../services/contact.services'; 


const identifyContactController = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Either email or phoneNumber must be provided.' });
    }

    try {
        const result = await identifyContactService(email, phoneNumber);
        res.status(200).json({ contact: result });
    } catch (error: any) {
        console.error('Error in identifyContactController:', error);
        res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
    }
};

export default identifyContactController; 