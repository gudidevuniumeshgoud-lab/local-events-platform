async function loadAdminDashboard() {
  if (!requireAuth() || !requireAdmin()) return;

  setupAdminNavigation();
  loadAdminStats();
  loadAdminEvents();
  loadAdminUsers();
  setupCreateEventForm();
  loadAdminMessages();
}

function setupAdminNavigation() {
  const navItems = document.querySelectorAll('.admin-nav-item');

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      navItems.forEach((nav) => nav.classList.remove('active'));
      item.classList.add('active');

      const section = item.getAttribute('data-section');
      document.querySelectorAll('.admin-section').forEach((sec) => {
        sec.classList.remove('active');
      });

      document.getElementById(section).classList.add('active');
    });
  });
}

async function loadAdminStats() {
  try {
    // Get events
    const eventsData = await eventAPI.getAllEvents(1, 1000);
    document.getElementById('totalEvents').textContent = eventsData.total || 0;

    // Get users
    const usersData = await userAPI.getAllUsers(1, 1000);
    document.getElementById('totalUsers').textContent = usersData.total || 0;

    // Get messages
    const messagesData = await messageAPI.getMyMessages();
    document.getElementById('newMessages').textContent = messagesData.unreadCount || 0;

    // Calculate total registrations
    let totalRegistrations = 0;
    if (eventsData.events) {
      totalRegistrations = eventsData.events.reduce((sum, event) => sum + event.registeredCount, 0);
    }
    document.getElementById('totalRegistrations').textContent = totalRegistrations;
  } catch (error) {
    console.error('Error loading admin stats:', error);
  }
}

async function loadAdminEvents() {
  try {
    const data = await eventAPI.getAllEvents(1, 1000);

    if (data.success) {
      displayAdminEvents(data.events);
    }
  } catch (error) {
    console.error('Error loading admin events:', error);
  }
}

function displayAdminEvents(events) {
  const container = document.getElementById('eventsList');

  if (events.length === 0) {
    container.innerHTML = '<p class="loading">No events created yet</p>';
    return;
  }

  container.innerHTML = events
    .map(
      (event) => `
    <div class="admin-event-item">
      <div class="admin-event-item-info">
        <h3>${event.title || 'Untitled'}</h3>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>📅</strong> ${event.date ? event.date.split('T')[0] : 'N/A'} at ${event.time || 'N/A'}</p>
        <p><strong>📍</strong> ${event.location || 'N/A'}</p>
        <p><strong>💰</strong> $${event.participationFee || 0}</p>
        <p><strong>Participants:</strong> ${event.registeredCount}/${event.capacity}</p>
      </div>
      <div class="admin-actions">
        <button class="edit-btn" onclick="editEvent('${event._id}')">Edit</button>
        <button class="delete-btn" onclick="deleteEvent('${event._id}')">Delete</button>
        <button class="view-btn" onclick="viewEventParticipants('${event._id}')">Participants</button>
      </div>
    </div>
  `
    )
    .join('');
}

async function loadAdminUsers() {
  try {
    const data = await userAPI.getAllUsers(1, 1000);

    if (data.success) {
      displayAdminUsers(data.users);
    }
  } catch (error) {
    console.error('Error loading admin users:', error);
  }
}

function displayAdminUsers(users) {
  const container = document.getElementById('usersList');

  if (users.length === 0) {
    container.innerHTML = '<p class="loading">No users found</p>';
    return;
  }

  container.innerHTML = users
    .map(
      (user) => `
    <div class="admin-user-item">
      <div class="admin-user-item-info">
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
        <p><strong>Role:</strong> <span style="color: ${user.role === 'admin' ? '#6366f1' : '#10b981'}">${user.role}</span></p>
        <p><strong>Location:</strong> ${user.location || 'N/A'}</p>
      </div>
      <div class="admin-actions">
        <button class="view-btn" onclick="viewUserProfile('${user._id}')">View</button>
      </div>
    </div>
  `
    )
    .join('');
}

async function loadAdminMessages() {
  try {
    const data = await messageAPI.getMyMessages();

    if (data.success) {
      displayAdminMessages(data.messages);
    }
  } catch (error) {
    console.error('Error loading admin messages:', error);
  }
}

function displayAdminMessages(messages) {
  const container = document.getElementById('messagesList');
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = '<p class="loading">No messages</p>';
    return;
  }

  container.innerHTML = messages
    .slice(0, 20)
    .map(
      (msg) => `
    <div class="admin-message-item">
      <div class="admin-message-item-info">
        <h3>From: ${msg.senderId.name}</h3>
        <p><strong>Email:</strong> ${msg.senderId.email}</p>
        <p><strong>Type:</strong> ${msg.messageType}</p>
        <p><strong>Message:</strong> ${msg.content}</p>
        <p><strong>Time:</strong> ${formatDate(msg.createdAt)}</p>
      </div>
      <div class="admin-actions">
        <button class="view-btn" onclick="replyToMessage('${msg.senderId._id}')">Reply</button>
        <button class="delete-btn" onclick="deleteMessage('${msg._id}')">Delete</button>
      </div>
    </div>
  `
    )
    .join('');
}

