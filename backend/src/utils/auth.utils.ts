import ENV from '@src/common/env.js';
import { tokenConfig } from '@src/config/token.config.js';
import { User, type IUser } from '@src/models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import argon2 from 'argon2';

/**
 * @description Generates and returns a new access token for a user
 * @param user User's MongoDB object
 * @param req Request object from express
 * @param res Response object from express
 * @returns string
 */
export function refreshAccessToken(user: IUser) {
  const accessToken = jwt.sign(
    {
      User: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
      },
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: tokenConfig.accessToken.expiry / 1000 },
  );

  return accessToken;
}

// Handles migrations from bcrypt-hashed passwords to argon2-hashed passwords seamlessly
export async function handleHashMigration(userId: string, password: string) {
  const user = await User.findById(userId);
  if (!user) return;

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return;

  const newHash = await argon2.hash(password);

  user.password = newHash;
  user.hasLegacyHashing = false;

  await user.save();
}
