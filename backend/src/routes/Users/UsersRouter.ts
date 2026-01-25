import { Router } from 'express';
import usersController from '@src/controllers/usersController';

const { getLoggedInUser, updateUser, deleteUser } = usersController;

const UsersRouter = Router();

UsersRouter.get('/me', getLoggedInUser);

UsersRouter.route('/')
  .patch(updateUser)
  .delete(deleteUser);

export default UsersRouter;
