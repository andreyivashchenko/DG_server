import express from 'express';
import ObjectGroupController from '../controllers/objectGroup.controller';

const router = express.Router();

router.post('/', ObjectGroupController.createObjectGroup);

export default router;
