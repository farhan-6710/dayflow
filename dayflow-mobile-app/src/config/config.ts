// Production Vercel URL
const PRODUCTION_URL = "https://day-flow-backend-63tp.vercel.app";

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_BASE_URL) {
    return process.env.EXPO_PUBLIC_BASE_URL;
  }
  if (__DEV__) {
    return "http://localhost:4000";
  }
  return PRODUCTION_URL;
};

export default getBaseUrl;

export const BASE_URL = getBaseUrl();
