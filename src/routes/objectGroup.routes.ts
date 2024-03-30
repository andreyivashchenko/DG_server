import express from 'express';
import ObjectGroupController from '../controllers/objectGroup.controller';

const router = express.Router();

router.post('/', ObjectGroupController.addObjectGroup);

export default router;
