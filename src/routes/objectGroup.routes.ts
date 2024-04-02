import express from 'express';
import ObjectGroupController from '../controllers/objectGroup.controller';

const router = express.Router();

router.get('/:id', ObjectGroupController.getObjectGroupsByClientId);
router.post('/', ObjectGroupController.createObjectGroup);

export default router;
