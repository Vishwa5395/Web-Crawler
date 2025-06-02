require('dotenv').config();
const cors = require('cors'); 
const express = require('express');
const mongoose = require('mongoose');
const crawlerRoutes = require('./routes/crawlerRoutes');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // ✅ allow frontend
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use('/api', crawlerRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
