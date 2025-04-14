import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx'
import MainPage from './components/MainPage'

import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard.jsx';
import StaffDashboard from './pages/StaffDashboard/StaffDashboard.jsx';

import ManageCourts from './pages/AdminDashboard/manageCourts/ManageCourts.jsx';
import AddCourt from './pages/AdminDashboard/manageCourts/AddCourt.jsx';
import EditCourt from './pages/AdminDashboard/manageCourts/EditCourt.jsx';

import NavLayout from './components/sharedLayout/NavLayout.jsx';
import DashboardLayout from './components/sharedLayout/DashboardLayout.jsx';

import ManageCustomers from './pages/AdminDashboard/manageUsers/ManageCustomers.jsx';
import ManageStaffs from './pages/AdminDashboard/manageUsers/ManageStaffs.jsx';
import ManageUsers from './pages/AdminDashboard/manageUsers/ManageUsers.jsx';
import BookingForm from './pages/CustomerDashboard/BookingForm.jsx';
import Court from './pages/CustomerDashboard/Court.jsx';
import Payment from './pages/CustomerDashboard/Payment.jsx';




const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with NavBar (pre-login) */}
        <Route element={<NavLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>
        
        {/* Routes without navbar (post-login) */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />

        {/* , Routes with UserNav (post-login dashboards) */}
        <Route element={<DashboardLayout />}>
          {/* <Route path="/admin/profile" element={<AdminProfile />} /> */}

          <Route path="/admin/courts" element={<ManageCourts />}  />
          <Route path="admin/courts/add" element={<AddCourt />} />
          <Route path="admin/courts/:courtId/edit" element={<EditCourt />} />

          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/manageCustomers" element={<ManageCustomers />} />
          <Route path="/admin/manageStaffs" element={<ManageStaffs />} />

          {/* Customer routes */}
          <Route path="/customer/courts" element={<Court />} />
          <Route path="/customer/booking/:courtId" element={<BookingForm />} />
          <Route path="/customer/payment/:bookingId" element={<Payment />} />

          {/* Staff routes */}
          

        </Route>
      </Routes>
    </Router>
  );
};

export default App