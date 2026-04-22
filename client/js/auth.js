function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const authLinks = document.getElementById('authLinks');
  const userMenu = document.getElementById('userMenu');

  if (token && user.id) {
    if (authLinks) authLinks.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';

    // Set the Dashboard link based on the user's role
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
      dashboardLink.href = user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
    }

    // Set logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    if (authLinks) authLinks.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

function requireAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user.id) {
    window.location.href = 'login.html';
    return false;
  }

  return true;
}

function requireAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role !== 'admin') {
    showToast('Admin access required', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    return false;
  }

  return true;
}

// Check auth on page load
document.addEventListener('DOMContentLoaded', checkAuth);
