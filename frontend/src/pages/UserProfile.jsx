import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI, friendAPI, recommendationAPI } from '../utils/endpoints.js';

export const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mutualFriends, setMutualFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const [userRes, mutualRes] = await Promise.all([
        userAPI.getUserById(userId),
        recommendationAPI.getMutualFriends(userId),
      ]);

      setUser(userRes.data.user);
      setIsFriend(userRes.data.isFriend);
      setMutualFriends(mutualRes.data.mutualFriends || []);
      setError('');
    } catch (err) {
      setError('Failed to load user profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    setActionLoading(true);
    try {
      await friendAPI.sendRequest(userId);
      setRequestSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send friend request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    setActionLoading(true);
    try {
      await friendAPI.removeFriend(userId);
      setIsFriend(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove friend');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">User not found</p>
          <button
            onClick={() => navigate('/discover')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-32"></div>

          <div className="px-6 py-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mt-4 text-lg">{user.bio}</p>
              )}
            </div>

            {mutualFriends.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">
                  {mutualFriends.length} Mutual Friend{mutualFriends.length !== 1 ? 's' : ''}
                </h3>
                <div className="space-y-2">
                  {mutualFriends.map((friend) => (
                    <div key={friend._id} className="flex items-center gap-2">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">{friend.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/discover')}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition cursor-pointer"
              >
                Back
              </button>

              {!isFriend && !requestSent && (
                <button
                  onClick={handleSendRequest}
                  disabled={actionLoading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                >
                  {actionLoading ? 'Sending...' : 'Add Friend'}
                </button>
              )}

              {requestSent && (
                <div className="flex-1 bg-orange-100 border border-orange-400 text-orange-700 font-semibold py-3 px-4 rounded-lg text-center">
                  Request Sent
                </div>
              )}

              {isFriend && (
                <button
                  onClick={handleRemoveFriend}
                  disabled={actionLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                >
                  {actionLoading ? 'Removing...' : 'Remove Friend'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
