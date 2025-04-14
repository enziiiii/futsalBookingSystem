import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserList from '../../../components/shared/UserList';
import UserFormModal from '../../../components/shared/UserFormModal';
import { addUser, deleteUser, fetchUsersByRole, updateUser } from '../../../reducers/userSlice';

const ManageUsers = ({ role }) => {
  console.log('ManageUsers rendered with role:', role);    // Debug
  
  const dispatch = useDispatch();
  const { usersByRole, status } = useSelector((state) => state.users);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const users = usersByRole[role] || [];    // Get users for current role 

  useEffect(() => {
    if (role && typeof role === 'string') {
      console.log('Fetching users for role:', role)  // debuging to when click shows which user
      dispatch(fetchUsersByRole({ role }));
      // console.log('Role:', role);
    } else {
      console.error('Invalid role value:', role);
    }
  }, [dispatch, role]);
  console.log('From ManageUser, Users in state:', users);    // Before rendering

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'failed') {
    return <div>Error loading users</div>;
  }

  const handleAddUser = () => {
    setCurrentUser(null);
    setShowUserFormModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    console.log('From ManageUser, user', user);
    setShowUserFormModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleSaveUser = (userData) => {
    console.log('From ManageUsers, User data to save:', userData);
    if (currentUser) {
      dispatch(updateUser({ userId: currentUser.user_id, user: userData }));
    } else {
      dispatch(addUser({ ...userData, role}))   // {...} using spread object to copy an array
    }
    setShowUserFormModal(false);
  };

  const handleCloseModal = () => {
    setShowUserFormModal(false);
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage {role === 'customer' ? 'Customers' : 'Staff'}</h2>
      <button onClick={handleAddUser} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add New {role === 'customer' ? 'Customer' : 'Staff'}</button>
      <UserList users={users} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser} />
      {showUserFormModal && (
        <UserFormModal
          user={currentUser}
          role={role}
          onSave={handleSaveUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageUsers;