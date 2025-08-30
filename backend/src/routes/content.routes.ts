import { Router } from 'express';
import { addContent, getContents } from '../controllers/content.controller';

const contentRouter = Router();

contentRouter.route('/add-new-content').post(addContent);
contentRouter.route('/get-all-content').get(getContents);

export default contentRouter;
