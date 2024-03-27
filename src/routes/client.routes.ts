import express from 'express';
import ClientController from '../controllers/client.controller';

const router = express.Router();

router.get('/', ClientController.getAllClients);

export default router;
