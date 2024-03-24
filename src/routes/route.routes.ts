import express from 'express';
import routeController from '../controllers/route.controller';

const router = express.Router();

router.get('/', routeController.getRoute);
router.get('/matrix', routeController.getMatrix);

export default router;
