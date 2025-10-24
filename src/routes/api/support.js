import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitTicket } from '../../controllers/support/support.js';

const router = express.Router();

// Rate limiting middleware to prevent abuse
const ticketLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 ticket submissions per windowMs
    message: {
        success: false,
        message: 'Too many support tickets submitted from this IP. Please try again in 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// POST /api/support/ticket - Submit a support ticket
router.post('/ticket', ticketLimiter, submitTicket);

export default router;

