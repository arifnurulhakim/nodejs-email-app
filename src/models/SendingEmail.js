const knex = require('knex')(require('../../knexfile'));

const dbPrefix = process.env.DB_PREFIX || '';
const tableName = `${dbPrefix}sending_emails`;

class SendingEmail {
    static async create(data) {
        try {
            const [newId] = await knex(tableName).insert(data).returning('id');
            return newId;
        } catch (error) {
            throw new Error(`Error creating sending email: ${error.message}`);
        }
    }

    static async updateStatus(id, isSent) {
        try {
            await knex(tableName).where({ id }).update({ is_sent: isSent });
        } catch (error) {
            throw new Error(`Error updating sending email status: ${error.message}`);
        }
    }

    static async getAll() {
        try {
            return await knex(tableName).select('*');
        } catch (error) {
            throw new Error(`Error fetching sending emails: ${error.message}`);
        }
    }

    static async getById(id) {
        try {
            const email = await knex(tableName).where({ id }).first();
            if (!email) {
                throw new Error('Sending email not found');
            }
            return email;
        } catch (error) {
            throw new Error(`Error fetching sending email: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            await knex(tableName).where({ id }).del();
        } catch (error) {
            throw new Error(`Error deleting sending email: ${error.message}`);
        }
    }
}

module.exports = SendingEmail;
