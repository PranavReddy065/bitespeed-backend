import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const identifyContact = async (req: Request, res: Response) => {
  // logic here
};
