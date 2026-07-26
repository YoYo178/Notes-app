export const tokenConfig = {
  accessToken: {
    expiry: 3 * 60 * 60 * 1000, // 3 hours
  },
  refreshToken: {
    expiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  resetPasswordAccessToken: {
    expiry: 15 * 60 * 1000, // 15 minutes
  },
};