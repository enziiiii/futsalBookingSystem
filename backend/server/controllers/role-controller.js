const { allModels } = require("../models");
const handleResponse = require("../utils/handleResponse");
const { getUsersByrole, getUsersByRole } = require('../models/role-model');

const assignUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleName } = req.body;

        // await pool.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);

        await allModels.userModel.assignUserRole(userId, roleName);
        handleResponse(res, 200, 'Role assigned successfully');
    } catch (error) {
        handleResponse(res, 500, 'Error assigning role', error);
    }
};

const getUserRoles = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await allModels.userModel.getUserWithRolesById(userId);

        if (!user) {
            return handleResponse(res, 404, 'user not found');
        }

        handleResponse(res, 200, 'Roles retrieved', {
            roles: user.roles || []
        });
    } catch (error) {
        handleResponse(res, 500, 'Error retrieving roles', error);
    };
};


const getUsersByRoleController = async (req, res, next) => {
    console.log('Controller reached');
    const { role } = req.query;
    console.log('From roleController, Fetching users with role:', role);  // debug

    try {
        let users;
        if (role) {
            users = await getUsersByRole(role);
        } else {
            users = await allModels.roleModel.getAllUserWithRoles();
        }
    
        console.log('Controller response:', users);
        if (!users || users.length === 0) {
            // return res.status(200).json({ status: 200, message: "No users found for this role", data: [] });
            return handleResponse(res, 200, "No users found for this role", []);
        }

            res.status(200).json({ status: 200, message: "users fetched successfully", data: users });
        // handleResponse(res, 200, "users fetched successfully", users);
    } catch (err) {
        console.error('Error in getUserByRoleController:', err);
        next(err);
    }
};

module.exports = {
    assignUserRole,
    getUserRoles,
    getUsersByRoleController
}