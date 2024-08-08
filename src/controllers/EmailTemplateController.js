const EmailTemplate = require('../models/EmailTemplate');

// Mengambil semua template email
exports.getAllEmailTemplates = async (req, res) => {
  try {
    const templates = await EmailTemplate.getAllTemplates();
    res.status(200).json({ status: 'success', data: templates });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching email templates', error: error.message });
  }
};

// Mengambil template email berdasarkan ID
exports.getEmailTemplateById = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await EmailTemplate.getTemplateById(id);
    res.status(200).json({ status: 'success', data: template });
  } catch (error) {
    res.status(error.message === 'Template not found' ? 404 : 500).json({ status: 'error', message: 'Error fetching email template', error: error.message });
  }
};

// Membuat template email baru
exports.createEmailTemplate = async (req, res) => {
  const { name, subject, body } = req.body;
  try {
    const newTemplateId = await EmailTemplate.createTemplate({ name, subject, body });
    res.status(201).json({ status: 'success', message: 'Email template created successfully', data: { id: newTemplateId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating email template', error: error.message });
  }
};

// Memperbarui template email
exports.updateEmailTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, subject, body } = req.body;
  try {
    await EmailTemplate.updateTemplate(id, { name, subject, body });
    res.status(200).json({ status: 'success', message: 'Email template updated successfully' });
  } catch (error) {
    res.status(error.message === 'Template not found' ? 404 : 500).json({ status: 'error', message: 'Error updating email template', error: error.message });
  }
};

// Menghapus template email
exports.deleteEmailTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    await EmailTemplate.deleteTemplate(id);
    res.status(200).json({ status: 'success', message: 'Email template deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Template not found' ? 404 : 500).json({ status: 'error', message: 'Error deleting email template', error: error.message });
  }
};
