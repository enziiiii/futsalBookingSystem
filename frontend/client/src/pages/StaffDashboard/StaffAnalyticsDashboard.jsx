import React, { useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAnalyticData, resetAnalytics } from '../../reducers/analyticsSlice';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { useParams } from 'react-router-dom';
import { fetchStaffCourts } from '../../reducers/courtsSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StaffAnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { analyticsData, status, analyticsError } = useSelector((state) => state.analytics);
  const { courts, loading, error } = useSelector((state) => state.courts);
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [analyticType, setAnalyticType] = useState('bookings'); // default type booking

  useEffect(() => {
    dispatch(fetchStaffCourts());
  }, [dispatch]);

  // analytics
  useEffect(() => {
    if (selectedCourtId) {
      dispatch(fetchAnalyticData({ courtId: selectedCourtId, type: analyticType}));
    }
    return () => {
      dispatch(resetAnalytics());
    };
  }, [dispatch, selectedCourtId, analyticType]);

  console.log("Analytics Data:", analyticType)

  // courts
  useEffect(() => {
    if (Array.isArray(courts) && courts.length > 0 && !selectedCourtId) {
      setSelectedCourtId(courts[0].court_id); // Auto-select first court
    }
  }, [courts, selectedCourtId]);


  if (loading === 'loading') return <div>Loading courts...</div>;
  if (loading === 'failed') return <div>Error loading courts: {error?.message || error}</div>;
  if (courts.length === 0) return <div>No courts assigned to this staff</div>;

  
  // checks if the data is still loading or id there's an error
  if (status === 'loading')  return <div>Loading...</div>;
  if (status == 'failed') return <div>{error}</div>;
  if (status === 'succeeded' && (!analyticsData || analyticsData.length === 0)) {
    return <div>No analytic data available for this court</div>;
  }

  // Prepares chart data
  const chartData = {
    labels: analyticsData.map((item) =>
      new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' })
    ),
    datasets: [
      {
        label: analyticType === 'bookings' ? 'Total Bookings':
        analyticType === 'revenue' ? 'Revenue (Rs)' : 'Total Hours',
        data: analyticsData.map((item) => 
          analyticType === 'bookings' ? Number(item.total_bookings|| 0) :
          analyticType === 'revenue' ? Number(item.total_revenue || 0) :
           Number(item.total_hours || 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  console.log("data:", courts);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="mb-4">
        <label htmlFor="courtSelect" className="mr-2">Select Court:</label>
        <select
          id="courtSelect"
          value={selectedCourtId}
          onChange={(e) => setSelectedCourtId(e.target.value)}
          className="p-2 border rounded"
        >
          {courts.map((court) => (
            <option key={court.court_id} value={court.court_id}>
              {court.court_name}
            </option>
          ))}
        </select>
        <label htmlFor="analyticType" className="ml-4 mr-2">Analytic Type:</label>
        <select
          id="analyticType"
          value={analyticType}
          onChange={(e) => setAnalyticType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="bookings">Bookings</option>
          <option value="revenue">Revenue</option>
          <option value="court-utilization">Court Utilization</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">
          {courts.find(c => c.court_id === selectedCourtId)?.court_name} - 
          {analyticType === 'bookings' ? 'Monthly Bookings' : analyticType === 'revenue' ? 'Monthly Revenue' : 'Court Utilization'}
        </h3>
        <Bar data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default StaffAnalyticsDashboard