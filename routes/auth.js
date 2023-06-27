import express from 'express'
import { registerHandler, loginHandler, testHandler, forgotPasswordHandler } from '../controllers/auth.js'
import { requireSignIn, isAdmin } from '../middlewares/auth.js';

// router obect
const router = express.Router();

// routing
// REGISTER || METHOD POST
router.post('/register', registerHandler)

// LOGIN || METHOD POST
router.post('/login', loginHandler)

// Forgot Password || METHOD POST
router.post('/forgot-password', forgotPasswordHandler)

// test routes
router.get('/test', requireSignIn, isAdmin, testHandler)

// protected routes
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

// protected admin route path
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

export default router