import { Router } from 'express';
import * as controller from '../controllers/messages';
const router = Router();

// router.route('/:key').get(controller.getChannelByKey);
// router.route('/user-channels/:email').get(controller.getUsersChannelByEmail);
router.route('/').post(controller.createMessage);
router.route('/:chatcourseId').get(controller.getCourseMessages);
router
  .route('/:id')
  .put(controller.editMessage)
  .delete(controller.deleteMessage);

export default router;
