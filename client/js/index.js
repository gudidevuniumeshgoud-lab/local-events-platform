let currentPage = 1;
const eventsPerPage = 10;

async function loadEvents(page = 1) {
  try {
    const search = document.getElementById('searchInput')?.value || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';

    const data = await eventAPI.getAllEvents(page, eventsPerPage, category, location, search);

    if (data.success) {
      displayEvents(data.events);
      displayPagination(data.pages, page);
    } else {
      showToast('Failed to load events', 'error');
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showToast('Error loading events', 'error');
  }
}

function displayEvents(events) {
  const eventsGrid = document.getElementById('eventsGrid');

  if (events.length === 0) {
    eventsGrid.innerHTML = '<p class="loading">No events found</p>';
    return;
  }

  eventsGrid.innerHTML = events
    .map(
      (event) => `
    <div class="event-card" onclick="viewEventDetails('${event._id}')">
      <img src="${event.image}" alt="${event.title}" class="event-card-image">
      <div class="event-card-content">
        <span class="event-category">${event.category.toUpperCase()}</span>
        <h3>${event.title}</h3>
        <p><strong>📍</strong> ${event.location}</p>
        <p><strong>📅</strong> ${formatDate(event.date)}</p>
        <p><strong>⏰</strong> ${event.time}</p>
        <p>${event.description.substring(0, 80)}...</p>
        <div class="event-card-footer">
          <span class="event-price">${formatCurrency(event.participationFee)}</span>
          <span class="event-seats">${event.registeredCount}/${event.capacity}</span>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

function displayPagination(pages, currentPage) {
  const pagination = document.getElementById('pagination');

  let html = '';

  if (currentPage > 1) {
    html += `<button class="pagination-btn" onclick="loadEvents(${currentPage - 1})">← Previous</button>`;
  }

  for (let i = 1; i <= pages; i++) {
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="loadEvents(${i})">${i}</button>`;
  }

  if (currentPage < pages) {
    html += `<button class="pagination-btn" onclick="loadEvents(${currentPage + 1})">Next →</button>`;
  }

  pagination.innerHTML = html;
}

function viewEventDetails(eventId) {
  window.location.href = `event-details.html?id=${eventId}`;
}

// Search functionality
document.getElementById('searchBtn')?.addEventListener('click', () => {
  loadEvents(1);
});

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadEvents();
});