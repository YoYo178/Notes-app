import bcrypt from 'bcrypt';
import logger from 'jet-logger';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { isEmail } from 'validator';
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import Env from '@src/common/Env';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import { User } from '@src/models/User';
import { VerificationCode } from '@src/models/VerificationCode';

import cookieConfig from '@src/config/cookieConfig';
import { tokenConfig } from '@src/config/tokenConfig';

import { generateVerificationCode, VERIFICATION_CODE_TTL } from '@src/util/code.utils';
import { obfuscateEmail, sendPasswordResetEmail, sendVerificationMail } from '@src/util/mail.utils';

const codeCooldownManager = new Map<string, number>();
const CODE_REQUEST_COOLDOWN = 60 * 1000; // 60 seconds

/**
 * @route POST /auth/register
 * @description Creates a new user.
 * @returns HTTP 201, 400, 409, 500
 */
const register = expressAsyncHandler(async (req: Request, res: Response) => {
  const { username, password, confirmPassword, displayName, email }: Record<string, string> = req.body;

  if (!username || !password || !confirmPassword || !displayName || !email) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'All fields are required' });
    return;
  }

  if (!isEmail(email)) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Invalid email' });
    return;
  }

  // Check username, if it's already taken
  const usernameExists = !!await User.findOne({ username }).select('-password').lean().exec();

  if (usernameExists) {
    res.status(HttpStatusCodes.CONFLICT).send({ message: 'A user already exists with the provided username' });
    return;
  }

  // Check email, if the user already has an account with this email
  const userEmailExists = !!await User.findOne({ email }).select('-password').lean().exec();

  if (userEmailExists) {
    res.status(HttpStatusCodes.CONFLICT).send({ message: 'A user already exists with the provided email' });
    return;
  }

  if (password !== confirmPassword) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Passwords do not match' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    displayName,
    email,
  });

  const code = generateVerificationCode();
  const mailInfo = await sendVerificationMail(email, code);

  codeCooldownManager.set(user._id.toString(), Date.now() + CODE_REQUEST_COOLDOWN);

  await VerificationCode.create({
    user: user._id,
    code: await bcrypt.hash(code, 10),
    purpose: 'user-verification',
    expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL),
  });

  if (user) {
    res.status(HttpStatusCodes.CREATED).send({
      message: 'User created successfully',
      id: user._id.toString(),
      emailLink: !!mailInfo && Env.SmtpMock ? nodemailer.getTestMessageUrl(mailInfo) : null,
    });
    return;
  } else {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'An error occured while creating a new user.' });
  }
});

/**
 * @route POST /auth/verify
 * @description Used for email verification in case of a new account or account recovery
 * @returns HTTP 200, 400, 403, 404, 500
 */
const verify = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id, purpose, code }: Record<string, string> = req.body;

  if (!id) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'User ID is required' });
    return;
  }

  const user = await User.findById(id).select('-password').exec();
  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  if (user.isVerified && (!user.recoveryState.isRecovering || user.recoveryState.hasVerifiedMail)) {
    res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'You have verified your email already' });
    return;
  }

  const verificationCode = await VerificationCode.findOne({ user: id }).exec();

  if (!verificationCode) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'Verification code expired, kindly request a new code.' });
    return;
  }

  const codeMatches = await bcrypt.compare(code, verificationCode?.code);

  if (!codeMatches || verificationCode.purpose !== purpose) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Invalid verification code' });
    return;
  }

  await verificationCode.deleteOne();

  switch (purpose) {
  case 'user-verification':
  {
    user.isVerified = true;
    await user.save();
    res.status(HttpStatusCodes.OK).json({ message: 'Verification successful' });
    break;
  }
  case 'reset-password':
  {
    user.recoveryState.isRecovering = true;
    user.recoveryState.hasVerifiedMail = true;
    user.recoveryState.hasSetPassword = false;
    await user.save();

    const ResetPasswordAccessTokenSecret = Env.ResetPasswordAccessTokenSecret;

    if (!ResetPasswordAccessTokenSecret) {
      logger.err('RESET_PASSWORD_ACCESS_TOKEN_SECRET is undefined!');
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'An error occurred in the server.' });
      return;
    }

    const resetPasswordAccessToken = jwt.sign(
      {
        userID: user._id.toString(),
        purpose: 'reset-password',
      },
      ResetPasswordAccessTokenSecret,
      { expiresIn: tokenConfig.resetPasswordAccessToken.expiry / 1000 },
    );

    res.cookie('jwt_reset_at', resetPasswordAccessToken, {
      ...cookieConfig,
      maxAge: tokenConfig.resetPasswordAccessToken.expiry, // 15 minutes
    });

    res.status(HttpStatusCodes.OK).json({ message: 'Success' });
    break;
  }
  default:
  {
    logger.err('[POST /api/auth/verify]: Unknown method!');
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Unknown purpose' });
    return;
  }
  }
});

