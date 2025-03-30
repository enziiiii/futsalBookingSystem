const userModel = require("./user-model");
const roleModel = require("./role-model");
const tokenBlacklist = require("./tokenBlacklistModel");
const passwordModel = require("./password-model");
const adminModel = require("./admin-model");


const allModels = {
    adminModel,
    userModel, 
    roleModel,
    tokenBlacklist,
    passwordModel,

};

module.exports = { allModels };