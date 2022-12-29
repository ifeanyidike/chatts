import { Router } from 'express';
import * as controller from '../controllers/Channels';
const router = Router();

router.route('/:key').get(controller.getChannelByKey);
router.route('/').get(controller.getAllChannels);

export default router;
