import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Load bookings and stats in parallel
      const [bookingsResponse, statsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/bookings', config),
        axios.get('http://localhost:5000/api/admin/bookings/stats', config)
      ]);

      setBookings(bookingsResponse.data);
      setStats(statsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminRole');
        navigate('/admin/signin');
      } else {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    const role = localStorage.getItem('adminRole');
    
    if (!token || !username || role !== 'admin') {
      navigate('/admin/signin');
      return;
    }
    
    setAdmin({ username });
    loadDashboardData();
  }, [navigate, loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    navigate('/');
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, 
        { status: 'Confirmed' }, 
        config
      );
      
      await loadDashboardData();
      setError('');
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError(error.response?.data?.error || 'Failed to confirm booking');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, 
        { status: 'Completed' }, 
        config
      );
      
      await loadDashboardData();
      setError('');
    } catch (error) {
      console.error('Error completing booking:', error);
      setError(error.response?.data?.error || 'Failed to complete booking');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filterBookings = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  const pendingBookings = filterBookings('Pending');
  const confirmedBookings = filterBookings('Confirmed');
  const completedBookings = filterBookings('Completed');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!admin) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const renderBookingsTable = (bookingsList, showActions, actionType) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookingsList.length === 0 ? (
            <tr>
              <td colSpan={showActions ? "6" : "5"} className="px-6 py-4 text-center text-gray-500">
                No bookings in this category
              </td>
            </tr>
          ) : (
            bookingsList.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.username}</div>
                  <div className="text-sm text-gray-500">{booking.mobileNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {booking.serviceType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.vehicleModel}</div>
                  <div className="text-sm text-gray-500">{booking.vehicleType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(booking.date)} at {booking.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {actionType === 'confirm' && (
                      <button 
                        onClick={() => handleConfirmBooking(booking.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200"
                      >
                        Confirm
                      </button>
                    )}
                    {actionType === 'complete' && (
                      <button 
                        onClick={() => handleCompleteBooking(booking.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                      >
                        Mark Complete
                      </button>
                    )}
                    {actionType === 'dynamic' && (
                      <>
                        {booking.status === 'Pending' && (
                          <button 
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleCompleteBooking(booking.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-200"
                          >
                            Mark Complete
                          </button>
                        )}
                        {booking.status === 'Completed' && (
                          <span className="text-gray-400">Done</span>
                        )}
                        {booking.status === 'Cancelled' && (
                          <span className="text-gray-400">Cancelled</span>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-opacity-90">Welcome, {admin.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-md hover:bg-opacity-30 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab('all')}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition ${activeTab === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pending')}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition ${activeTab === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('confirmed')}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition ${activeTab === 'confirmed' ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmed || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('completed')}
            className={`bg-white p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition ${activeTab === 'completed' ? 'ring-2 ring-purple-500' : ''}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending ({pendingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'confirmed'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Confirmed ({confirmedBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({completedBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Bookings Tables */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'all' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-800">All Bookings</h2>
                <p className="text-sm text-blue-600">View all customer bookings</p>
              </div>
              {renderBookingsTable(bookings, true, 'dynamic')}
            </>
          )}

          {activeTab === 'pending' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <h2 className="text-lg font-semibold text-yellow-800">Pending Bookings</h2>
                <p className="text-sm text-yellow-600">Review and confirm these bookings</p>
              </div>
              {renderBookingsTable(pendingBookings, true, 'confirm')}
            </>
          )}

          {activeTab === 'confirmed' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <h2 className="text-lg font-semibold text-green-800">Confirmed Bookings</h2>
                <p className="text-sm text-green-600">Mark as complete when service is finished</p>
              </div>
              {renderBookingsTable(confirmedBookings, true, 'complete')}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-800">Completed Bookings</h2>
                <p className="text-sm text-blue-600">History of completed services</p>
              </div>
              {renderBookingsTable(completedBookings, false, null)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
