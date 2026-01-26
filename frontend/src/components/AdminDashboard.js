import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
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
    setActionLoading(bookingId);
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
      setSuccess('✅ Booking confirmed successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError(error.response?.data?.error || 'Failed to confirm booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    setActionLoading(bookingId);
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
      setSuccess('🎉 Service marked as completed!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (error) {
      console.error('Error completing booking:', error);
      setError(error.response?.data?.error || 'Failed to complete booking');
    } finally {
      setActionLoading(null);
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
      case 'Completed': return 'text-purple-600 bg-purple-100';
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
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
        </div>
        <p className="mt-4 text-gray-600 animate-pulse">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!admin) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const renderBookingsTable = (bookingsList, showActions, actionType) => (
    <div className="overflow-x-auto">
      {bookingsList.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings in this category</h3>
          <p className="text-gray-500">Bookings will appear here once customers make reservations.</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookingsList.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">{booking.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.username}</div>
                      <div className="text-sm text-gray-500">{booking.mobileNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{booking.serviceType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.vehicleModel}</div>
                  <div className="text-sm text-gray-500">{booking.vehicleType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      booking.status === 'Confirmed' ? 'bg-green-500' :
                      booking.status === 'Pending' ? 'bg-yellow-500' :
                      booking.status === 'Completed' ? 'bg-purple-500' :
                      'bg-red-500'
                    }`}></span>
                    {booking.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {actionType === 'confirm' && (
                      <button 
                        onClick={() => handleConfirmBooking(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 btn-press flex items-center space-x-1 disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>Confirm</span>
                          </>
                        )}
                      </button>
                    )}
                    {actionType === 'complete' && (
                      <button 
                        onClick={() => handleCompleteBooking(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 btn-press flex items-center space-x-1 disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Complete</span>
                          </>
                        )}
                      </button>
                    )}
                    {actionType === 'dynamic' && (
                      <>
                        {booking.status === 'Pending' && (
                          <button 
                            onClick={() => handleConfirmBooking(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 btn-press flex items-center space-x-1 disabled:opacity-50"
                          >
                            {actionLoading === booking.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Confirm</span>
                              </>
                            )}
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleCompleteBooking(booking.id)}
                            disabled={actionLoading === booking.id}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 btn-press flex items-center space-x-1 disabled:opacity-50"
                          >
                            {actionLoading === booking.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                              </svg>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Complete</span>
                              </>
                            )}
                          </button>
                        )}
                        {booking.status === 'Completed' && (
                          <span className="text-gray-400 italic flex items-center">
                            <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Done
                          </span>
                        )}
                        {booking.status === 'Cancelled' && (
                          <span className="text-gray-400 italic">Cancelled</span>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="font-medium">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-4 text-green-600 hover:text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

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
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-purple-200 text-sm">Manage all service bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white font-semibold">{admin.username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white text-opacity-90">{admin.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 btn-press flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setActiveTab('all')}
            className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer card-hover transition-all duration-300 ${activeTab === 'all' ? 'ring-2 ring-indigo-500 border-indigo-200' : 'hover:border-indigo-200'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${activeTab === 'all' ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                <svg className={`w-6 h-6 transition-colors duration-300 ${activeTab === 'all' ? 'text-white' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('pending')}
            className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer card-hover transition-all duration-300 ${activeTab === 'pending' ? 'ring-2 ring-yellow-500 border-yellow-200' : 'hover:border-yellow-200'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${activeTab === 'pending' ? 'bg-yellow-500' : 'bg-yellow-100'}`}>
                <svg className={`w-6 h-6 transition-colors duration-300 ${activeTab === 'pending' ? 'text-white' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('confirmed')}
            className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer card-hover transition-all duration-300 ${activeTab === 'confirmed' ? 'ring-2 ring-green-500 border-green-200' : 'hover:border-green-200'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${activeTab === 'confirmed' ? 'bg-green-600' : 'bg-green-100'}`}>
                <svg className={`w-6 h-6 transition-colors duration-300 ${activeTab === 'confirmed' ? 'text-white' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirmed || 0}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('completed')}
            className={`bg-white p-6 rounded-xl shadow-sm border cursor-pointer card-hover transition-all duration-300 ${activeTab === 'completed' ? 'ring-2 ring-purple-500 border-purple-200' : 'hover:border-purple-200'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-xl transition-colors duration-300 ${activeTab === 'completed' ? 'bg-purple-600' : 'bg-purple-100'}`}>
                <svg className={`w-6 h-6 transition-colors duration-300 ${activeTab === 'completed' ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center space-x-2 ${
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
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Completed ({completedBookings.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Bookings Tables */}
        <div className="bg-white rounded-xl shadow-sm border">
          {activeTab === 'all' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-indigo-800">All Bookings</h2>
                <p className="text-sm text-indigo-600">View all customer bookings</p>
              </div>
              {renderBookingsTable(bookings, true, 'dynamic')}
            </>
          )}

          {activeTab === 'pending' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-yellow-800">Pending Bookings</h2>
                <p className="text-sm text-yellow-600">Review and confirm these bookings</p>
              </div>
              {renderBookingsTable(pendingBookings, true, 'confirm')}
            </>
          )}

          {activeTab === 'confirmed' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-green-800">Confirmed Bookings</h2>
                <p className="text-sm text-green-600">Mark as complete when service is finished</p>
              </div>
              {renderBookingsTable(confirmedBookings, true, 'complete')}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              <div className="px-6 py-4 border-b border-gray-200 bg-purple-50 rounded-t-xl">
                <h2 className="text-lg font-semibold text-purple-800">Completed Bookings</h2>
                <p className="text-sm text-purple-600">History of completed services</p>
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
