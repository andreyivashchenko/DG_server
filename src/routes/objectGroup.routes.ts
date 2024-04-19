import express from 'express';
import ObjectGroupController from '../controllers/objectGroup.controller';

const router = express.Router();

router.get('/:id', ObjectGroupController.getObjectGroupsByClientId);
router.post('/', ObjectGroupController.createObjectGroup);
router.delete('/:id', ObjectGroupController.deleteObjectGroupById);
router.post('/optimal-object', ObjectGroupController.setOptimalObject);
router.get('/optimal-object/:id', ObjectGroupController.getOptimalObject);

export default router;
