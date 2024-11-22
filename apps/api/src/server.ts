import express from 'express';
import cors from 'cors';
import { config } from './config';
import adminRoutes from './routes/admin.routes';
import driverRoutes from './routes/driver.routes';
import geofenceRoutes from './routes/geofence.routes';
import documentRoutes from './routes/document.routes';
import attendanceRoutes from './routes/attendance.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/geofence', geofenceRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});