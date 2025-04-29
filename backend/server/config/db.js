const { Pool } = require('pg');
require('dotenv').config();

let pool; // Singleton pattern

// Database connection configuration
const startPool = () => {
    if (!pool) {
        pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,

            connectionString: process.env.DATABASE_URL,
        });

        pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
        
    }
    return pool;
        
};

const connectDb = async () => {
    try {
        const client = await pool.connect(); // Get a client from the pool
        console.log('Database connection successful');
        client.release(); // Release the client back to the pool
        return true;
    } catch (err) {
        console.error('Database connection failed:', err);
        return false;
    }
};

module.exports = { 
    pool: startPool(),
    connectDb 
};
