async function loadDashboard() {
  if (!requireAuth()) return;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Set user profile
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;

  // Load dashboard stats
  loadRegisteredEvents();
  loadMessages();

  // Setup navigation
  setupDashboardNavigation();

  // Setup profile form
  setupProfileForm();
}

async function loadRegisteredEvents() {
  try {
    const data = await registrationAPI.getRegisteredEvents();

    if (data.success) {
      const registrations = data.registrations;
      document.getElementById('registeredCount').textContent = registrations.length;

      const upcomingCount = registrations.filter(
        (r) => new Date(r.eventId.date) > new Date()
      ).length;
      document.getElementById('upcomingCount').textContent = upcomingCount;

      displayRegisteredEvents(registrations);
    }
  } catch (error) {
    console.error('Error loading registered events:', error);
  }
}

function displayRegisteredEvents(registrations) {
  const container = document.getElementById('registeredEventsList');

  if (registrations.length === 0) {
    container.innerHTML = '<p class="loading">You haven\'t registered for any events yet</p>';
    return;
  }

  container.innerHTML = registrations
    .map(
      (reg) => `
    <div class="event-list-item">
      <div class="event-list-info">
        <h3>${reg.eventId.title}</h3>
        <p><strong>📅</strong> ${formatDate(reg.eventId.date)} at ${reg.eventId.time}</p>
        <p><strong>📍</strong> ${reg.eventId.location}</p>
        <p><strong>Status:</strong> <span style="color: ${reg.status === 'registered' ? '#10b981' : '#ef4444'}">${reg.status}</span></p>
      </div>
      <div class="event-list-actions">
        <button class="btn-secondary" onclick="viewEvent('${reg.eventId._id}')">View</button>
        <button class="btn-danger" onclick="cancelEvent('${reg.eventId._id}')">Cancel</button>
      </div>
    </div>
  `
    )
    .join('');
}

async function loadMessages() {
  try {
    const data = await messageAPI.getMyMessages();

    if (data.success) {
      document.getElementById('messageCount').textContent = data.unreadCount;
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function setupDashboardNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      navItems.forEach((nav) => nav.classList.remove('active'));
      item.classList.add('active');

      const section = item.getAttribute('data-section');
      document.querySelectorAll('.dashboard-section').forEach((sec) => {
        sec.classList.remove('active');
      });

      document.getElementById(section).classList.add('active');
    });
  });
}

function setupProfileForm() {
  const form = document.getElementById('profileForm');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Load current user data
  document.getElementById('profileName').value = user.name || '';
  document.getElementById('profilePhone').value = user.phone || '';
  document.getElementById('profileLocation').value = user.location || '';
  document.getElementById('profileBio').value = user.bio || '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
      name: document.getElementById('profileName').value,
      phone: document.getElementById('profilePhone').value,
      location: document.getElementById('profileLocation').value,
      bio: document.getElementById('profileBio').value,
    };

    try {
      const data = await userAPI.updateProfile(userData);

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        showToast('Profile updated successfully', 'success');
      } else {
        showToast('Error updating profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  });

  document.getElementById('deleteAccountBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const data = await userAPI.deleteAccount();

        if (data.success) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          showToast('Account deleted successfully', 'success');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        }
      } catch (error) {
        showToast('Error deleting account', 'error');
      }
    }
  });
}

function viewEvent(eventId) {
  window.location.href = `event-details.html?id=${eventId}`;
}

async function cancelEvent(eventId) {
  if (confirm('Are you sure you want to cancel this registration?')) {
    try {
      const data = await registrationAPI.cancelRegistration(eventId);

      if (data.success) {
        showToast('Registration cancelled', 'success');
        loadRegisteredEvents();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      showToast('Error cancelling registration', 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);