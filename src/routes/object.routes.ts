import express from 'express';
import ObjectController from '../controllers/object.controller';

const router = express.Router();

router.get('/', ObjectController.getAllObjects);
router.post('/status', ObjectController.changeObjStatus);

export default router;
