const cron = require('node-cron');
const { allModels } = require("../models")

// cron.schedule("0 0 * * *", async () => { // runs daily at midnight
//     try {
//         await allModels.tokenBlacklistModel.cleanExpiredTokens();
//         // await allModels.tokenBlacklist.cleanExpiredTokens();
//     } catch (error) {
//         console.error("Token cleanup failed:", error);
//     }
// });

// this function ensures tokens are deleted automatically.
const cleanUpExpiredTokens = async () => {
    try {
        console.log("Running token cleanup job");
        await allModels.tokenBlacklist.cleanExpiredTokens();
        console.log("Expired tokens removed.");
    } catch (error) {
        console.error("Error in token cleanup job:", error);    }
};

cron.schedule("0 0 * * *", cleanUpExpiredTokens);

module.exports = cleanUpExpiredTokens;