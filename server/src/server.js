import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import './config/firebase.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security & Utility Middlewares
app.use(helmet()); // Sets secure HTTP headers
app.use(cors({
  origin: 'http://localhost:4200', // Allow our Angular frontend
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Log HTTP requests
app.use('/api/auth', authRoutes);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'NatureTek Grievance API is running smoothly.' 
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});