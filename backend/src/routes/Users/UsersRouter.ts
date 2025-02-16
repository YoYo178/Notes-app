import { Router } from 'express';
import usersController from '@src/controllers/usersController';
import AuthValidator from '@src/middleware/AuthValidator';

const { createUser, updateUser, deleteUser } = usersController;

const UsersRouter = Router();

UsersRouter.post('/', createUser)

UsersRouter.use(AuthValidator);

UsersRouter.route('/')
    .patch(updateUser)
    .delete(deleteUser);

export default UsersRouter;
