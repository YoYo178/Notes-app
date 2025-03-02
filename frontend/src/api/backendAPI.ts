import axios from 'axios';

import { BACKEND_URL } from '../config/backendConfig';

export default axios.create({
    baseURL: BACKEND_URL
});