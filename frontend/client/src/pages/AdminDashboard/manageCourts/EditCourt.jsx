import React, { useEffect, useState } from 'react'
import { updateCourt } from '../../../reducers/courtsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


const EditCourt = () => {
  const { courtId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courts } = useSelector((state) => state.courts);
  const court = courts.find((c) => c.court_id === parseInt(courtId));


  const [courtName, setCourtName] = useState(court ? court.court_name : '');
  const [location, setLocation] = useState(court ? court.location : '');
  const [hourlyRate, setHourlyRate] = useState(court ? court.hourly_rate : 0);
  const [status, setStatus] = useState(court ? court.status : 'available');

  useEffect(() => {
    if (!court) {
      navigate('/admin/courts');
    }
  }, [court, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const courtData = {court_name: courtName, location, hourly_rate: Number(hourlyRate), status };
    await dispatch(updateCourt({ courtId: parseInt(courtId), courtData })).unwrap();
    navigate('/admin-dashboard/courts');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Court</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="courtName" className="block text-gray-700">Court Name</label>
          <input
            type="text"
            id="courtName"
            value={courtName}
            onChange={(e) => setCourtName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="hourlyRate" className="block text-gray-700">Hourly Rate</label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-gray-700">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="available">Available</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" className="w-52 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCourt