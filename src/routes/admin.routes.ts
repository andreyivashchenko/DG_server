import express from 'express';
import adminController from '../controllers/admin.controller';

const router = express.Router();

router.get('/info', adminController.getAllInfo);
router.post('/object-status', adminController.changeObjStatus);
router.post('/set-driver', adminController.setDriverData);
router.post('/remove-driver', adminController.removeDriverFromGroup);
router.get('/test', adminController.getClientsWithDrivers);

export default router;
