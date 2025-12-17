const isProduction = import.meta.env.PROD;


export const BACKEND_URL = isProduction
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_DEV_SERVER_URL;