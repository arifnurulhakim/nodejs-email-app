require('dotenv').config(); // Import dan konfigurasikan dotenv
const fs = require('fs'); // Import fs module untuk membaca file
const path = require('path'); // Import path module untuk mengelola path file
const { Client } = require('pg'); // Import Client from pg

// Tentukan path ke root-certs.crt
const certPath = path.join(__dirname, '/crt/root-certs.crt'); // Sesuaikan path jika perlu

// Membaca file sertifikat
let ca;
try {
  ca = fs.readFileSync(certPath);
} catch (error) {
  console.error('Error reading SSL certificate file:', error.message);
  process.exit(1); // Keluar dari aplikasi jika gagal membaca sertifikat
}

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port is 5432
  ssl: {
    rejectUnauthorized: false, // Set to false jika ingin menerima sertifikat self-signed
    ca, // Menggunakan variable ca yang berisi isi sertifikat
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
