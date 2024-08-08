const knex = require('./knexfile');

(async () => {
  try {
    const db = require('knex')(knex);
    await db.raw('SELECT 1+1 AS result');
    console.log('Database connection successful!');
    await db.destroy();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
})();
