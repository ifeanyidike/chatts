import { Router } from 'express';
import * as controller from '../controllers/users';
const router = Router();

router.route('/messages').get(controller.getUserAndMessages);
router.route('/by-email/:email').get(controller.findUserByEmail);
router.route('/widget-user').post(controller.handleAuthenticateWidgetUser);

export default router;
