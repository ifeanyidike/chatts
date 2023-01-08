import { Router } from 'express';
import * as controller from '../controllers/channels';
const router = Router();

router
  .route('/:key')
  .get(controller.getChannelByKey)
  .put(controller.addUserToChannel);
router.route('/user-channels/:email').get(controller.getUsersChannelByEmail);
router.route('/').get(controller.getAllChannels).post(controller.createChannel);

export default router;
