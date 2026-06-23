import { useState, useEffect } from 'react';
import { userAPI, friendAPI } from '../utils/endpoints.js';
import { useNavigate } from 'react-router-dom';

export const Discover = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendingRequest, setSendingRequest] = useState({});

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadAllUsers();
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.searchUsers(searchQuery, 50);
      setUsers(response.data.users || []);
      setError('');
    } catch (err) {
      setError('Failed to search users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    setSendingRequest((prev) => ({ ...prev, [userId]: true }));
    try {
      await friendAPI.sendRequest(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, requestSent: true } : user
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send friend request');
    } finally {
      setSendingRequest((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Users</h1>
          <p className="text-gray-600">Find and connect with other users</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={loadAllUsers}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition cursor-pointer"
            >
              Clear
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-xl text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
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

                  {user.isFriend && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-green-700">✓ Already Friends</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProfile(user._id)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                    >
                      View Profile
                    </button>
                    {!user.isFriend && (
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        disabled={sendingRequest[user._id]}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                      >
                        {sendingRequest[user._id] ? '...' : 'Add'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
