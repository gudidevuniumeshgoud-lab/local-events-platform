let currentConversationUserId = null;

async function loadChat() {
  if (!requireAuth()) return;

  const urlParams = new URLSearchParams(window.location.search);
  currentConversationUserId = urlParams.get('userId');

  if (!currentConversationUserId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'admin') {
      loadChatList();
    } else {
      loadAdminList();
    }
  } else {
    loadConversation(currentConversationUserId);
  }

  setupMessageForm();
}

async function loadChatList() {
  try {
    const data = await userAPI.getAllUsers(1, 1000);
    if (data.success) {
      displayChatList(data.users.filter((u) => u.role === 'user'));
    }
  } catch (error) {
    console.error('Error loading chat list:', error);
  }
}

async function loadAdminList() {
  try {
    const data = await userAPI.getAllUsers(1, 1000);
    if (data.success) {
      const admins = data.users.filter((u) => u.role === 'admin');
      if (admins.length > 0) {
        displayChatList(admins);
        selectConversation(admins[0]._id, admins[0].name);
      }
    }
  } catch (error) {
    console.error('Error loading admin list:', error);
  }
}

function displayChatList(users) {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = users
    .map(
      (user) => `
    <div class="chat-item" onclick="selectConversation('${user._id}', '${user.name}')">
      <div style="cursor: pointer; padding: 1rem; background: white; border-radius: 0.5rem;">
        <p style="font-weight: 600;">${user.name}</p>
        <p style="font-size: 0.85rem; color: #6b7280;">${user.email}</p>
      </div>
    </div>
  `
    )
    .join('');
}

function selectConversation(userId, userName) {
  currentConversationUserId = userId;
  document.getElementById('chatHeader').innerHTML = `<h3>💬 Chat with ${userName}</h3>`;
  document.getElementById('chatInputArea').style.display = 'block';
  loadConversation(userId);
}

async function loadConversation(userId) {
  try {
    const data = await messageAPI.getConversation(userId);
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

  if (messages.length === 0) {
    container.innerHTML = '<p class="loading">No messages yet. Start a conversation!</p>';
    return;
  }

  container.innerHTML = messages
    .map(
      (msg) => `
    <div class="message ${msg.senderId._id === currentUser.id ? 'sent' : 'received'}">
      <div class="message-content">
        <strong>${msg.senderId.name}</strong>
        <p>${msg.content}</p>
        <small>${formatTime(msg.createdAt)}</small>
      </div>
    </div>
  `
    )
    .join('');

  // Auto scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function setupMessageForm() {
  const form = document.getElementById('messageForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = document.getElementById('messageInput').value;
    const messageType = document.getElementById('messageType').value;

    if (!content.trim()) {
      showToast('Message cannot be empty', 'warning');
      return;
    }

    try {
      const data = await messageAPI.sendMessage(currentConversationUserId, content, messageType);

      if (data.success) {
        document.getElementById('messageInput').value = '';
        loadConversation(currentConversationUserId);
      } else {
        showToast('Error sending message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Error sending message', 'error');
    }
  });
}

// Auto-refresh messages every 3 seconds
setInterval(() => {
  if (currentConversationUserId) {
    loadConversation(currentConversationUserId);
  }
}, 3000);

document.addEventListener('DOMContentLoaded', loadChat);