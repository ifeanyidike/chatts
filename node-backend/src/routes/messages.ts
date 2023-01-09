import { Router } from 'express';
import * as controller from '../controllers/messages';
const router = Router();

// router.route('/:key').get(controller.getChannelByKey);
// router.route('/user-channels/:email').get(controller.getUsersChannelByEmail);
router.route('/').post(controller.createMessage);
router.route('/:chatcourseId').get(controller.getCourseMessages);

export default router;
