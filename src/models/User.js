const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}users`;

const excludedColumns = ['password'];
const getAllColumns = async () => {
  const columns = await knex(tableName).columnInfo();
  return Object.keys(columns).filter(col => !excludedColumns.includes(col));
};


const User = {
  getAll: async () => {
    try {
      const columns = await getAllColumns();
      return await knex(tableName).select(columns);
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },
  getAllusername: async () => {
    try {
      return await knex(tableName).select('*');
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },
  getAllemail: async () => {
    try {
      return await knex(tableName).select('*');
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const columns = await getAllColumns();
      return await knex(tableName).select(columns).where({ id }).first();
    } catch (error) {
      throw new Error(`Error fetching user with ID ${id}: ${error.message}`);
    }
  },
  getByUsername: async (username) => {
    try {
      const columns = await getAllColumns();
      return await knex(tableName).select(columns).where({ username }).first();
    } catch (error) {
      throw new Error(`Error fetching user with username ${username}: ${error.message}`);
    }
  },

  create: async (userData) => {
    try {
      return await knex(tableName).insert(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  },

  update: async (id, userData) => {
    try {
      return await knex(tableName).where({ id }).update(userData);
    } catch (error) {
      throw new Error(`Error updating user with ID ${id}: ${error.message}`);
    }
  },
  delete: async (id) => {
    try {
      return await knex(tableName).where({ id }).del();
    } catch (error) {
      throw new Error(`Error deleting user with ID ${id}: ${error.message}`);
    }
  },
  // Di model User.js
getByAll: async (email) => {
  try {
    const columns = await getAllColumns();
    return await knex(tableName).select(columns).where({ email }).first();
  } catch (error) {
    throw new Error(`Error fetching user with email ${email}: ${error.message}`);
  }
},

savePasswordResetToken: async (id, token, expires) => {
  try {
    return await knex(tableName).where({ id }).update({ resetToken: token, resetTokenExpires: expires });
  } catch (error) {
    throw new Error(`Error saving password reset token for user ID ${id}: ${error.message}`);
  }
},

// Menambahkan kolom reset_token dan reset_token_expires
setResetToken: async (userId, resetToken, expires) => {
  try {
    return await knex(tableName).where({ id: userId }).update({
      reset_token: resetToken,
      reset_token_expires: expires,
    });
  } catch (error) {
    throw new Error(`Error setting reset token for user ID ${userId}: ${error.message}`);
  }
},

clearResetToken: async (userId) => {
  try {
    return await knex(tableName).where({ id: userId }).update({
      reset_token: null,
      reset_token_expires: null,
    });
  } catch (error) {
    throw new Error(`Error clearing reset token for user ID ${userId}: ${error.message}`);
  }
  },

  // Di model User.js
getByEmail: async (email) => {
  try {
    const columns = await getAllColumns();
    return await knex(tableName).select(columns).where({ email }).first();
  } catch (error) {
    throw new Error(`Error fetching user with email ${email}: ${error.message}`);
  }
},

// Simpan OTP ke pengguna
saveOtp: async (userId, otp, expires) => {
  try {
    return await knex(tableName).where({ id: userId }).update({
      otp,
      otp_expires: expires,
    });
  } catch (error) {
    throw new Error(`Error saving OTP for user ID ${userId}: ${error.message}`);
  }
},

// Hapus OTP
clearOtp: async (userId) => {
  try {
    return await knex(tableName).where({ id: userId }).update({
      otp: null,
      otp_expires: null,
    });
  } catch (error) {
    throw new Error(`Error clearing OTP for user ID ${userId}: ${error.message}`);
  }
},



  
};

module.exports = User;