/**
 * @route POST /auth/resend-code
 * @description Used for resending a verification code to user's email
 * @returns HTTP 200, 400, 403, 404
 */
const resendCode = expressAsyncHandler(async (req: Request, res: Response) => {

  const { id, purpose } = req.body;

  if (!id) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'User ID is required' });
    return;
  }

  const user = await User.findById(id).select('-password').lean().exec();
  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).json({ message: 'User not found' });
    return;
  }

  switch (purpose) {
  case 'user-verification':
    if (user.isVerified) {
      res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'User is already verified!' });
      return;
    }
    break;
  case 'reset-password':
    if (user.recoveryState.isRecovering && user.recoveryState.hasVerifiedMail) {
      res.status(HttpStatusCodes.FORBIDDEN).json({ message: 'You have verified your email already' });
      return;
    }
    break;
  default:
    logger.err('[POST /api/auth/resend-verification-code]: Unknown method!');
    res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Unknown method' });
    return;
  }

  const lastCodeRequestTime = codeCooldownManager.get(user._id.toString());
  const hasRecentlyRequestedCode = lastCodeRequestTime ? lastCodeRequestTime > Date.now() : false;

  if (hasRecentlyRequestedCode) {
    res.status(HttpStatusCodes.TOO_MANY_REQUESTS)
      .json({
        message: 'You have recently requested a verification code, Please wait before requesting a new one!',
      });
    return;
  }

  const verificationCode = await VerificationCode.findOne({ user: user._id, purpose });

  if (verificationCode)
    await verificationCode.deleteOne();

  const code = generateVerificationCode();

  let mailInfo: null | undefined | SMTPTransport.SentMessageInfo = null;

  if (purpose === 'user-verification')
    mailInfo = await sendVerificationMail(user.email, code);
  else if (purpose === 'reset-password')
    mailInfo = await sendPasswordResetEmail(user.email, code);

  codeCooldownManager.set(user._id.toString(), Date.now() + CODE_REQUEST_COOLDOWN);

  await VerificationCode.create({
    user: user._id,
    code: await bcrypt.hash(code, 10),
    purpose,
    expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL),
  });

  res.status(HttpStatusCodes.OK).json({
    message: 'Success',
    emailLink: !!mailInfo && Env.SmtpMock ? nodemailer.getTestMessageUrl(mailInfo) : null,
  });
});

/**
 * @route POST /auth/login
 * @description Logs in the user and returns HTTP only cookies to the client.
 * @returns HTTP 200, 400, 401, 404, 500
 */
const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { username, password }: Record<string, string> = req.body;

  if (!username || !password) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'All fields are required' });
    return;
  }

  const user = await User.findOne({ username }).lean().exec();

  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).send({ message: 'User not found' });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: 'Invalid password' });
    return;
  }

  if (!user.isVerified) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: 'User is not verified!' });
    return;
  }

  const AccessTokenSecret = Env.AccessTokenSecret;

  if (!AccessTokenSecret) {
    logger.err('ACCESS_TOKEN_SECRET is undefined!');
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'An error occured in the server.' });
    return;
  }

  const accessToken = jwt.sign(
    {
      User: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
      },
    },
    AccessTokenSecret,
    { expiresIn: tokenConfig.accessToken.expiry / 1000 },
  );

  const RefreshTokenSecret = Env.RefreshTokenSecret;

  if (!RefreshTokenSecret) {
    logger.err('REFRESH_TOKEN_SECRET is undefined!');
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'An error occured in the server.' });
    return;
  }

  const refreshToken = jwt.sign(
    {
      User: {
        id: user._id.toString(),
        username: user.username,
      },
    },
    RefreshTokenSecret,
    { expiresIn: tokenConfig.refreshToken.expiry / 1000 },
  );

  res.cookie('jwt_rt', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken.expiry, // 7 days
  });

  res.cookie('jwt_at', accessToken, cookieConfig);

  res.status(HttpStatusCodes.OK)
    .send({
      message: 'Logged in successfully',
      user: {
        displayName: user.displayName,
        id: user._id.toString(),
        email: user.email,
      },
    });
});

