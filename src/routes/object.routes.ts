import express from 'express';
import ObjectController from '../controllers/object.controller';

const router = express.Router();

router.get('/:id', ObjectController.getObjectsByObjectGroupId); // перенести и сделать /object-group/:id/objects
router.post('/', ObjectController.createObject);
router.delete('/:id', ObjectController.deleteObjectById);

export default router;
