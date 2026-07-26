import { Endpoints } from '../types/api.types';

const APIEndpoints: Endpoints = {
  /***** AUTHENTICATION *****/
  LOGIN: {
    URL: '/api/auth/login',
    METHOD: 'POST',
  },
  LOGOUT: {
    URL: '/api/auth/logout',
    METHOD: 'POST',
  },
  REGISTER: {
    URL: '/api/auth/register',
    METHOD: 'POST',
  },
  RECOVER_ACCOUNT: {
    URL: '/api/auth/recover-account',
    METHOD: 'POST',
  },
  VERIFY: {
    URL: '/api/auth/verify',
    METHOD: 'POST',
  },
  RESEND_CODE: {
    URL: '/api/auth/resend-code',
    METHOD: 'POST',
  },
  RESET_PASSWORD: {
    URL: '/api/auth/reset-password',
    METHOD: 'POST',
  },

  /***** NOTE *****/
  GET_ALL_NOTES: {
    URL: '/api/notes',
    METHOD: 'GET',
  },
  CREATE_NOTE: {
    URL: '/api/notes',
    METHOD: 'POST',
  },
  UPDATE_NOTE: {
    URL: '/api/notes/:noteId',
    METHOD: 'PATCH',
  },
  DELETE_NOTE: {
    URL: '/api/notes/:noteId',
    METHOD: 'DELETE',
  },

  /***** USER *****/
  GET_LOGGED_IN_USER: {
    URL: '/api/users/me',
    METHOD: 'GET',
  },
  UPDATE_USER: {
    URL: '/api/users',
    METHOD: 'PATCH',
  },
  DELETE_USER: {
    URL: '/api/users',
    METHOD: 'DELETE',
  },

  /***** FILES *****/
  UPLOAD_AUDIO: {
    URL: '/api/files/upload/audio',
    METHOD: 'POST',
  },
  UPLOAD_IMAGES: {
    URL: '/api/files/upload/image',
    METHOD: 'POST',
  },
  DELETE_FILES: {
    URL: '/api/files',
    METHOD: 'DELETE',
  },
};

export default APIEndpoints;
