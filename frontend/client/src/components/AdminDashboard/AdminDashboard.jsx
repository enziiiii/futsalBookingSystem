import React from 'react'
import { Link } from 'react-router-dom';


const AdminDashboard = () => {
  return (
    <div>
      <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>          
          <ul>
            <li><Link to="/admin/profile" className="block py-2">Profile</Link></li>
            <li><Link to="/admin/courts" className="block py-2">Manage courts</Link></li>
            <li><Link to="/admin/users"  className="block py-2">Manage users</Link></li>
            <li><Link to="/admin/logOut" className="block py-2">Log Out</Link></li>

          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
          <p> Welcome to Admin! Below are courts and user manangement</p>
      </main>
    </div>
    </div>
    
  );
};

export default AdminDashboard
