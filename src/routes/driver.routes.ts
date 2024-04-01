import express from 'express';
import DriverController from '../controllers/driver.controller';

const router = express.Router();

router.post('/', DriverController.updateCoordinates);
router.get('/:driver_id', DriverController.getDriverPosition);

export default router;
