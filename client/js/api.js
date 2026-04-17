const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Auth API
const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password })
    });
    return await response.json();
  },
  
  registerAdmin: async (name, email, password, adminCode) => {
    const response = await fetch(`${API_BASE_URL}/auth/register-admin`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, password, adminCode })
    });
    return await response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};

// Event API
const eventAPI = {
  getAllEvents: async (page = 1, limit = 10, category = '', location = '', search = '') => {
    let url = `${API_BASE_URL}/events?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (location) url += `&location=${location}`;
    if (search) url += `&search=${search}`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  getEventById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  createEvent: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return await response.json();
  },

  updateEvent: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return await response.json();
  },

  deleteEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};

// Registration API
const registrationAPI = {
  registerEvent: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ eventId })
    });
    return await response.json();
  },

  getRegisteredEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  cancelRegistration: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/registrations/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};

// Message API
const messageAPI = {
  sendMessage: async (receiverId, content) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiverId, content })
    });
    return await response.json();
  },

  getConversation: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/messages/conversation/${userId}`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  getMyMessages: async () => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  deleteMessage: async (messageId) => {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};

// User API
const userAPI = {
  getAllUsers: async (page = 1, limit = 10, role = '') => {
    let url = `${API_BASE_URL}/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;

    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return await response.json();
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/account/delete`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return await response.json();
  }
};
