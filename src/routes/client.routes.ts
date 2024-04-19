import express from 'express';
import ClientController from '../controllers/client.controller';

const router = express.Router();

router.get('/', ClientController.getClientsWithName);

export default router;
