import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as locationController from './locations.controller.ts';

const router = express.Router();

router.use(authToken);
router.get('/getAll', locationController.get_all_locations);
export default router;
