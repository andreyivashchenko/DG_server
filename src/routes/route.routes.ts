import express from 'express';
import routeController from '../controllers/route.controller';

const router = express.Router();

router.get('/', routeController.getRoute);

export default router;
