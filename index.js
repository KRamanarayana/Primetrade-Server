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
    'http://localhost:5173', // Common Vite port
    'https://primetrade-client-ramanarayana.vercel.app', // Anticipated client URL
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Origin not allowed by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// database connection
const { MongoMemoryServer } = require('mongodb-memory-server');

// ... (keep this comment if you want, but I'll replace the block)

// database connection
const connectDB = async () => {
    try {
        let mongoUri = process.env.MONGO_URI;

        // Try connecting to the configured URI
        try {
            await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
            console.log('MongoDB Connected');
        } catch (err) {
            console.log('Local MongoDB failed, starting in-memory database...');
            const mongod = await MongoMemoryServer.create();
            mongoUri = mongod.getUri();
            await mongoose.connect(mongoUri);
            console.log(`MongoDB Connected (In-Memory) at ${mongoUri}`);
        }
    } catch (err) {
        console.error('Database connection error:', err);
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
