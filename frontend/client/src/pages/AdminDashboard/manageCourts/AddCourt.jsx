import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addCourt } from '../../../reducers/courtsSlice';

const AddCourt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [courtName, setCourtName] = useState('');
  const [location, setLocation] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [status, setStatus] = useState('available');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courtData = { court_name: courtName, 
        location, 
        hourly_rate: Number(hourlyRate), 
        status,
        // owner_id: 'A1'
      };

    await dispatch(addCourt(courtData)).unwrap();
    navigate('/admin/courts');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Court</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="courtName" className="block text-gray-700">Court Name</label>
          <input 
            type="text"
            id="courtname"
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
              required
          >   
              <option value="booked">Booked</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
          </select>
        </div>
        <button type="submit" className="w-52 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Add court</button>
      </form>
    </div>
  );
};

export default AddCourt