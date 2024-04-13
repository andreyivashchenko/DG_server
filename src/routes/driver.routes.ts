import express from 'express';
import DriverController from '../controllers/driver.controller';

const router = express.Router();

router.post('/coordinates', DriverController.updateCoordinates);
router.get('/', DriverController.getDrivers);
router.get('/:driver_id', DriverController.getDriverPosition);

export default router;
