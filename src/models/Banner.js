const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}banners`;

const Banner = {
  getAll: async () => {
    return await knex(tableName);
  },

  getById: async (id) => {
    const banner = await knex(tableName).where({ id }).first();
    if (!banner) throw new Error('Banner not found');
    return banner;
  },

  create: async (bannerData) => {
    const [newBannerId] = await knex(tableName).insert(bannerData).returning('id');
    return newBannerId;
  },

  update: async (id, bannerData) => {
    const updatedRows = await knex(tableName).where({ id }).update(bannerData);
    if (updatedRows === 0) throw new Error('Banner not found');
  },

  delete: async (id) => {
    const deletedRows = await knex(tableName).where({ id }).del();
    if (deletedRows === 0) throw new Error('Banner not found');
  },
};

module.exports = Banner;
