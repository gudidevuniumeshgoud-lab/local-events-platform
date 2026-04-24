let currentConversationUserId = null;
let currentUserRole = null;

async function loadChat() {
  console.log('🔄 Loading chat...');
  
  if (!requireAuth()) {
    console.log('❌ Not authenticated');
    return;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  currentUserRole = user.role;

  console.log('👤 Current user:', user.email, 'Role:', user.role);
  
  loadContactsList();
  setupMessageForm();
  
  setInterval(() => {
    if (currentConversationUserId) {
      loadConversation(currentConversationUserId);
    }
  }, 2000);
}

async function loadContactsList() {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔐 Token exists:', !!token);
    console.log('👤 User role:', user.role);

    let url = 'https://local-events-platform.onrender.com/api/users?page=1&limit=100';
    
    if (user.role === 'admin') {
      console.log('👨‍💼 Admin user - fetching regular users');
      url += '&role=user';
    } else {
      console.log('👤 Regular user - fetching admins');
      url += '&role=admin';
    }

    console.log('📡 Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📨 Response status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (data.success && data.users && data.users.length > 0) {
      console.log('✅ Contacts found:', data.users.length);
      displayContactsList(data.users);
    } else {
      console.warn('⚠️ No contacts found');
      displayContactsList([]);
    }
  } catch (error) {
    console.error('❌ Error loading contacts:', error);
    displayContactsList([]);
  }
}

function displayContactsList(contacts) {
  const chatList = document.getElementById('chatList');

  console.log('🎨 Displaying contacts:', contacts.length);

  if (!contacts || contacts.length === 0) {
    chatList.innerHTML = '<p class="loading" style="padding: 1rem; color: #6b7280; text-align: center;">No contacts available</p>';
    return;
  }

  const html = contacts.map(contact => {
    console.log('Adding contact:', contact.name);
    return `
      <div class="chat-user" onclick="selectConversation('${contact._id}', '${contact.name}', '${contact.email}')">
        <div class="chat-user-name">${contact.name}</div>
        <div class="chat-user-email">${contact.email}</div>
      </div>
    `;
  }).join('');

  chatList.innerHTML = html;
  console.log('✅ Contacts displayed');
}

function selectConversation(userId, userName, userEmail) {
  console.log('💬 Selected conversation:', userName);
  
  currentConversationUserId = userId;
  
  document.querySelectorAll('.chat-user').forEach(el => el.classList.remove('active'));
  if (window.event && window.event.currentTarget) {
    window.event.currentTarget.classList.add('active');
  }

  document.getElementById('chatHeader').innerHTML = `
    <h3>💬 ${userName}</h3>
    <small>${userEmail}</small>
  `;

  document.getElementById('chatInputArea').style.display = 'block';

  loadConversation(userId);
}

async function loadConversation(userId) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`https://local-events-platform.onrender.com/api/messages/conversation/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      displayMessages(data.messages);
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
  }
}

function displayMessages(messages) {
  const container = document.getElementById('messagesContainer');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (!messages || messages.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📧</div>
        <p>No messages yet. Start the conversation!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages.map((msg) => {
    const isSent = msg.senderId._id === currentUser.id;
    return `
      <div class="message ${isSent ? 'sent' : 'received'}">
        <div>
          <div class="message-bubble">
            ${msg.content}
          </div>
          <div class="message-time">
            ${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    `;
  }).join('');

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 100);
}

function setupMessageForm() {
  const form = document.getElementById('messageForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = document.getElementById('messageInput').value.trim();

    if (!content) {
      showToast('Message cannot be empty', 'warning');
      return;
    }

    if (!currentConversationUserId) {
      showToast('Please select a contact first', 'warning');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://local-events-platform.onrender.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: currentConversationUserId,
          content: content
        })
      });

      const data = await response.json();

      if (data.success) {
        document.getElementById('messageInput').value = '';
        loadConversation(currentConversationUserId);
        showToast('Message sent!', 'success');
      } else {
        showToast(data.message || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', loadChat);
