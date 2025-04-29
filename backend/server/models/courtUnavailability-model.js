const { pool } = require("../config/db");

class CourtUnavailabilityModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    async addUnavailability(courtId, startTime, endTime, reason, createdBy) {
        try {
            const query = `
            INSERT INTO court_unavailability (court_id, start_time, end_time, reason, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $5)
            RETURNING *;
            `;

            const result = await this.pool.query(query, [courtId, startTime, endTime, reason, createdBy]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Failed to create addUnavailability ${error.message}`);
        }
    }

    async getUnavailabilityByCourt(courtId) {
        try {
            const query = `
            SELECT * FROM court_unavailability WHERE court_id = $1 ORDER BY start_time;
            `;

            const result = await this.pool.query(query, [courtId]);
            return result.rows;
        } catch (error) {
            throw new Error(`Failed to get unavailable court ${error.message}`);
        }
    }

    async updateUnavailability(unavailabilityId, updates, updatedBy) {
        const fields = [];
        const values = [];
        let counter = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (['start_time', 'end_time', 'reason'].includes(key)) {
                fields.push(`${key} = $${counter}`);
                values.push(value);
                counter++;
            }
        }

        values.push(updatedBy, unavailabilityId);
        const query =`
        UPDATE court_unavailability
        SET ${fields.join(",")}, updated_at = CURRENT_TIMESTAMP, updated_by = $${counter}
        WHERE unavailability_id = $${counter + 1}
        RETURNING *;
        `;

        const result = await this.pool.query(query, values);
        return result.rows[0];
    };


    async deleteUnavailability(unavailabilityId) {
        const query =`
        DELETE FROM court_unavailability WHERE unavailability_id = $1 RETURNING *;
        `;

        const result = await this.pool.query(query, [unavailabilityId]);
        return result.rows[0];
    };

};

module.exports = new CourtUnavailabilityModel(pool);