/**
 * @route POST /auth/recover-account
 * @description Used to initiate account recovery process.
 * @returns HTTP 200, 400, 404
 */
const recoverAccount = expressAsyncHandler(async (req: Request, res: Response) => {
  const { input }: Record<string, string> = req.body;

  if (!input) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'All fields are required' });
    return;
  }

  const user = await User.findOne({ $or: [{ username: input }, { email: input }] }).select('-password').exec();

  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).send({ message: 'No account found' });
    return;
  }

  if (user.recoveryState.isRecovering && user.recoveryState.hasVerifiedMail && req.cookies?.jwt_reset_at) {
    res.status(HttpStatusCodes.FORBIDDEN)
      .json({
        message: 'You are already in the process of recovering your account. Finish your attempt or restart account recovery process.',
      });
    return;
  }

  // Delete all previous codes
  await VerificationCode.deleteMany({ user: user._id.toString(), purpose: 'reset-password' });

  user.recoveryState.isRecovering = true;
  user.recoveryState.hasVerifiedMail = false;
  user.recoveryState.hasSetPassword = false;
  await user.save();

  const code = generateVerificationCode();
  const mailInfo = await sendPasswordResetEmail(user.email, code);

  codeCooldownManager.set(user._id.toString(), Date.now() + CODE_REQUEST_COOLDOWN);

  await VerificationCode.create({
    user: user._id,
    code: await bcrypt.hash(code, 10),
    purpose: 'reset-password',
    expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL),
  });

  res.status(HttpStatusCodes.OK).json({
    id: user._id.toString(),
    email: isEmail(input) ? input : obfuscateEmail(user.email),
    emailLink: !!mailInfo && Env.SmtpMock ? nodemailer.getTestMessageUrl(mailInfo) : null,
  });
});

/**
 * @route POST /auth/reset-password
 * @description Used for finishing account recovery process.
 * @returns HTTP 200, 400, 403, 404
 */
const resetPassword = expressAsyncHandler(async (req: Request, res: Response) => {
  const { password, confirmPassword }: Record<string, string> = req.body;

  if (!password || !confirmPassword) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Both password fields are required' });
    return;
  }

  const user = await User.findById(req.recoveringUser.id).exec();

  if (!user) {
    res.status(HttpStatusCodes.NOT_FOUND).send({ message: 'User not found' });
    return;
  }

  if (!user.recoveryState.isRecovering || !user.recoveryState.hasVerifiedMail) {
    res.status(HttpStatusCodes.FORBIDDEN)
      .json({
        message: 'You haven\'t completed the earlier stages of account recovery, complete them or restart the account recovery process.',
      });
    return;
  }

  if (password != confirmPassword) {
    res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'Passwords do not match' });
    return;
  }

  user.password = await bcrypt.hash(password, 10);
  user.recoveryState.isRecovering = true;
  user.recoveryState.hasVerifiedMail = true;
  user.recoveryState.hasSetPassword = true; // TODO: might remove later

  if (user.recoveryState.isRecovering && user.recoveryState.hasVerifiedMail && user.recoveryState.hasSetPassword) {
    user.recoveryState.isRecovering = false;
    user.recoveryState.hasVerifiedMail = false;
    user.recoveryState.hasSetPassword = false;
  }

  await user.save();

  res.clearCookie('jwt_reset_at', {
    ...cookieConfig,
    maxAge: undefined,
  });

  res.status(HttpStatusCodes.OK).json({ message: 'Password changed successfully' });
});

/**
 * @route POST /auth/logout
 * @description Logs out the user and clears HTTP only cookies on the client.
 * @returns HTTP 200
 */
const logout = expressAsyncHandler((req: Request, res: Response) => {
  res.clearCookie('jwt_rt', {
    ...cookieConfig,
    maxAge: undefined,
  });

  res.clearCookie('jwt_at', {
    ...cookieConfig,
    maxAge: undefined,
  });

  res.status(HttpStatusCodes.OK).send({ message: 'User logged out successfully' });
});

export default {
  register,
  verify,
  resendCode,
  login,
  recoverAccount,
  resetPassword,
  logout,
};