import { MenuIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role, theme = 'blue'}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // role-specific links
  const links = {
    admin: [
      { to: '/admin/courts', label: 'Manage Courts' },
      { to: '/admin/bookings', label: 'Manage Bookings' },
      { to: '/admin/manageCustomers', label: 'Manage Customers' },
      { to: '/admin/manageStaffs', label: 'Manage Staff' },
    ],

    staff: [
      { to: '/staff/customers', label: 'Manage Customers' },
      { to: '/staff/bookings', label: 'Manage Bookings' },
      { to: '/staff/analytics', label: 'Analytics' },
      { to: '/staff/court-availability', label: 'Court Availability' },
    ],

    customer: [
      { to: '/customer/courts', label: 'Courts' },
      { to: '/customer/myBookings', label: 'My Bookings' },
      { to: '/customer/courtAvailability', label: 'Court Availability' },
    ]
  };

  // themes for different roles
  const themes = {
    blue: 'bg-blue-800 text-white hover:bg-blue-700',
    green: 'bg-green-800 text-white hover:bg-green-700',
    purple: 'bg-purple-800 text-white hover:bg-purple-700',
  };



  return (
    <div
      className={classNames(
        'fixed top-0 left-0 h-full transition-all duration-300 ease-in-out',
        themes[theme],
        {
          'w-64': !isCollapsed,
          'w-16': isCollapsed,
        }
      )}
    >
      <div className="p-4 flex justify-end">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="focus:outline-none"
          aria-label={isCollapsed ? 'Exapnd Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <MenuIcon className="h-6 w-6" /> : <XIcon className="h-6 w-6" />}
        </button>
      </div>
      <div className="p-4">
        {!isCollapsed && (
          <h2 className="text-xl font-bold">{role.charAt(0).
          toUpperCase() + role.slice(1)} Dashboard</h2>
        )}
        <nav>
          <ul>
            {links[role]?.map((link) => (
              <li key={link.to} className="mb-2">
                <NavLink
                  to={link.to}
                  // className="flex items-center p-2 rounded
                  // hover:bg-opacity-75"
                  // activeClassName="bg-opacity-75"
                  className={({ isActive }) => 
                    classNames(
                      'flex items-center p-2 rounded hover:bg-opacity-75',
                      { 'bg-opacity-75': isActive }
                    )
                  }
              >
                  <span className={isCollapsed ? 'hidden' : 'ml-2'}>
                    {link.label}
                  </span>
              </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar