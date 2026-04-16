async function loadEventDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!eventId) {
    showToast('Event not found', 'error');
    return;
  }

  try {
    const data = await eventAPI.getEventById(eventId);

    if (data.success) {
      displayEventDetails(data.event);
    } else {
      showToast('Failed to load event details', 'error');
    }
  } catch (error) {
    console.error('Error loading event details:', error);
    showToast('Error loading event details', 'error');
  }
}

function displayEventDetails(event) {
  const container = document.getElementById('eventDetailsContainer');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  let actionButtons = '';

  if (token && user.id) {
    actionButtons = `
      <button class="btn-primary" onclick="registerEvent('${event._id}')">Register for Event</button>
      <button class="btn-secondary" onclick="contactAdmin('${event._id}')">Contact Organizer</button>
    `;
  } else {
    actionButtons = `
      <button class="btn-primary" onclick="redirectToLogin()">Login to Register</button>
    `;
  }

  container.innerHTML = `
    <div class="event-details-header">
      <img src="${event.image}" alt="${event.title}" class="event-details-image">
      <div class="event-info">
        <span class="event-category">${event.category.toUpperCase()}</span>
        <h1>${event.title}</h1>
        <div class="event-info-item">
          <strong>📅 Date & Time</strong>
          ${formatDate(event.date)} at ${event.time}
        </div>
        <div class="event-info-item">
          <strong>📍 Location</strong>
          ${event.location}
        </div>
        <div class="event-info-item">
          <strong>👤 Organizer</strong>
          ${event.organizerName}
        </div>
        <div class="event-info-item">
          <strong>💰 Participation Fee</strong>
          ${formatCurrency(event.participationFee)}
        </div>
        <div class="event-info-item">
          <strong>🏆 Prize Money</strong>
          ${formatCurrency(event.prizeMoney)}
        </div>
        <div class="event-info-item">
          <strong>👥 Participants</strong>
          ${event.registeredCount}/${event.capacity}
        </div>
      </div>
    </div>

    <div class="event-description">
      <h3>About this Event</h3>
      <p>${event.description}</p>
    </div>

    <div class="event-action-buttons">
      ${actionButtons}
    </div>
  `;
}

async function registerEvent(eventId) {
  if (!requireAuth()) return;

  try {
    const data = await registrationAPI.registerEvent(eventId);

    if (data.success) {
      showToast('Successfully registered for event!', 'success');
      setTimeout(() => {
        window.location.href = 'user-dashboard.html';
      }, 1500);
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    showToast('Error registering for event', 'error');
  }
}

function contactAdmin(eventId) {
  window.location.href = `chat.html?eventId=${eventId}`;
}

function redirectToLogin() {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadEventDetails();
});