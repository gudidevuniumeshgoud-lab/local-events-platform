async function loadDashboard() {
  if (!requireAuth()) return;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // If admin lands on user dashboard, redirect them to admin dashboard
  if (user.role === 'admin') {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  document.getElementById('userName').textContent = user.name || 'User';
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  loadRegisteredEvents();
  loadMessages();
  loadMemberSince();

  setupDashboardNavigation();
  setupProfileForm();
}

async function loadRegisteredEvents() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (data.success) {
      const registrations = data.registrations || [];
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
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p style="font-size: 3rem; margin-bottom: 1rem;">📭</p>
        <p style="color: #6b7280;">You haven't registered for any events yet.</p>
        <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Browse Events</a>
      </div>
    `;
    return;
  }

  container.innerHTML = registrations
    .map(
      (reg) => `
    <div class="event-list-item">
      <div class="event-list-info">
        <h3>${reg.eventId.title}</h3>
        <p><strong>📅</strong> ${new Date(reg.eventId.date).toLocaleDateString()} at ${reg.eventId.time}</p>
        <p><strong>📍</strong> ${reg.eventId.location}</p>
        <p><strong>💰</strong> $${reg.eventId.participationFee}</p>
        <p><strong>Status:</strong> 
          <span style="color: ${reg.status === 'registered' ? '#10b981' : '#ef4444'}; font-weight: 600;">
            ${reg.status.toUpperCase()}
          </span>
        </p>
      </div>
      <div class="event-list-actions">
        <button class="btn-secondary" onclick="viewEvent('${reg.eventId._id}')">View</button>
        <button class="btn-danger" onclick="cancelEventRegistration('${reg.eventId._id}')">Cancel</button>
      </div>
    </div>
  `
    )
    .join('');
}

async function loadMessages() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('messageCount').textContent = data.unreadCount || 0;

      const messagesList = document.getElementById('messagesList');
      const messages = data.messages || [];

      if (messages.length === 0) {
        messagesList.innerHTML = `
          <div style="text-align: center; padding: 2rem;">
            <p style="font-size: 3rem; margin-bottom: 1rem;">📨</p>
            <p style="color: #6b7280;">No messages yet.</p>
          </div>
        `;
        return;
      }

      messagesList.innerHTML = messages.slice(0, 10).map(msg => `
        <div style="padding: 1rem; background: white; border-radius: 0.5rem; border-left: 4px solid #6366f1;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <p style="font-weight: 600; margin-bottom: 0.5rem;">${msg.senderId.name}</p>
              <p style="color: #6b7280; font-size: 0.9rem; margin-bottom: 0.5rem;">${msg.content}</p>
              <small style="color: #9ca3af;">${new Date(msg.createdAt).toLocaleString()}</small>
            </div>
            ${!msg.isRead ? '<span style="background: #6366f1; color: white; padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.75rem;">New</span>' : ''}
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

function loadMemberSince() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const createdYear = new Date().getFullYear();
  document.getElementById('memberSince').textContent = createdYear;
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

      const targetSection = document.getElementById(section);
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
}

function setupProfileForm() {
  const form = document.getElementById('profileForm');
  if (!form) return;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  document.getElementById('profileName').value = user.name || '';
  document.getElementById('profileEmail').value = user.email || '';
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = userData.name;
        user.phone = userData.phone;
        user.location = userData.location;
        user.bio = userData.bio;
        localStorage.setItem('user', JSON.stringify(user));
        showToast('Profile updated successfully', 'success');
      } else {
        showToast('Error updating profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  });

  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      if (confirm('Are you sure? This action cannot be undone.')) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/users/account/delete`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const data = await response.json();

          if (data.success) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            showToast('Account deleted', 'success');
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
}

function viewEvent(eventId) {
  window.location.href = `event-details.html?id=${eventId}`;
}

async function cancelEventRegistration(eventId) {
  if (confirm('Cancel this registration?')) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/registrations/${eventId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

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
