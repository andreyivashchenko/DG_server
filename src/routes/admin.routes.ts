import express from 'express';
import AdminController from '../controllers/admin.controller';

const router = express.Router();

router.get('/', AdminController.getAllObjects);

export default router;
