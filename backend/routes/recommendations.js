import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getRecommendations, getMutualFriends } from '../controllers/recommendationController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getRecommendations);
router.get('/mutual/:userId', getMutualFriends);

export default router;
