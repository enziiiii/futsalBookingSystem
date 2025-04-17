const { pool } = require('../config/db');

const getRoleByName = async (roleName) => {
  const query = 'SELECT * FROM roles WHERE role_name = $1';
  const { rows: [role] } = await pool.query(query, [roleName]);
  return role;
};

const getAllUserWithRoles = async () => {
  const query = `
    SELECT u.*, COALESCE(array_agg(r.role_name) FILTER (WHERE r.role_name is NOT NULL), '{}') as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LFFT JOIN roles r ON ur.role_id = r.role_id
    GROUP BY u.user_id
  `;

  const result = await pool.query(query);
  return result.rows;
};

// const getUsersByRole = async (roleName) => {
//   const query = `
//   SELECT u.user_id, u.username, u.email, array_agg(r.role_name) AS roles
//   FROM users u
//   LEFT JOIN user_roles ur ON u.user_id = ur.user_id
//   LEFT JOIN roles r ON ur.role_id = r.role_id
//   GROUP BY u.user_id, u.username, u.email
//   `;

//   const result = await pool.query(query, [roleName]);
//   console.log(`Users with role ${roleName}:`, result.rows);  // Debug
//   return result.rows;   // returns an array of users with specified role
// };

// const getUsersByRole = async (roleName) => {
//   const query = `
//   SELECT u.user_id, u.username, u.full_name, u.email, u.password_hash, u.phone_number, u.token_version, u.created_at, u.updated_at,
//            array_agg(r.role_name) AS roles
//     FROM users u
//     JOIN user_roles ur ON u.user_id = ur.user_id
//     JOIN roles r ON ur.role_id = r.role_id
//     WHERE r.role_name = $1
//     GROUP BY u.user_id, u.username, u.full_name, u.email, u.password_hash, u.phone_number, u.token_version, u.created_at, u.updated_at;
//   `;

//   const result = await pool.query(query, [roleName]);
//   console.log(`From role-model, Users with role ${roleName}:`, result.rows);  // Debug
//   return result.rows;   // returns an array of users with specified role
// };

const getUsersByRole = async (roleName) => {
  console.log('Model reached, role:', roleName);
  const query = `
    SELECT u.user_id, u.Username, u.full_name, u.email, u.password_hash, u.phone_number, u.token_version, u.created_at, u.updated_at,
          array_agg(r.role_name) AS roles
    FROM users u
    JOIN user_roles ur ON u.user_id = ur.user_id
    JOIN roles r ON ur.role_id = r.role_id
    WHERE r.role_name = $1
    GROUP BY u.user_id, u.username, u.full_name, u.email, u.password_hash, u.phone_number, u.token_version, u.created_at, u.updated_at
  `;
  try {
    const result = await pool.query(query, [roleName]);
    console.log(`From role-model, Users with role ${roleName}:`, result.rows);
    return result.rows;
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};

// const getUsersByRole = async (roleName) => {
//   const query = `
//     SELECT u.*, COALESCE(array_agg(r.role_name) FILTER (WHERE r.role_name IS NOT NULL), '{}') as roles
//     FROM users u
//     JOIN user_roles ur ON u.user_id = ur.user_id
//     JOIN roles r ON ur.role_id = r.role_id
//     WHERE r.role_name = $1
//     GROUP BY u.user_id
//   `;
//   const result = await pool.query(query, [roleName]);
//   return result.rows;
// };


module.exports = {
  getRoleByName,
  getUsersByRole,
  getAllUserWithRoles
  
};