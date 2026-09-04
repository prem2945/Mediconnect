import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import clinicRoutes from './routes/clinic.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import tokenRoutes from './routes/token.routes.js';
import patientRoutes from './routes/patient.routes.js';
import postRoutes from './routes/post.routes.js';
import adminRoutes from './routes/admin.routes.js';
import doctorAvailabilityRoutes from "./routes/doctorAvailability.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import reportRoutes from "./routes/report.routes.js";
import aiInsightsRoutes from "./routes/aiInsights.routes.js";
import aiReceptionistRoutes from "./routes/aiReceptionist.routes.js";
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for direct /auth requests
app.use('/api/v1/clinics', clinicRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use("/api/v1/availability", doctorAvailabilityRoutes);
app.use("/api/v1/slots", slotRoutes);
app.use("/api/v1/leaves", leaveRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/ai-insights", aiInsightsRoutes);
app.use("/api/v1/ai-receptionist", aiReceptionistRoutes);

// Serve React frontend static assets in production

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
    path.resolve(__dirname, '../../client/dist'),
    path.resolve(__dirname, '../../../MediConnect/client/dist'),
    path.resolve(process.cwd(), '../client/dist'),
    path.resolve(process.cwd(), 'client/dist'),
    path.resolve(process.cwd(), 'MediConnect/client/dist'),
];

const clientBuildPath = candidatePaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || candidatePaths[0];

console.log(`[INFO] Client build path resolved to: ${clientBuildPath} (index.html exists: ${fs.existsSync(path.join(clientBuildPath, 'index.html'))})`);

app.use(express.static(clientBuildPath));

app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
        return next();
    }
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    next();
});

// Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
