import { useState, useEffect } from 'react';
import { recommendationAPI, friendAPI } from '../utils/endpoints.js';

export const Dashboard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingRequest, setSendingRequest] = useState({});

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await recommendationAPI.getRecommendations(10);
      setRecommendations(response.data.recommendations || []);
      setError('');
    } catch (err) {
      setError('Failed to load recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    setSendingRequest((prev) => ({ ...prev, [userId]: true }));
    try {
      await friendAPI.sendRequest(userId);
      setRecommendations((prev) => prev.filter((rec) => rec._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send friend request');
    } finally {
      setSendingRequest((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Discover new friends based on mutual connections</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading recommendations...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-xl text-gray-600">No recommendations available</p>
            <p className="text-sm text-gray-500 mt-2">Add more friends to get better recommendations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-24"></div>
                <div className="px-6 py-4 relative">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{user.bio}</p>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-blue-700">{user.reason}</p>
                    {user.mutualFriends.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <p className="text-xs text-gray-600 mb-2">Mutual friends:</p>
                        <div className="flex flex-wrap gap-1">
                          {user.mutualFriends.map((friend) => (
                            <span
                              key={friend._id}
                              className="inline-block bg-white text-blue-700 text-xs px-2 py-1 rounded border border-blue-200"
                            >
                              {friend.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={sendingRequest[user._id]}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                  >
                    {sendingRequest[user._id] ? 'Sending...' : 'Add Friend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={loadRecommendations}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Refresh Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};
