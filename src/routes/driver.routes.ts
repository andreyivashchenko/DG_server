import express from 'express';
import DriverController from '../controllers/driver.controller';

const router = express.Router();

router.get('/free', DriverController.getFreeDrivers);
router.post('/coordinates', DriverController.updateCoordinates);
router.get('/:driver_id', DriverController.getDriverPosition);
router.get('/', DriverController.getDrivers);

export default router;
