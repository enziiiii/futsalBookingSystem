const { pool }  = require("../config/db");

const { allModels } = require("../models");
const passwordService = require("../services/passwordService");
const handleResponse = require("../utils/handleResponse");


/* -- i moved this handleResponse function to utils so everybody can access it with ease --//
// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};
*/

// Create a new user
const createUserController = async (req, res, next) => {
    console.log("Request body: ", req.body);
    const { username, fullName,  email, password, phoneNumber } = req.body;

   if (!username || !fullName || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
   }

    try {
        const newUser = await allModels.userModel.createUser(username, fullName, email, password, phoneNumber);
        handleResponse(res, 201, "user created successfully", newUser)
    } catch (err) {
        next(err);
    }
};

// const getAllUsersController = async (req, res, next) => {
//     try{
//         const users = await allModels.userModel.getAllUsers();
//         handleResponse(res, 200, "User fetch successfully", users);
//     } catch (err) {
//         next(err);
//     }
// };

// Get user by ID
const getUserByIdController = async (req, res, next) => {
  const { userId } = req.params;

  // check is 'useId' is a number
  if (isNaN(userId)) {
    return res.status(400).json({
        message: "Invalid user ID format" 
    });
  }
  
  try {
    const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);

    if (result.rows.length === 0) {
        return handleResponse(res, 404, "User not found");
    }

    handleResponse(res, 200, "User fetched sucessfully", result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (req, res, next) => {
    // const { username, email } = req.body;
    try {
        // console.log('Received:', req.body);
        // console.log("user from token:", req.user);
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return handleResponse(res, 400, "invalid user Id");
        }

        if (!req.user.roles.includes('admin') && req.user.user_id !== userId) {
            return handleResponse(res, 403, 'Forbidden: You can only update your own profile or must be an admin');
        }

        if (req.user.roles.includes('staff') && req.method === 'PUT') {
            return handleResponse(res, 403, 'Staff cannot ADD users');
        }

        const updatedUser = await allModels.userModel.updateUser(userId, req.body);
        if (!updatedUser) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User updated successfully", updatedUser);
    } catch (err) {
        next(err);
    }
};

const deleteUserController = async (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
        return handleResponse(res, 400, "Invalid user ID");
    }
    try {
        const deletedUser = await allModels.userModel.deleteUser(userId);
        // if (!deletedUser) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User deleted successfully", deletedUser);
    } catch (err) {
        next(err);
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.userId;

        await passwordService.changePassword(userId, oldPassword, newPassword);

        handleResponse(res, 200, 'Password change successfully');
    } catch (error) {
        console.error('Change password error:', error);
        handleResponse(res, error.statusCode || 500, error.message || 'Internal server error');
    }
};

const getAllUsersController = async (req, res, next) => {
    try {
        const { role } = req.query;
        let users;
        if (role) {
            users = await allModels.userModel.getUsersByRole(role);
        } else {
            users = await allModels.userModel.getAllUserWithRoles();
        }
        handleResponse(res, 200, "Users fetch successfully", users);
    } catch (err) {
        next(err);
    }
}

const updateUserRoles = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            return handleResponse(res, 400, 'Invalid user ID');
        }

        const { roles } = req.body;
        if (!roles || !Array.isArray(roles) || roles.length === 0) {
            return handleResponse(res, 400, 'Roles must be a non-empty array');
        }

        const validRoles = ['customer', 'staff'];
        if (!roles.every(role => validRoles.includes(role))) {
            return handleResponse(res, 400, 'Invalid role specified');
        }

        const user = await allModels.userModel.getUserById(userId);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }

        await allModels.userModel.updateUserRoles(userId, roles);
        const updatedUser = await allModels.userModel.getUserWithRolesById(userId);
        handleResponse(res, 200, 'User roles updated successfully', updatedUser);
    } catch (err) {
        next (err);
    }
};


module.exports = { 
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    changePassword,
    getAllUsersController,
    updateUserRoles
 }