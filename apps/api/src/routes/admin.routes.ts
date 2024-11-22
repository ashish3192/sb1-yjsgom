import { Router } from 'express';
import { adminAuth } from '../middleware/auth';
import { AdminController } from '../controllers/admin.controller';
import { validateAdminLogin, validateAdminCreate } from '../validators/admin.validator';

const router = Router();
const adminController = new AdminController();

// Auth routes
router.post('/login', validateAdminLogin, adminController.login);
router.post('/register', validateAdminCreate, adminController.register);

// Driver management routes
router.post('/drivers', adminAuth, adminController.createDriver);
router.get('/drivers', adminAuth, adminController.getAllDrivers);
router.get('/drivers/:id', adminAuth, adminController.getDriver);
router.put('/drivers/:id', adminAuth, adminController.updateDriver);
router.delete('/drivers/:id', adminAuth, adminController.deleteDriver);

// Document management routes
router.get('/documents', adminAuth, adminController.getAllDocuments);
router.put('/documents/:id/review', adminAuth, adminController.reviewDocument);

// Geofence management routes
router.post('/geofences', adminAuth, adminController.createGeofence);
router.get('/geofences', adminAuth, adminController.getAllGeofences);
router.put('/geofences/:id', adminAuth, adminController.updateGeofence);
router.delete('/geofences/:id', adminAuth, adminController.deleteGeofence);
router.post('/geofences/:id/assign', adminAuth, adminController.assignDriverToGeofence);

// Attendance reports
router.get('/attendance/report', adminAuth, adminController.getAttendanceReport);

export default router;