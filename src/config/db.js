require('dotenv').config(); // Import dan konfigurasikan dotenv
const fs = require('fs'); // Import fs module untuk membaca file
const { Client } = require('pg'); // Import Client from pg

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port is 5432
  ssl: {
    rejectUnauthorized: false, // Set to false if you want to allow self-signed certificates
    ca: fs.readFileSync('crt/root-certs.crt'), // Ganti dengan path ke root-certs.crt
  },
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = client;