function setupCreateEventForm() {
  const form = document.getElementById('createEventForm');

  form.onsubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: document.getElementById('eventTitle').value,
      description: document.getElementById('eventDescription').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      location: document.getElementById('eventLocation').value,
      category: document.getElementById('eventCategory').value,
      participationFee: parseFloat(document.getElementById('participationFee').value),
      prizeMoney: parseFloat(document.getElementById('prizeMoney').value),
      organizerName: document.getElementById('organizerName').value,
      capacity: parseInt(document.getElementById('capacity').value),
      image: document.getElementById('eventImage').value,
      eventLink: document.getElementById('eventLink').value,
    };

    try {
      const data = await eventAPI.createEvent(eventData);

      if (data.success) {
        showToast('Event created successfully', 'success');
        form.reset();
        loadAdminEvents();
        loadAdminStats();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showToast('Error creating event', 'error');
    }
  };
}

function resetCreateForm() {
  const form = document.getElementById('createEventForm');
  form.reset();
  document.querySelector('#create h3').textContent = 'Create / Edit Event';
  document.querySelector('#createEventForm button[type="submit"]').textContent = 'Save Event';
  setupCreateEventForm();
}

async function editEvent(eventId) {
  const eventData = await eventAPI.getEventById(eventId);

  if (eventData.success) {
    const event = eventData.event;
    document.getElementById('eventTitle').value = event.title || '';
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventDate').value = event.date ? event.date.split('T')[0] : '';
    document.getElementById('eventTime').value = event.time || '';
    document.getElementById('eventLocation').value = event.location || '';
    document.getElementById('eventCategory').value = event.category || 'other';
    document.getElementById('participationFee').value = event.participationFee || 0;
    document.getElementById('prizeMoney').value = event.prizeMoney || 0;
    document.getElementById('organizerName').value = event.organizerName || '';
    document.getElementById('capacity').value = event.capacity || 100;
    document.getElementById('eventImage').value = event.image || '';
    document.getElementById('eventLink').value = event.eventLink || '';

    // Scroll to form
    document.getElementById('create').scrollIntoView({ behavior: 'smooth' });
    document.querySelector('#create h3').textContent = 'Edit Event: ' + event.title;
    document.querySelector('#createEventForm button[type="submit"]').textContent = 'Update Event';

    // Change submit button behavior
    const form = document.getElementById('createEventForm');
    form.onsubmit = async (e) => {
      e.preventDefault();

      const eventData = {
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        category: document.getElementById('eventCategory').value,
        participationFee: parseFloat(document.getElementById('participationFee').value),
        prizeMoney: parseFloat(document.getElementById('prizeMoney').value),
        organizerName: document.getElementById('organizerName').value,
        capacity: parseInt(document.getElementById('capacity').value),
        image: document.getElementById('eventImage').value,
        eventLink: document.getElementById('eventLink').value,
      };

      try {
        const data = await eventAPI.updateEvent(eventId, eventData);

        if (data.success) {
          showToast('Event updated successfully', 'success');
          resetCreateForm();
          loadAdminEvents();
          loadAdminStats();
        }
      } catch (error) {
        showToast('Error updating event', 'error');
      }
    };
  }
}

async function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      const data = await eventAPI.deleteEvent(eventId);

      if (data.success) {
        showToast('Event deleted successfully', 'success');
        loadAdminEvents();
        loadAdminStats();
      }
    } catch (error) {
      showToast('Error deleting event', 'error');
    }
  }
}

async function viewEventParticipants(eventId) {
  try {
    const data = await registrationAPI.getEventParticipants(eventId);

    if (data.success) {
      alert(`Event Participants:\n\n${data.participants.map((p) => `${p.userId.name} (${p.userId.email})`).join('\n')}`);
    }
  } catch (error) {
    showToast('Error loading participants', 'error');
  }
}

function viewUserProfile(userId) {
  alert('User ID: ' + userId);
}

function replyToMessage(userId) {
  window.location.href = `chat.html?userId=${userId}`;
}

async function deleteMessage(messageId) {
  if (confirm('Are you sure you want to delete this message?')) {
    try {
      const data = await messageAPI.deleteMessage(messageId);

      if (data.success) {
        showToast('Message deleted', 'success');
        loadAdminMessages();
      }
    } catch (error) {
      showToast('Error deleting message', 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', loadAdminDashboard);
