import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriends,
  getSentRequests,
  cancelFriendRequest,
} from '../controllers/friendController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/request/send', sendFriendRequest);
router.get('/requests/pending', getPendingRequests);
router.get('/requests/sent', getSentRequests);
router.post('/request/accept', acceptFriendRequest);
router.post('/request/reject', rejectFriendRequest);
router.post('/request/cancel', cancelFriendRequest);
router.post('/remove', removeFriend);
router.get('/list', getFriends);

export default router;
