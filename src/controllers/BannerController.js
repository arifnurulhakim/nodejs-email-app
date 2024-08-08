const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs');

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.getAll();
    res.status(200).json({ status: 'success', data: banners });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching banners', error: error.message });
  }
};

exports.getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.getById(id);
    res.status(200).json({ status: 'success', data: banner });
  } catch (error) {
    res.status(error.message === 'Banner not found' ? 404 : 500).json({ status: 'error', message: 'Error fetching banner', error: error.message });
  }
};

exports.createBanner = async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ status: 'error', message: 'No image uploaded' });
  }

  // Mendapatkan ekstensi dari file yang diupload
  const fileExtension = path.extname(file.originalname);
  const imgUrl = path.join('uploads', file.filename + fileExtension); // Menyimpan dengan ekstensi

  // Memindahkan file ke nama baru dengan ekstensi
  fs.renameSync(file.path, imgUrl); // Ganti nama file yang diupload

  try {
    const newBannerId = await Banner.create({ name, img_url: imgUrl });
    res.status(201).json({ status: 'success', message: 'Banner created successfully', data: { id: newBannerId } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error creating banner', error: error.message });
  }
};


exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const file = req.file;

  let bannerData = { name };

  if (file) {
    // Mendapatkan ekstensi dari file yang diupload
    const fileExtension = path.extname(file.originalname);
    const imgUrl = path.join('uploads', file.filename + fileExtension); // Menyimpan dengan ekstensi

    // Memindahkan file ke nama baru dengan ekstensi
    fs.renameSync(file.path, imgUrl); // Ganti nama file yang diupload

    bannerData.img_url = imgUrl;
  }

  try {
    await Banner.update(id, bannerData);
    res.status(200).json({ status: 'success', message: 'Banner updated successfully' });
  } catch (error) {
    res.status(error.message === 'Banner not found' ? 404 : 500).json({ status: 'error', message: 'Error updating banner', error: error.message });
  }
};


  

exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    await Banner.delete(id);
    res.status(200).json({ status: 'success', message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Banner not found' ? 404 : 500).json({ status: 'error', message: 'Error deleting banner', error: error.message });
  }
};
