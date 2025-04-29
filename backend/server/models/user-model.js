const { pool }  = require("../config/db");

const createUser = async (username,  fullName, email, password, phoneNumber, { client } = {}) => {
  const db = client || pool;
  const query = `
    INSERT INTO users (username, full_name, email, password_hash, phone_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, email, created_at
  `;
  const result = await db.query(query, [username, fullName, email, password, phoneNumber]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};

const getUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);
  return result.rows[0];
};

const getUserByEmail = async (email, { client } = {}) => {
  const db = client || pool;
  const result = await db.query(
    'SELECT email, password_hash FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

const assignUserRole = async (userId, roleName, { client }) => {
  const db = client || pool;

  // checks if the role exists
  const role = await db.query(
    'SELECT role_id FROM roles WHERE role_name = $1', [roleName]
  );

  if (!role.rows[0]) throw new Error(`Role "${roleName}" not found`);
  
  // const roleId = role.rows[0].role_id;
  
  // assign the role
  const insertQuery =`
  INSERT INTO user_roles (user_id, role_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
  RETURNING role_id
  `;

  const result = await db.query(insertQuery, [userId, role.rows[0].role_id]);
  // console.log('Insert result:', result);
  
  return result.rows[0]?.role_id ? roleName : null;
}

const getUserByEmailWithRoles = async (email) => {
  const query = `
    SELECT u.*, 
    COALESCE(array_agg(r.role_name) FILTER (WHERE R.ROLE_NAME IS NOT NULL), '{}') as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.email = $1
    GROUP BY u.user_id
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0]; // return the first user or undefined
};

const getUserWithRolesById = async (userId) => {
  const query = `
    SELECT u.*, array_agg(r.role_name) as roles
    FROM  users u
    LEFT JOIN user_roles ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.user_id = $1
    GROUP BY u.user_id
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0] || null; // returns 'null' if user not found
};

// update user
const allowedFields = ["username", "fullName", "email", "phoneNumber"]; 
const updateUser = async (userId, updates) => {
  const fields = [];
  const values = [];
  let counter = 1;

  for (const [key, value] of Object.entries(updates)) {
    // Validate field names and values
    if (!allowedFields.includes(key)) { 
      throw new Error(`Invalid field: ${key}`);
    }
    if (value === undefined || value === null) {
      throw new Error(`Field "${key}" cannot be empty`);
    }
    
    const dbColumn = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    fields.push(`${dbColumn} = $${counter}`);
    values.push(value);
    counter++;
  }

  if (fields.length === 0) {
    throw new Error("No valid fields to update");
  }

  values.push(userId);

  const updateQuery = `
    UPDATE users
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $${counter}
    RETURNING *
  `;

  const updateResult = await pool.query(updateQuery, values);

  // check if any rows were updated
  if (updateResult.rowCount === 0) {
    throw new Error("User not found");
  }

  const updatedUser = updateResult.rows[0];

  // Fetch the user's roles
  const rolesQuery = `
    SELECT r.role_name
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.role_id
    WHERE ur.user_id = $1
  `;

  const rolesResult = await pool.query(rolesQuery, [userId]);
  const roles = rolesResult.rows.map(row => row.role_name);

  // combine user data and roles
  // const updatedUser = {
  //   ...updateUser.rows[0],
  //   roles
  // };
  return { ...updatedUser, roles };

  // const fullUser = await getUserWithRolesById(userId);
  // return fullUser;
};

const deleteUser = async (userId) => {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [userId]
  );

  if (result.rowCount === 0) {
    throw new Error(`User role "${roleName}" not found`);
  }

  return result.rows[0];
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

const getUsersByRole = async (roleName) => {
  const query = `
    SELECT u.*, COALESCE(array_agg(r.role_name) FILTER (WHERE r.role_name IS NOT NULL), '{}') as roles
    FROM users u
    JOIN user_roles ur ON u.user_id = ur.user_id
    JOIN roles r ON ur.role_id = r.role_id
    WHERE r.role_name = $1
    GROUP BY u.user_id
  `;

  const result = await pool.query(query, [roleName]);
  return result.rows;
};

const updateUserRoles = async (userId, roleNames) => {
  await pool.query('SELECT FROM user_roles WHERE user_id = $1', [userId]);

  for (const roleName of roleNames) {
    const role = await pool.query('SELECT role_id FROM roles WHERE role_name =$1', [roleName]);
    if (role.rowCount === 0) {
      throw new Error(`Role "${roleName}" not found`);
    }
    const roleId = role.rows[0].role_id;
    await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  assignUserRole,
  getUserByEmailWithRoles,
  getUserWithRolesById,
  updateUser,
  deleteUser,
  getAllUserWithRoles,
  getUsersByRole,
  updateUserRoles
};
