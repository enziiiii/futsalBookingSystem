const { pool } = require('../config/db');

const getRoleByName = async (roleName) => {
  const query = 'SELECT * FROM roles WHERE role_name = $1';
  const { rows: [role] } = await pool.query(query, [roleName]);
  return role;
};



module.exports = {
  getRoleByName
};