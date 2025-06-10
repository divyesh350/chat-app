import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { handleAIMessage } from '../controller/ai.controller.js';

const router = express.Router();

router.post("/chat", protectRoute, handleAIMessage);

export default router; 