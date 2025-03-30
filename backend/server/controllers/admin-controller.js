const { allModels } = require("../models");
const handleResponse = require("../utils/handleResponse");

const assignAdminRole = async (req, res) => {
    try {
        const { userId } = req.body;

        const roleResult = await allModels.roleModel.getRoleByName('owner');
        const roleId = roleResult.role_id;

        await allModels.userModel.assignUserRole(userId, roleId);

        handleResponse(res, 200, 'Admin role assigned successfully')
    } catch (error) {
        console.error('Assign admin role error:', error);
        handleResponse(res, error.statuCode || 500, error.message || 'Internal server error'); 
    }
};

const getAdminDashboard = async (req, res) => {
    try {
        res
        .status(200)
        .send("hello welcome to admin page using controller");

    } catch (error) {
        console.error("Error in admin controller:", error);
        res.status(500).send("Internal Server Error");
    }
};

// const getAllUsers = async (req, res, next) => {
//     try {
//         const users = await allModels.userModel.getAllUsers();
//         handleResponse(res, 200, "User fetch successfully", users);
//     } catch (error) {
//         next(error);
//     }
// };


module.exports = {
    assignAdminRole,
    getAdminDashboard,
    // getAllUsers
}