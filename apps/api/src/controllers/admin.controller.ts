import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { BlobServiceClient } from '@azure/storage-blob';

const prisma = new PrismaClient();

export class AdminController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: admin.id }, config.jwtSecret, { expiresIn: '7d' });
      res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await prisma.admin.create({
        data: { email, password: hashedPassword, name }
      });

      const token = jwt.sign({ id: admin.id }, config.jwtSecret, { expiresIn: '7d' });
      res.status(201).json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async createDriver(req: Request, res: Response) {
    try {
      const { phone, name } = req.body;
      
      const existingDriver = await prisma.driver.findUnique({ where: { phone } });
      if (existingDriver) {
        return res.status(400).json({ error: 'Phone number already registered' });
      }

      const driver = await prisma.driver.create({
        data: { phone, name }
      });

      res.status(201).json(driver);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Implement other admin controller methods...
}