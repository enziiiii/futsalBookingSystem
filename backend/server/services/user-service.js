// const userModel = require('../models/user-model');
// const roleModel = require('../models/role-model');
// const bcrypt = require('bcrypt');

// const SALT_ROUNDS = 10;

// const registerUser = async (userData, roles = ['customer']) => {
//   // Hash password
//   const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
//   // Create user
//   const { rows: [user] } = await userModel.createUser(
//     userData.username,
//     userData.email,
//     hashedPassword,
//     userData.fullName,
//     userData.phone
//   );

//   // Assign roles
//   for (const roleName of roles) {
//     const role = await roleModel.getRoleByName(roleName);
//     if (role) {
//       await userModel.assignUserRole(user.user_id, role.role_id);
//     }
//   }

//   return getUserByEmailWithRoles(user.email);
// };

// const getUserByEmailWithRoles = async (email) => {
//   const { rows: [user] } = await userModel.getUserByEmailWithRoles(email);
//   return user;
// };

// module.exports = {
//   registerUser,
//   getUserByEmailWithRoles
// };
