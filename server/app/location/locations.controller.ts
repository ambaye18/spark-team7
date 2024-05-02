import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';

export const get_all_locations = async (_: Request, res: Response) => {
  try {
    const allLocation = await prisma.location.findMany();
    res.json(allLocation);
  } catch (error) {
    console.error('Error fetching tag types:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
