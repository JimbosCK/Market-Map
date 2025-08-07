require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const marketsRouter = require('./routes/markets.routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/markets', marketsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});