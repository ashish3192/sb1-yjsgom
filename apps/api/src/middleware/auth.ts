import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const admin = await prisma.admin.findUnique({
      where: { id: (decoded as any).id }
    });

    if (!admin) {
      throw new Error();
    }

    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const driverAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const driver = await prisma.driver.findUnique({
      where: { id: (decoded as any).id }
    });

    if (!driver) {
      throw new Error();
    }

    req.user = driver;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};