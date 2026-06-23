import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('friends', 'name email profilePicture bio');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('friends', 'name email profilePicture bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);
    const isFriend = currentUser.friends.includes(userId);

    res.json({ 
      user: user.toJSON(),
      isFriend,
      friendCount: user.friends.length,
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json({ users: [] });
    }

    const searchQuery = q.trim();
    const regex = new RegExp(searchQuery, 'i');

    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [
            { name: regex },
            { email: regex },
          ],
        },
      ],
    })
      .select('_id name email profilePicture bio')
      .limit(parseInt(limit));

    const currentUser = await User.findById(req.userId);
    const usersWithFriendStatus = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isFriend: currentUser.friends.includes(user._id),
    }));

    res.json({ users: usersWithFriendStatus });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('_id name email profilePicture bio')
      .limit(50);

    const currentUser = await User.findById(req.userId);
    const usersWithFriendStatus = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      isFriend: currentUser.friends.includes(user._id),
    }));

    res.json({ users: usersWithFriendStatus });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
};
