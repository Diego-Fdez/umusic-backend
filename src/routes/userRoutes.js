import express from 'express';
import {
  loginUser,
  temporaryUserRegistration,
} from '../controllers/userController.js';
import { checkAuthQueryString } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/login', loginUser);
router.post(
  '/temporary-login?',
  checkAuthQueryString,
  temporaryUserRegistration
);

export default router;
