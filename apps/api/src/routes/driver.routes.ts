import { Router } from 'express';
import { driverAuth } from '../middleware/auth';
import { DriverController } from '../controllers/driver.controller';
import { validateOTP, validatePhoneNumber } from '../validators/driver.validator';

const router = Router();
const driverController = new DriverController();

// Auth routes
router.post('/login', validatePhoneNumber, driverController.requestOTP);
router.post('/verify', validateOTP, driverController.verifyOTP);

// Profile routes
router.get('/profile', driverAuth, driverController.getProfile);
router.put('/profile', driverAuth, driverController.updateProfile);

// Document routes
router.post('/documents', driverAuth, driverController.uploadDocument);
router.get('/documents', driverAuth, driverController.getDocuments);

// Attendance routes
router.post('/attendance/checkin', driverAuth, driverController.checkIn);
router.post('/attendance/checkout', driverAuth, driverController.checkOut);
router.get('/attendance/history', driverAuth, driverController.getAttendanceHistory);

export default router;