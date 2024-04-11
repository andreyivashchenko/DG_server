import express from 'express';
import UserController from '../controllers/user.controller';

const router = express.Router();

router.get('/user', UserController.getUsers);
router.get('/client/:id', UserController.getClientByUserId);
router.get('/driver/:id', UserController.getDriverByUserId);

export default router;
