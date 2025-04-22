import axios from 'axios';

import { BACKEND_URL } from '../config/backendConfig';

export const API = axios.create({
    baseURL: BACKEND_URL
});