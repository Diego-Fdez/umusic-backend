import express from 'express';
import {
  getRoomById,
  addVideosToRoomList,
  deleteVideoFromRoomList,
} from '../controllers/roomController.js';

const router = express.Router();

router.get('/room/:id', getRoomById);
router.post('/room', addVideosToRoomList);
router.delete('/room/:id', deleteVideoFromRoomList);

export default router;
