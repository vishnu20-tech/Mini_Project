import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sender = await User.findById(senderId);
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already exists' });
      }
    }

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    await friendRequest.save();
    await friendRequest.populate('sender', 'name email profilePicture');
    await friendRequest.populate('receiver', 'name email profilePicture');

    res.status(201).json({
      message: 'Friend request sent',
      friendRequest,
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ message: 'Failed to send friend request', error: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending',
    })
      .populate('sender', 'name email profilePicture bio')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Failed to get pending requests', error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    const sender = await User.findById(friendRequest.sender);
    const receiver = await User.findById(friendRequest.receiver);

    if (!sender.friends.includes(friendRequest.receiver)) {
      sender.friends.push(friendRequest.receiver);
      await sender.save();
    }

    if (!receiver.friends.includes(friendRequest.sender)) {
      receiver.friends.push(friendRequest.sender);
      await receiver.save();
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.json({
      message: 'Friend request accepted',
      friendRequest,
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ message: 'Failed to accept friend request', error: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    if (!requestId) {
      return res.status(400).json({ message: 'Request ID is required' });
    }

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.receiver.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    res.json({
      message: 'Friend request rejected',
      friendRequest,
    });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ message: 'Failed to reject friend request', error: error.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.userId;

    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    if (userId === friendId) {
      return res.status(400).json({ message: 'Cannot remove yourself from friends' });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Not friends with this user' });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ message: 'Failed to remove friend', error: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate('friends', '_id name email profilePicture bio')
      .select('friends');

    res.json({ friends: user.friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Failed to get friends', error: error.message });
  }
};

export const getSentRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await FriendRequest.find({
      sender: userId,
      status: 'pending',
    })
      .populate('receiver', 'name email profilePicture bio')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ message: 'Failed to get sent requests', error: error.message });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendRequest.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: 'Friend request cancelled' });
  } catch (error) {
    console.error('Cancel friend request error:', error);
    res.status(500).json({ message: 'Failed to cancel friend request', error: error.message });
  }
};
