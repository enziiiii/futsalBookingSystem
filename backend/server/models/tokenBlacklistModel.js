class TokenBlacklist {

    async tokenExists(token) {
        const query = `
            SELECT EXISTS(
                SELECT 1 FROM token_blacklist
                WHERE token = $1 LIMIT 1
            ) AS is_revoked;
        `;
        const result = await db.query(query, [token]);
        return result.rows[0].is_revoked;
    }

    async addToken(token, expiresAt) {
        // add token to blacklist
        const query = `
            INSERT INTO token_blacklist (token, expires_at)
            VALUES ($1, $2)
            ON CONFLICT (token) DO NOTHING;
        `;

        await db.query(query, [token, new Date(expiresAt * 1000).toISOString()]);
    }

    async cleanExpiredTokens() {
        const query = `
            DELETE FROM token_blacklist
            WHERE expires_at < NOW()
        `;
        await db.query(query);
    }
}

module.exports = new TokenBlacklist();