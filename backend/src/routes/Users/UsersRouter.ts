import { Router } from 'express';
import usersController from '@src/controllers/usersController';

const { createUser, updateUser, deleteUser } = usersController;

const UsersRouter = Router();

UsersRouter.route('/')
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);

export default UsersRouter;
