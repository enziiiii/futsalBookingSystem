const { pool } = require('../config/db');

const getRoleByName = async (roleName) => {
  const query = 'SELECT * FROM roles WHERE role_name = $1';
  const { rows: [role] } = await pool.query(query, [roleName]);
  return role;
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
  getRoleByName

};