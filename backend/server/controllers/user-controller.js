const { pool }  = require("../config/db");

const { allModels } = require("../models");

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

// Create a new user
const createUserController = async (req, res, next) => {
    console.log("Request body: ", req.body);
    const { username, fullName,  email, passwordHash, phoneNumber } = req.body;
    try {
        const newUser = await allModels.userModel.createUser(username, fullName, email, passwordHash, phoneNumber);
        handleResponse(res, 201, "user created successfully", newUser)
    } catch (err) {
        next(err);
    }
};

const getAllUsersController = async (req, res, next) => {
    try{
        const users = await getAllUsers();
        handleResponse(res, 200, "User fetch successfully", users);
    } catch (err) {
        next(err);
    }
};

// Get user by ID
const getUserByIdController = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE user_id = $1`, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

const updateUserController = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const updatedUser = await updateUser(req.params.id, username, email);
        if (!user) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User updated successfully", updatedUser);
    } catch (err) {
        next(err);
    }
};

const deleteUserController = async (req, res, next) => {
    try {
        const deletedUser = await deleteUser(req.params.id);
        if (!user) return handleResponse(res, 404, "User not found");
        handleResponse(res, 200, "User deleted successfully", deleteUserController)
    } catch (err) {
        next(err);
    }
};

module.exports = { createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController
 }

// Create a new user
// exports.createUser = async (req, res) => {
//   const { first_name, last_name, email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const result = await pool.query(
//       `INSERT INTO users (first_name, last_name, email, password) 
//        VALUES ($1, $2, $3, $4) RETURNING *`,
//       [first_name, last_name, email, hashedPassword]
//     );
//     res.status(201).json({ message: "User created successfully", user: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating user", error: error.message });
//   }
// };

// // Get all users
// exports.getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.query(`SELECT * FROM users`);
//     res.status(200).json({ users: result.rows });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving users", error: error.message });
//   }
// };

// // Get user by ID
// exports.getUserById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ user: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving user", error: error.message });
//   }
// };

// // Update user
// exports.updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { first_name, last_name, email } = req.body;
//   try {
//     const result = await pool.query(
//       `UPDATE users SET first_name = $1, last_name = $2, email = $3, updated_at = NOW() 
//        WHERE id = $4 RETURNING *`,
//       [first_name, last_name, email, id]
//     );
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User updated successfully", user: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating user", error: error.message });
//   }
// };

// // Delete user
// exports.deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [id]);
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully", user: result.rows[0] });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting user", error: error.message });
//   }
// };