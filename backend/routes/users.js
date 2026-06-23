import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  getUserById,
  searchUsers,
  getAllUsers,
} from '../controllers/userController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/search', searchUsers);
router.get('/all', getAllUsers);
router.get('/:userId', getUserById);

export default router;
