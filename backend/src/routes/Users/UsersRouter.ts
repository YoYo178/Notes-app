import { Router } from 'express';
import usersController from '@src/controllers/usersController';

const { getAllUsers, createUser, updateUser, deleteUser } = usersController;

const UsersRouter = Router();

UsersRouter.route('/')
    .get(getAllUsers)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);

export default UsersRouter;
