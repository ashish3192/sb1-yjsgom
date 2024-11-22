import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Twilio } from 'twilio';
import { config } from '../config';
import { BlobServiceClient } from '@azure/storage-blob';
import { isPointInPolygon } from '../utils/geofence';

const prisma = new PrismaClient();
const twilio = new Twilio(config.twilioAccountSid, config.twilioAuthToken);

export class DriverController {
  async requestOTP(req: Request, res: Response) {
    try {
      const { phone } = req.body;
      
      const driver = await prisma.driver.findUnique({ where: { phone } });
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in cache (implement proper OTP storage/redis in production)
      // For demo, we'll send the OTP directly
      await twilio.messages.create({
        body: `Your OTP is: ${otp}`,
        to: phone,
        from: config.twilioPhoneNumber
      });

      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { phone, otp } = req.body;
      
      // Verify OTP (implement proper verification in production)
      // For demo, we'll accept any OTP
      const driver = await prisma.driver.findUnique({ where: { phone } });
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      const token = jwt.sign({ id: driver.id }, config.jwtSecret, { expiresIn: '30d' });
      res.json({ token, driver });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.body;
      const driver = req.user;

      // Get driver's assigned geofence
      const driverGeofence = await prisma.driverGeofence.findFirst({
        where: { driverId: driver.id },
        include: { geofence: true }
      });

      if (!driverGeofence) {
        return res.status(400).json({ error: 'No geofence assigned' });
      }

      // Check if driver is within geofence
      const isInGeofence = isPointInPolygon(
        { lat: latitude, lng: longitude },
        driverGeofence.geofence.coordinates
      );

      if (!isInGeofence) {
        return res.status(400).json({ error: 'Not within assigned geofence' });
      }

      // Create attendance record
      const attendance = await prisma.attendance.create({
        data: {
          driverId: driver.id,
          geofenceId: driverGeofence.geofenceId,
          checkIn: new Date()
        }
      });

      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Implement other driver controller methods...
}