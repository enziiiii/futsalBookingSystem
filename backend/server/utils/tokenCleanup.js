const { allModels } = require("../models")

cron.schedule("0 0 * * * ", async () => { // runs daily at midnight
    try {
        await allModels.tokenBlacklist.cleanExpiredTokens();
    } catch (error) {
        console.error("Token cleanup failed:", error);
    }
});