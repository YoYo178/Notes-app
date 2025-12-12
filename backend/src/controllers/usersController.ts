import { User } from '@src/models/User';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import { isEmail } from 'validator';
import cookieConfig from '@src/config/cookieConfig';
import { Note } from '@src/models/Note';

/**
 * @route GET /users/me
 * @description A query route for the client to know if they're logged in or not
 * @returns HTTP 200
 */
const getLoggedInUser = expressAsyncHandler((req: Request, res: Response) => {
  // No need to perform any checks
  // Auth validator middleware handles everything already
  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'User is logged in', user: req.user });
});

/**
 * @route PATCH /users
 * @description Updates an existing user.
 * @returns HTTP 200, 400, 404, 409
 */
const updateUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmNewPassword, displayName, email }: Record<string, string> = req.body;

  if (!isEmail(email)) {
    res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid Email' });
    return;
  }

  const user = await User.findById(req.user.id).exec();

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  const duplicateEmailUser = await User.findOne({ email }).exec();
  if (duplicateEmailUser && duplicateEmailUser._id.toString() !== req.user.id) {
    res.status(HTTP_STATUS_CODES.Conflict).send({ message: 'Email is already registered' });
    return;
  }

  const isChangingPassword = !!currentPassword || !!newPassword || !!confirmNewPassword;
  if (isChangingPassword) {
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid password' });
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Both new password fields are required' });
      return;
    }

    if (newPassword != confirmNewPassword) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'New passwords do not match' });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  user.displayName = displayName ?? user.displayName;
  user.email = email ?? user.email;

  await user.save();

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'User updated successfully', data: { user } });
});

/**
 * @route DELETE /users
 * @description Deletes a user.
 * @returns HTTP 200, 404
 */
const deleteUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  res.clearCookie('jwt_rt', {
    ...cookieConfig,
    maxAge: undefined,
  });

  res.clearCookie('jwt_at', {
    ...cookieConfig,
    maxAge: undefined,
  });

  // Delete all notes associated with the user
  await Note.deleteMany({ user: user._id }).exec();

  await user.deleteOne();

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'User deleted successfully' });
});

export default {
  getLoggedInUser,
  updateUser,
  deleteUser,
};