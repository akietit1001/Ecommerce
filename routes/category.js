import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/auth.js';
import { createCategoryHandler, updateCategoryHandler, getCategoryHandler, getSingleCategoryHandler, deleteCategoryHandler } from '../controllers/category.js';

const router = express.Router()

// routes
// Create category
router.post('/create-category', requireSignIn, isAdmin, createCategoryHandler)

// Update category
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryHandler)

// Get category
router.get('/get-categories', getCategoryHandler)

// Get single category
router.get('/single-category/:id', getSingleCategoryHandler)

// Delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryHandler)

export default router