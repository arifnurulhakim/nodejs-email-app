const Email = require('../models/Email');
const EmailTemplate = require('../models/EmailTemplate'); // Model untuk mengambil template email
const SendingEmail = require('../models/SendingEmail'); // Model untuk menyimpan email yang akan dikirim
const SentEmail = require('../models/SentEmail'); // Model untuk email yang sudah terkirim
const nodemailer = require('nodemailer'); // Library untuk mengirim email

// Konfigurasi transporter dengan pengaturan dari .env
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // Set true jika menggunakan port 465
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Fungsi untuk mengirim email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

// Mengirim email
exports.sendEmails = async (req, res) => {
  const { email_template_id, recipients } = req.body;

  try {
    for (const recipient of recipients) {
      const { email, data } = recipient;

      // Simpan data pengiriman email
      const sendingEmailId = await SendingEmail.create({
        email_template_id,
        recipient_email: email,
        data,
        is_sent: false,
      });

      // Ambil template email
      const template = await EmailTemplate.getTemplateById(email_template_id);
      const emailBody = replaceTemplateData(template.body, data);

      // Kirim email menggunakan service
      const response = await sendEmail(email, template.subject, emailBody);

      // Simpan log pengiriman email
      await SentEmail.create({
        sending_email_id: sendingEmailId,
        recipient_email: email,
        sent_at: new Date(),
        response: response.response, // Ambil response dari pengiriman
      });

      // Update status pengiriman di tabel sending_emails
      await SendingEmail.updateStatus(sendingEmailId, true);
    }

    res.status(200).json({ status: 'success', message: 'Emails sent successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error sending emails', error: error.message });
  }
};

// Fungsi untuk mengganti data template
const replaceTemplateData = (template, data) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
};

// Mengambil semua email yang telah dikirim
exports.getAllSentEmails = async (req, res) => {
  try {
    const sentEmails = await SentEmail.getAll();
    res.status(200).json({ status: 'success', data: sentEmails });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching sent emails', error: error.message });
  }
};

// Mengambil semua email
exports.getAllEmails = async (req, res) => {
  try {
    const emails = await Email.getAllEmails();
    res.status(200).json({ status: 'success', data: emails });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching emails', error: error.message });
  }
};

// Mengambil email berdasarkan ID
exports.getEmailById = async (req, res) => {
  const { id } = req.params;
  try {
    const email = await Email.getEmailById(id);
    if (!email) {
      return res.status(404).json({ status: 'error', message: 'Email not found' });
    }
    res.status(200).json({ status: 'success', data: email });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching email', error: error.message });
  }
};

// Membuat email baru
exports.createEmail = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newEmailId = await Email.createEmail({ name, email });
    res.status(201).json({ status: 'success', message: 'Email created successfully', data: { id: newEmailId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating email', error: error.message });
  }
};

// Memperbarui email
exports.updateEmail = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedEmail = await Email.updateEmail(id, { name, email });
    if (!updatedEmail) {
      return res.status(404).json({ status: 'error', message: 'Email not found' });
    }
    res.status(200).json({ status: 'success', message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error updating email', error: error.message });
  }
};

// Menghapus email
exports.deleteEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEmail = await Email.deleteEmail(id);
    if (!deletedEmail) {
      return res.status(404).json({ status: 'error', message: 'Email not found' });
    }
    res.status(200).json({ status: 'success', message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting email', error: error.message });
  }
};
