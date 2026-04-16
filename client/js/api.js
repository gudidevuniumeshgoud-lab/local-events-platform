const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Auth APIs
const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Event APIs
const eventAPI = {
  getAllEvents: async (page = 1, limit = 10, category = '', location = '', search = '') => {
    let url = `${API_BASE_URL}/events?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (location) url += `&location=${location}`;
    if (search) url += `&search=${search}`;

    const response = await fetch(url, { headers: getHeaders() });
    return response.json();
  },

  getEventById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(eventData),
    });
    return response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  getEventsByOrganizer: async () => {
    const response = await fetch(`${API_BASE_URL}/events/organizer/events`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Registration APIs
const registrationAPI = {
  registerEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ eventId }),
    });
    return response.json();
  },

  getRegisteredEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  cancelRegistration: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/registrations/${eventId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  getEventParticipants: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/registrations/event/${eventId}/participants`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// Message APIs
const messageAPI = {
  sendMessage: async (receiverId, content, messageType = 'info') => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId, content, messageType }),
    });
    return response.json();
  },

  getConversation: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  getMyMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  deleteMessage: async (messageId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// User APIs
const userAPI = {
  getAllUsers: async (page = 1, limit = 10, role = '') => {
    let url = `${API_BASE_URL}/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;

    const response = await fetch(url, { headers: getHeaders() });
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/account/delete`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },
};