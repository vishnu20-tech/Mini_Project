import { useState, useEffect } from 'react';
import { friendAPI } from '../utils/endpoints.js';

export const Requests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingRequest, setProcessingRequest] = useState({});

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const [pendingRes, sentRes] = await Promise.all([
        friendAPI.getPendingRequests(),
        friendAPI.getSentRequests(),
      ]);
      setPendingRequests(pendingRes.data.requests || []);
      setSentRequests(sentRes.data.requests || []);
      setError('');
    } catch (err) {
      setError('Failed to load requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessingRequest((prev) => ({ ...prev, [requestId]: true }));
    try {
      await friendAPI.acceptRequest(requestId);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }

    setProcessingRequest((prev) => ({ ...prev, [requestId]: true }));
    try {
      await friendAPI.rejectRequest(requestId);
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    setProcessingRequest((prev) => ({ ...prev, [requestId]: true }));
    try {
      await friendAPI.cancelRequest(requestId);
      setSentRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel request');
    } finally {
      setProcessingRequest((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const ReceivedRequests = () => (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-lg text-gray-600">No pending friend requests</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{request.sender.name}</h3>
              <p className="text-sm text-gray-600">{request.sender.email}</p>
              {request.sender.bio && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">{request.sender.bio}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(request._id)}
                disabled={processingRequest[request._id]}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request._id)}
                disabled={processingRequest[request._id]}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const SentRequests = () => (
    <div className="space-y-4">
      {sentRequests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-lg text-gray-600">No sent requests</p>
        </div>
      ) : (
        sentRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{request.receiver.name}</h3>
              <p className="text-sm text-gray-600">{request.receiver.email}</p>
              {request.receiver.bio && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">{request.receiver.bio}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Sent {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleCancel(request._id)}
              disabled={processingRequest[request._id]}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition disabled:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Friend Requests</h1>
          <p className="text-gray-600">Manage your friend requests</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === 'received'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Received ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === 'sent'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading requests...</p>
              </div>
            ) : activeTab === 'received' ? (
              <ReceivedRequests />
            ) : (
              <SentRequests />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
