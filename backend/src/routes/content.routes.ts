import { Router } from 'express';
import {
  addContent,
  deleteContent,
  getAllContents,
  getContentWithId,
} from '../controllers/content.controller';

const contentRouter = Router();

contentRouter.route('/add-new-content').post(addContent);
contentRouter.route('/get-all-content').get(getAllContents);
contentRouter.route('/get-content/:id').get(getContentWithId);
contentRouter.route('/delete').delete(deleteContent);

export default contentRouter;
