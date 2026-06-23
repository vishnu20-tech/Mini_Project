import { useState, useEffect } from 'react';
import { friendAPI } from '../utils/endpoints.js';
import { useNavigate } from 'react-router-dom';

export const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingFriend, setRemovingFriend] = useState({});

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const response = await friendAPI.getFriends();
      setFriends(response.data.friends || []);
      setError('');
    } catch (err) {
      setError('Failed to load friends');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    setRemovingFriend((prev) => ({ ...prev, [friendId]: true }));
    try {
      await friendAPI.removeFriend(friendId);
      setFriends((prev) => prev.filter((friend) => friend._id !== friendId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove friend');
    } finally {
      setRemovingFriend((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleViewProfile = (friendId) => {
    navigate(`/user/${friendId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Friends</h1>
          <p className="text-gray-600">You have {friends.length} friend{friends.length !== 1 ? 's' : ''}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading friends...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-xl text-gray-600">You don't have any friends yet</p>
            <p className="text-sm text-gray-500 mt-2">Start adding friends from the Discover page!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <div key={friend._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-24"></div>
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{friend.name}</h3>
                    <p className="text-sm text-gray-600">{friend.email}</p>
                  </div>

                  {friend.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{friend.bio}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProfile(friend._id)}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend._id)}
                      disabled={removingFriend[friend._id]}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
                    >
                      ✕
                    </button>
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
