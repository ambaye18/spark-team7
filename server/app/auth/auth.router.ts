import express from 'express';
import * as authController from './auth.controller.ts';
const router = express.Router();

router.post('/signup', authController.signup);

export default router;
