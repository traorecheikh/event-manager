import axios from 'axios';

const API_BASE_URL_EVENTS = 'http://localhost:5000/api/events';
const API_BASE_URL_AUTH = 'http://localhost:5000/api/auth'; // Fixed base for auth endpoints

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Function to set the Authorization header if token exists
const getAuthHeaders = () => {
  const token = getToken();
  // Removed console.warn for brevity, but can be useful for debugging
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Auth Service Functions ---
export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ id: response.data.userId, email: response.data.email }));
  }
  return response.data;
};

export const register = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/register`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({ id: response.data.userId, email: response.data.email }));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // console.log('User logged out'); // Optional: for debugging
};

export const getProfile = async () => {
  const response = await axios.get(`${API_BASE_URL_AUTH}/profile`, { headers: getAuthHeaders() });
  return response.data;
};

export const isAuthenticated = () => !!getToken();

// --- Event Service Functions ---
export const getEvents = async (eventId = null) => {
  try {
    // If eventId is provided, fetch a single event, otherwise fetch all.
    // This assumes backend GET /api/events/:id for single and GET /api/events for all.
    const url = eventId ? `${API_BASE_URL_EVENTS}/${eventId}` : API_BASE_URL_EVENTS;
    const response = await axios.get(url, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_BASE_URL_EVENTS, eventData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`${API_BASE_URL_EVENTS}/${id}`, eventData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL_EVENTS}/${id}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    throw error;
  }
};

