import { Router } from 'express';
import { appInfoController, securityTipsController, threatsController } from '../controllers/education.controller.js';

const router = Router();
router.get('/security-tips', securityTipsController);
router.get('/threats', threatsController);
router.get('/app-info', appInfoController);

export default router;
