import express from 'express';
import ClientController from '../controllers/client.controller';

const router = express.Router();

router.get('/', ClientController.getAllClients);
router.get('/:id', ClientController.getClientByUserId);

export default router;
