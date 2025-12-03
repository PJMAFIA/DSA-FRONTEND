import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

export const signup = async (fullName: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      fullName,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const getProtectedData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to access protected data' };
  }
};

export const sendChatMessage = async (content: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await axios.post(
      `${API_URL}/chat`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to send message' };
  }
};

export const getChatHistory = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/chat/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch chat history' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};