const { pool } = require('../config/db');

// Instance methods approach
class CourtModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    async createCourt(courtData) {
        try {
            const { court_name, location, hourly_rate, status } = courtData;
            const query = `
                INSERT INTO courts (court_name, location, hourly_rate, status)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
    
            const result = await this.pool.query(query, [court_name, location, hourly_rate, status]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to create court: ${error.message}`);
        }
    }

    async getAllCourts() {
        try {
            const result = await this.pool.query("SELECT * FROM courts");
            return result.rows;

        } catch (error) {
            throw new Error(`Failed to fetch courts: ${error.message}`);
        }
    }

    async getCourtById(courtId) {
        try {
            const result = await this.pool.query("SELECT * FROM courts WHERE court_id = $1", [courtId]);
            return result.rows[0];

        } catch (error) {
            throw new Error(`Failed to fetch court by ID: ${error.message}`);
        }
    }


    async updateCourt(courtId, courtData) {
        try {
            const { court_name, location, hourly_rate, status } = courtData;
            const query = `
                UPDATE courts
                SET court_name = $1, location = $2, hourly_rate = $3, status = $4, updated_at = CURRENT_TIMESTAMP
                WHERE court_id = $5
                RETURNING *
            `;

            const result = await this.pool.query(query, [court_name, location, hourly_rate, status, courtId]);
            return result.rows[0];

        } catch (error) {
            throw new Error(`Failed to update court: ${error.message}`);
        }
    }

    async deleteCourt(courtId) {
        try {
            const result = await this.pool.query("DELETE FROM courts WHERE court_id = $1 RETURNING *", [courtId]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to delete court: ${error.message}`);
        }
    }

}

module.exports = new CourtModel(pool);



/* normal approach
const createCourt = async (courtData) => {
    const { court_name, location, hourly_rate, status } = courtData;
    const query = `
        INSERT INTO courts (court_name, location, hourly_rate, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const result = await pool.query(query, [court_name, location, hourly_rate, status]);
    return result.rows[0];
};

const getAllCourts = async () => {
    const result = await pool.query("SELECT * FROM courts");
    return result.rows;
};

const getCourtById = async (courtId) => {
    const result = await pool.query("SELECT * FROM courts WHERE court_id = $1", [courtId]);
    return result.rows[0];
};

const updateCourt = async (courtId, courtData) => {
    const { court_name, location, hourly_rate, status } = courtData;
    const query = `
        UPDATE courts
        SET court_name = $1, location = $2, hourly_rate = $3, status = $4, updated_at = CURRENT_TIMESTAMP
        WHERE court_id = $5
        RETURNING *
    `;

    const result = await pool.query(query, [court_name, location, hourly_rate, status, courtId]);
    return result.rows[0];
};

const deleteCourt = async (courtId) => {
    const result = await pool.query("DELETE FROM courts WHERE court_id = $1 RETURNING *", [courtId]);
    return result.rows[0];
};

module.exports = { 
    createCourt,
    getAllCourts,
    getCourtById,
    updateCourt,
    deleteCourt

}
    */