import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { fetchCourtsForCustomer } from '../../reducers/courtsSlice';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Wrench, Clock } from 'lucide-react';
import clsx from 'clsx';


const Court = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const courts = useSelector((state) => state.courts.courts);
  const loading = useSelector((state) => state.courts.loading);
  const error = useSelector((state) => state.courts.error);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchCourtsForCustomer());
  }, [dispatch]);

  const handleBookCourt = (courtId) => {
    navigate(`/customer/booking/${courtId}`);
  };

  const statusStyles = {
    available: {
      color: 'text-green-600',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    booked: {
      color: 'text-yellow-600',
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
    },
    closed: {
      color: 'text-red-600',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    maintenance: {
      color: 'text-blue-600',
      icon: <Wrench className="w-5 h-5 text-blue-600" />,
    },
  };

  if (loading === 'pending') {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-700">
        Loading courts...
      </div>
    );
  }

  if (loading === 'failed') {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Error loading courts: {error || 'Unknown error'}
      </div>
    );
  }

  const filteredCourts = courts.filter((court) => {
    if (filter === 'all') return true;
    return court.status === filter;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-400 via-stone-800 to-slate-100 px-6 py-10">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight mb-4 sm:mb-0">
          Discover Our Courts
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Courts</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="closed">Closed</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Court Cards */}
      {filteredCourts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {filteredCourts.map((court, index) => {
            const status = court.status.toLowerCase();
            const { icon, color } = statusStyles[status] || {};

            return (
              <motion.div
                key={court.court_id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image */}
                {court.court_image_url ? (
                  <img
                    src={court.court_image_url}
                    alt={court.court_name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-60 bg-slate-200 flex justify-center items-center text-slate-500 text-sm">
                    No image available
                  </div>
                )}

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800">{court.court_name}</h2>
                    <div className="flex items-center gap-1">
                      {icon}
                      <span className={clsx('text-sm font-medium capitalize', color)}>{status}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Location: {court.location || 'N/A'}
                  </p>

                  {status === 'available' && (
                    <button
                      onClick={() => handleBookCourt(court.court_id)}
                      className="mt-4 bg-blue-600 text-white py-2 px-5 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-slate-500 mt-10">No courts match the selected filter.</p>
      )}
    </div>
  );
};

export default Court;

// const Court = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const courts = useSelector((state) => state.courts.courts);
//   const loading = useSelector((state) => state.courts.loading);
//   const error = useSelector((state) => state.courts.error);
//   // console.log('Error:', error);
  
//   // filter state
//   const [filter, setFilter] = useState('all');


//   useEffect(() => {
//     dispatch(fetchCourtsForCustomer());
//   }, [dispatch]);

//   const handleBookCourt = (courtId) => {
//     navigate(`/customer/booking/${courtId}`);
//   };


//   if (loading === 'pending') return <p>Loading...</p>;
//   if (loading === 'failed') return <p>Error loading courts: {error || 'Unkown error'}</p>;

//   // filter courts based on the selected filter
//   const filteredCourts = courts.filter((court) => {
//     if (filter == 'all') return true;
//     return court.status === filter;
//   });


//   return (
//     <div className="space-y-6">
//       <div style={{ marginBottom: '10px' }}>
//         <label>Filter by status: </label>
//         <select value={filter} onChange={(e) => setFilter(e.target.value)}>
//           <option value="all">All</option>
//           <option value="available">Available</option>
//           <option value="booked">Booked</option>
//           <option value="closed">Closed</option>
//           <option value="maintenance">Maintenace</option>
//         </select>
//       </div>
//       <ul>
//         {filteredCourts.length > 0 ? (
//           filteredCourts.map(court => (
//             <li key={court.court_id}>
//               {court.court_name} - Status: {court.status}
//               {court.status === 'available' && (
//                 <button onClick={() => handleBookCourt(court.court_id)}>Book Now</button>
//               )}
//             </li>
//           ))
//       ) : (
//         <p>No courts available</p>
//       )}
//       </ul>
//     </div>
//   );
// };

// export default Court;