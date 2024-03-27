import express from 'express';
import AdminController from '../controllers/admin.controller';

const router = express.Router();

router.get('/obj', AdminController.getAllObjects);
router.post('/obj', AdminController.changeObjStatus);
router.get('/clients', AdminController.getClients);

export default router;
