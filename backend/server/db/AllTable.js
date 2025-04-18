const { pool } = require('../config/db');
const createBookingTable = require('./createBookingTable');
const createCourtTable = require('./createCourtTable');
const createPaymentTable = require('./createPaymentTable');
const createRoleTable = require("./createRoleTable");
const createTokenBlacklistTable = require('./createTokenBlacklistTable');
const createUserRoleTable = require('./createUserRoleTable');
const createUserTable = require("./createUserTable");


const initializeSchemaTable = async () => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); 

        // Reuse modular functions
        await createUserTable(client);
        await createRoleTable(client);
        await createUserRoleTable(client);
        await createTokenBlacklistTable(client);
        await createCourtTable(client);
        await createBookingTable(client);
        // await createPaymentTable(client);
   

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error('Schema initialization failed:', error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = initializeSchemaTable;