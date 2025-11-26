import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PRODUCT_API || 'http://localhost:3002/api',
});
