/*
  Projekt: Norra Café - Backend API
  Kurs: DT207G, VT25
  Författare: Maamoun Okla
  Datum: 2025-10-18
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
 
const dotenv = require('dotenv');
dotenv.config();

const authed = require('./src/routes/authed');
const menuRoutes = require('./src/routes/menu');
 
const path = require('path');
const fs = require('fs');
 
// Config
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET_Key;


if (!JWT_SECRET || !MONGO_URI) {
  console.error('Missing env vars');
  process.exit(1);
}

// App setup
const app = express();
app.use(express.json());
// app.use(cors({
//   origin: ['http://localhost:1234', 'http://127.0.0.1:1234']
// }));


app.use(cors());

// Ensure uploads folder exists (local dev)
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB  
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api', authed);
app.use('/api', menuRoutes);

// Start
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
