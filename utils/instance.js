import axios from 'axios';
import toast from 'react-hot-toast';
// const BASE_URL = "http://144.24.111.231:7020";
// const BASE_URL = "https://api.hydroshark.in";
// const BASE_URL = process.env.NEXT_PUBLIC_API;
const BASE_URL = '/api';

const instance = axios.create({
  baseURL: BASE_URL,
});

const excludedUrls = ['/api/singup/', '/api/login/', '/api/refresh-token/'];

// Function to check if the current request is not one of the excluded URLs
function isNotExcludedRequest(config) {
  return !excludedUrls.includes(config.url || '');
}

// Add the interceptor
instance.interceptors.request.use(
  (config) => {
    if (isNotExcludedRequest(config)) {
      const authToken = localStorage.getItem('token');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add an interceptor that checks if the response has a code of 401, then log the user out and throw him at /login
instance.interceptors.response.use(
  (response) => {
    console.log('res.datacheck', response.status, response.status.toString()[0] != '2');
    if (response.status.toString()[0] != '2') {
      console.log('res.datacheck1', response);
      throw response;
    }
    return response;
  },
  (error) => {
    if (error.response.status && error.response.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
      toast.error('Session expired, please login again');
    }

    if (error.response) {
      if (error.response.data) {
        if (error.response.data.errors) {
          Object.keys(error.response.data.errors).map((key) => {
            toast.error(error.response.data.errors[key][0]);
          });
        } else {
          toast.error('Some error has occurred, Please try again!');
        }
      } else {
        toast.error('Some error has occurred, Please try again!');
      }
    } else {
      toast.error('Some error has occurred, Please try again!');
    }

    console.log('res.errres', error);
    throw error;
  }
);

export default instance;
