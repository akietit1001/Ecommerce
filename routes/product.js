import express from "express";
import { isAdmin, requireSignIn } from './../middlewares/auth.js';
import {
    createProductHandler,
    getProductHandler,
    getSingleProductHandler,
    getProductPhotoHandler,
    deleteProductHandler,
    updateProductHandler,
    filterProductHandler,
    productCountHandler,
    productListHandler
} from "../controllers/product.js";

import formidable from 'express-formidable'

const router = express.Router();

// routes
// Create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductHandler);

// Update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductHandler);

// Get product
router.get('/get-products', getProductHandler)

// Get single product
router.get('/get-product/:slug', getSingleProductHandler)

// Get photo
router.get('/product-photo/:pid', getProductPhotoHandler)

// Delete product
router.delete('/delete-product/:pid', deleteProductHandler)

// Filter product
router.post('/product-filters', filterProductHandler)

// Product count
router.get('/product-count', productCountHandler)

// product per page
router.get('/product-list/:page', productListHandler)

export default router;