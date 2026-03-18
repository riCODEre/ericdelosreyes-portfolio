import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const apiClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
})

