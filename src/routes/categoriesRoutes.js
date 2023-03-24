import express from 'express';
import {
  getAllCategories,
  insertCategories,
} from '../controllers/categoriesController.js';

const router = express.Router();

router.get('/categories', getAllCategories);
router.post('/categories', insertCategories);

export default router;
