import express from 'express';
import ClientController from '../controllers/client.controller';

const router = express.Router();

router.get('/:id', ClientController.getClientByUserId);
router.get('/', ClientController.getClientsWithName);

export default router;
