const { allModels } = require("../models");
const handleResponse = require("../utils/handleResponse");

const assignUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleName } = req.body;

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

module.exports = {
    assignUserRole,
    getUserRoles
}