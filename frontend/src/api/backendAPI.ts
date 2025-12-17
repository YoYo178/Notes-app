import axios from 'axios';

import { BACKEND_URL } from '../config/backendConfig';

const isProduction = import.meta.env.PROD;

export const API = axios.create({
    baseURL: BACKEND_URL + `${isProduction ? '/notes-app/api' : '/api'}`,
});