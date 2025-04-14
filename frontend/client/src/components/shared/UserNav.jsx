import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

// so that navbar doesn't show up in everypages.

const UserNav = () => {
    const navigate = useNavigate();

    // Access user info from Redux store 
    const { user } = useSelector((state) => state.auth);

    // log user to see the structure and roles
    // console.log(user);

    // using .includes(' ') cause my roles are in array
    const homeRoute = user?.roles?.includes('admin') ? '/admin-dashboard' :
                    user?.roles?.includes('customer') ? '/customer-dashboard' :
                    user?.roles?.includes('staff') ? '/staff-dashboard'
                    : '/' ; // Default routes if no valid role is found


  return (
    <div className="p-4 flex justify-between items-center border-b bg-slate-500">
        <div>
            {/* home button */}
            <Link
                to={homeRoute}
                className="inline-flex bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Home
            </Link>
        </div>
        <div>
             {/* back button */}
             <button 
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back
            </button>
        </div>
    </div>
  );
};

export default UserNav;