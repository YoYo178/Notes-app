import { User } from '@src/models/user.model.js';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';
import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import validator from 'validator';
import cookieConfig from '@src/config/cookies.config.js';
import { Note } from '@src/models/note.model.js';

/**
 * @route GET /users/me
 * @description A query route for the client to know if they're logged in or not
 * @returns HTTP 200
 */
const getLoggedInUser = (req: Request, res: Response) => {
  // No need to perform any checks
  // Auth validator middleware handles everything already
  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'User is logged in', user: req.user });
};

/**
 * @route PATCH /users
 * @description Updates an existing user.
 * @returns HTTP 200, 400, 404, 409
 */
const updateUser = async (req: Request, res: Response) => {
  const {
    currentPassword = '',
    newPassword,
    confirmNewPassword,
    displayName,
    email = '',
  }: Record<string, string> = req.body;

  if (!validator.isEmail(email)) {
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
    const passwordMatches = user.hasLegacyHashing
      ? await bcrypt.compare(currentPassword, user.password)
      : await argon2.verify(user.password, currentPassword);
    if (!passwordMatches) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'Invalid password' });
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      res
        .status(HTTP_STATUS_CODES.BadRequest)
        .send({ message: 'Both new password fields are required' });
      return;
    }

    if (newPassword != confirmNewPassword) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: 'New passwords do not match' });
      return;
    }

    user.password = await argon2.hash(newPassword);
  }

  user.displayName = displayName ?? user.displayName;
  user.email = email ?? user.email;

  await user.save();

  res.status(HTTP_STATUS_CODES.Ok).send({ message: 'User updated successfully', data: { user } });
};

/**
 * @route DELETE /users
 * @description Deletes a user.
 * @returns HTTP 200, 404
 */
const deleteUser = async (req: Request, res: Response) => {
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
};

export default {
  getLoggedInUser,
  updateUser,
  deleteUser,
};
