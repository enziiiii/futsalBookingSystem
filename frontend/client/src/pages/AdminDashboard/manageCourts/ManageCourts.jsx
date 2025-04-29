import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteCourt, fetchCourts } from '../../../reducers/courtsSlice';


const ManageCourts = () => {
  const dispatch = useDispatch();
  const { courts, status, error } = useSelector((state) => state.courts);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  console.log('ManageCourts - courts:', courts); // Debug: Checks what courts contains

  const handleDeleteCourt = (courtId) => {
    if (window.confirm('Are you sure you want to delete this court?')) {
      dispatch(deleteCourt(courtId));
    }
  };

  if (status === 'loading') return <div>Loading...</div>
  if (status === 'failed') return <div>Error: {error}</div>


  // checks against non-array data cause my courts are in array form
  if (!Array.isArray(courts)) {
    return <div>No courts available or data format error</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text=2xl font-bold mb-4">Manage Courts</h2>
        <Link to ="/admin-dashboard/courts/add" className="bg-blue-500 text-white p-2 rounded mb-4 inline-block">Add New Court</Link>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Hourly Rate</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr key={court.court_id}>
                <td className="border p2">{court.court_id}</td>
                <td className="border p2">{court.court_name}</td>
                <td className="border p2">{court.location}</td>
                <td className="border p2">{court.hourly_rate}</td>
                <td className="border p2">{court.status}</td>
                <td className="border p2">
                  <Link to={`/admin-dashboard/courts/${court.court_id}/edit`} className="bg-yellow-500 text-white p-1 mr-2 rounded">Edit</Link>
                  <button  onClick={() => handleDeleteCourt(court.court_id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default ManageCourts