const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://primetrade-client-ramanarayana.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true);

        // Check if origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Also allow any subdomain of vercel.app for easier preview testing
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }

        // Localhost variations
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }

        console.log("Origin not allowed by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());

// database connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        const isVercel = process.env.VERCEL === '1';

        if (!mongoUri) {
            if (isVercel) {
                console.error('CRITICAL ERROR: MONGO_URI is missing in Vercel environment.');
                console.error('The application will not be able to store data or authenticate users.');
                return;
            }
            console.log('No MONGO_URI found, attempting to start local in-memory database...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongod = await MongoMemoryServer.create();
                const uri = mongod.getUri();
                await mongoose.connect(uri);
                console.log(`MongoDB Connected (In-Memory) at ${uri}`);
                return;
            } catch (err) {
                console.error('Failed to start in-memory database:', err.message);
                return;
            }
        }

        // Connect to provided MONGO_URI
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB Connected to provided URI');

    } catch (err) {
        console.error('Database connection error:', err.message);
        if (process.env.VERCEL === '1') {
            console.error('Check your Vercel environment variables and MongoDB Atlas network access.');
        }
    }
};

connectDB();

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
