import { Router } from 'express';
import { getLink, shareLink } from '../controllers/link.controller';

const linkRouter = Router();

linkRouter.route('/share').get(shareLink);
linkRouter.route('/share/:shareLink').get(getLink);

export default linkRouter;
