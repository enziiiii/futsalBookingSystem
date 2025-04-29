import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx'
import Register from './components/Register.jsx';

import MainPage from './components/MainPage'

import AdminDashboard from './pages/AdminDashboard/AdminDashboard.jsx';
import CustomerDashboard from './pages/CustomerDashboard/CustomerDashboard.jsx';
import StaffDashboard from './pages/StaffDashboard/StaffDashboard.jsx';

import ManageCourts from './pages/AdminDashboard/manageCourts/ManageCourts.jsx';
import AddCourt from './pages/AdminDashboard/manageCourts/AddCourt.jsx';
import EditCourt from './pages/AdminDashboard/manageCourts/EditCourt.jsx';

import NavLayout from './components/sharedLayout/NavLayout.jsx';

import ManageCustomers from './pages/AdminDashboard/manageUsers/ManageCustomers.jsx';
import ManageStaffs from './pages/AdminDashboard/manageUsers/ManageStaffs.jsx';
import BookingForm from './pages/CustomerDashboard/BookingForm.jsx';
import Court from './pages/CustomerDashboard/Court.jsx';
import Payment from './pages/CustomerDashboard/Payment.jsx';
import MyBookings from './pages/CustomerDashboard/MyBookings.jsx';
import CourtAvailability from './pages/CustomerDashboard/CourtAvailability.jsx';
import ManageBookings from './pages/AdminDashboard/manageBookings/ManageBookings.jsx';
import StaffManageCustomers from './pages/StaffDashboard/manageUsers/StaffManageCustomers.jsx';
import StaffManageBookings from './pages/StaffDashboard/StaffManageBookings.jsx';
import StaffAnalyticsDashboard from './pages/StaffDashboard/StaffAnalyticsDashboard.jsx';
import StaffCourtAvailability from './pages/StaffDashboard/StaffCourtAvailability.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes with NavBar (pre-login) */}
        <Route element={<NavLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Routes without navbar (post-login)
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} /> */}

        {/* , Routes with UserNav (post-login dashboards) */}
        {/* <Route element={<DashboardLayout />}> */}
          {/* <Route path="/admin/profile" element={<AdminProfile />} /> */}

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="courts" element={<ManageCourts />}  />
            <Route path="courts/add" element={<AddCourt />} />
            <Route path="courts/:courtId/edit" element={<EditCourt />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="manageCustomers" element={<ManageCustomers />} />
            <Route path="manageStaffs" element={<ManageStaffs />} />
        </Route>

        {/* Customer Dashboard */}
        <Route path="/customer" element={<CustomerDashboard />}>
          <Route path="courts" element={<Court />} />
          <Route path="booking/:courtId" element={<BookingForm />} />
          <Route path="payment/:bookingId" element={<Payment />} />
          <Route path="myBookings" element={<MyBookings />} />
          <Route path="courtAvailability" element={<CourtAvailability />} />
        </Route>

        <Route path="/staff" element={<StaffDashboard />}>
          <Route path="customers" element={<StaffManageCustomers />} />
          <Route path="bookings" element={<StaffManageBookings />} />
          {/* <Route path="analytics" element={<StaffAnalyticsDashboard />} /> */}
          <Route path="analytics" element={<StaffAnalyticsDashboard />} />
          <Route path="court-availability" element={<StaffCourtAvailability />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App