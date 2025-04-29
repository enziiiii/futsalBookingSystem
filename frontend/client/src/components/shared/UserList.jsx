// UserList is a reusable component that display a list of users.

import React from 'react'

const UserList = ({ users, onEditUser, onDeleteUser }) => {
    const handleDelete = (userId) => {
        onDeleteUser(userId);
    };

  return (
    <table className="w-full border-collapse border">
        <thead>
            <tr>
                <th className="border p-2">UserName</th>
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Phone Number</th>
                
                <th className="border p-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {/* safety checks */}
            {Array.isArray(users) && users.length > 0 ? (
                 users.map((user) => (
                    <tr key={user.user_id} className="border-t">
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.full_name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">
                            {user.roles 
                            ? user.roles.join(', ') 
                            : 'No roles assigned'}
                        </td>
                        <td className="border p-2">{user.phone_number}</td>
                        <td className="border p-2">
                            <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => onEditUser(user)}>Edit</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(user.user_id)}>Delete</button>
                        </td>
                    </tr>
                ))
            ) : ( 
                <tr>
                    <td colSpan="5" className="text-center py-4">
                        No users found
                    </td>
                </tr>
            )}
        </tbody>
    </table>
  );
};

export default UserList