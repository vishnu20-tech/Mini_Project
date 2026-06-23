import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 10;

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = currentUser.friends.map((id) => id.toString());

    const pendingRequests = await FriendRequest.find({
      $or: [
        { sender: userId, status: 'pending' },
        { receiver: userId, status: 'pending' },
      ],
    });

    const pendingUserIds = new Set();
    pendingRequests.forEach((req) => {
      if (req.sender.toString() === userId) {
        pendingUserIds.add(req.receiver.toString());
      } else {
        pendingUserIds.add(req.sender.toString());
      }
    });

    const recommendations = new Map();

    for (const friendId of friendIds) {
      const friend = await User.findById(friendId);
      if (!friend) continue;

      const friendsFriendsIds = friend.friends.map((id) => id.toString());

      for (const potentialFriendId of friendsFriendsIds) {
        if (
          potentialFriendId === userId ||
          friendIds.includes(potentialFriendId) ||
          pendingUserIds.has(potentialFriendId)
        ) {
          continue;
        }

        if (!recommendations.has(potentialFriendId)) {
          recommendations.set(potentialFriendId, {
            mutualFriends: [],
            mutualCount: 0,
          });
        }

        const entry = recommendations.get(potentialFriendId);
        entry.mutualFriends.push({
          _id: friendId,
          name: friend.name,
          profilePicture: friend.profilePicture,
        });
        entry.mutualCount += 1;
      }
    }

    const sortedRecommendations = Array.from(recommendations.entries())
      .sort((a, b) => b[1].mutualCount - a[1].mutualCount)
      .slice(0, limit);

    const recommendedUserIds = sortedRecommendations.map((rec) => rec[0]);
    const recommendedUsers = await User.find({ _id: { $in: recommendedUserIds } }).select(
      '_id name email profilePicture bio'
    );

    const userMap = new Map(recommendedUsers.map((u) => [u._id.toString(), u]));

    const finalRecommendations = sortedRecommendations.map(([userId, data]) => {
      const user = userMap.get(userId);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        mutualFriendsCount: data.mutualCount,
        mutualFriends: data.mutualFriends.slice(0, 5),
        reason: `${data.mutualCount} mutual friend${data.mutualCount > 1 ? 's' : ''}`,
      };
    });

    res.json({
      recommendations: finalRecommendations,
      count: finalRecommendations.length,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      message: 'Failed to get recommendations',
      error: error.message,
    });
  }
};

export const getMutualFriends = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentFriendIds = new Set(
      currentUser.friends.map((id) => id.toString())
    );
    const otherFriendIds = new Set(
      otherUser.friends.map((id) => id.toString())
    );

    const mutualFriendIds = [...currentFriendIds].filter((id) =>
      otherFriendIds.has(id)
    );

    const mutualFriends = await User.find({ _id: { $in: mutualFriendIds } }).select(
      '_id name profilePicture'
    );

    res.json({
      mutualFriendsCount: mutualFriends.length,
      mutualFriends,
    });
  } catch (error) {
    console.error('Get mutual friends error:', error);
    res.status(500).json({
      message: 'Failed to get mutual friends',
      error: error.message,
    });
  }
};
