import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../../../reducers/customerSlice';


const StaffManageCustomers = () => {
  // console.log('ManageUsers rendered with role:', role);
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customer.customers);
  const status = useSelector((state) => state.customer.status);
  const error = useSelector((state) => state.customer.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCustomers());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <div>Loading customers...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Customers</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Membership</th>
            <th className="py-2 px-4 border">Notifications</th>
            <th className="py-2 px-4 border">Feedback</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="py-2 px-4 border">{customer.username}</td>
              <td className="py-2 px-4 border">{customer.email}</td>
              <td className="py-2 px-4 border">{customer.membership ? customer.membership.tier : 'None'}</td>
              <td className="py-2 px-4 border">{customer.notifications ? customer.notifications.length : 0} unread</td>
              <td className="py-2 px-4 border">{customer.feedback ? customer.feedback.length : 0} submitted</td>
              <td className="py-2 px-4 border">
              <button className="text-blue-500 hover:underline mr-2">Edit</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManageCustomers