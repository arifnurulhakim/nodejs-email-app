const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

require('dotenv').config(); // Import dan konfigurasikan dotenv

app.use(express.json()); // Untuk parsing JSON

// Import koneksi database
const db = require('./config/db');

// Import rute autentikasi
const Routes = require('./routes/Routes.js'); // Perbaiki path rute dengan path relatif yang benar

app.use('/api', Routes);

// Contoh route GET
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
