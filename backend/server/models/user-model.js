const { pool } = require('../config/db');

const createUser = async (username, email, passwordHash, fullName, phone) => {
  const query = `
    INSERT INTO users (username, email, password_hash, full_name, phone_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, email, created_at
  `;
  const result = await pool.query(query, [username, email, passwordHash, fullName, phone]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const getUserById = async (user_id) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
  return result.rows[0];
};

const assignUserRole = async (userId, roleId) => {
  const query = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;
  return pool.query(query, [userId, roleId]);
};

const getUserByEmailWithRoles = async (email) => {
  const query = `
    SELECT u.*, array_agg(r.role_name) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.email = $1
    GROUP BY u.user_id
  `;
  return pool.query(query, [email]);
};

// update user
const allowedFields = ["username", "email"]; 
const updateUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let counter = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (!allowedFields.includes(key)) { // Validate keys
      throw new Error(`Invalid field: ${key}`);
    }
    fields.push(`${key} = $${counter}`);
    values.push(value);
    counter++;
  }

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE user_id = $${counter}
    RETURNING *
  `;
  values.push(userId);

  const result = await pool.query(query, values);
  return result.rows[0]; // Return the updated row directly
};

const deleteUser = async (user_id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [user_id]
  );
  return result.rows[0];
};

/* this is another way to CRUD model
// Create User
const createUser = async (username, email, passwordHash, fullName, phone) => {
  const query = `
    INSERT INTO users (username, email, password_hash, full_name, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING user_id, email, created_at
  `;
  const values = [username, email, passwordHash, fullName, phone];
  return pool.query(query, values);
};

// Get All Users
const getAllUsers = async () => {
  const query = 'SELECT * FROM users';
  return pool.query(query);
};

// Get User by ID
const getUserById = async (userId) => {
  const query = 'SELECT * FROM users WHERE user_id = $1';
  return pool.query(query, [userId]);
};

// Assign Role to User
const assignUserRole = async (userId, roleId) => {
  const query = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;
  return pool.query(query, [userId, roleId]);
};

// Get User by Email with Roles
const getUserByEmailWithRoles = async (email) => {
  const query = `
    SELECT u.*, array_agg(r.role_name) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.email = $1
    GROUP BY u.user_id
  `;
  return pool.query(query, [email]);
};

// Update User
const updateUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let counter = 1;

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = $${counter}`);
    values.push(value);
    counter++;
  }

  const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE user_id = $${counter}
    RETURNING *
  `;
  values.push(userId);
  
  return pool.query(query, values);
};

// Delete User
const deleteUser = async (userId) => {
  return pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [userId]);
};
*/

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  assignUserRole,
  getUserByEmailWithRoles,
  updateUser,
  deleteUser
};