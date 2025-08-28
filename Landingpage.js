// ========== Search Functionality ==========
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    // Store search query for potential use in other pages
    localStorage.setItem('artpathSearchQuery', query);
    // For now, show an alert but this could redirect to search results
    alert(`Searching for: ${query}`);
    // TODO: Implement search filtering or redirection to search results page
  }
}

// ========== User Choice Actions ==========
function startPortfolio() {
  const user = getUser();
  if (user) {
    window.location.href = "artist_onboarding.html";
  } else {
    showAuthModal('register');
  }
}

function startLearning() {
  window.location.href = "learn.html";
}

function continueAsGuest() {
  localStorage.setItem('artpathGuest', 'true');
  localStorage.removeItem('artpathUser');
  updateAuthUI();
  alert("You're now exploring as a guest! You can browse but some features require registration.");
}

// ========== API Configuration ==========
const API_BASE_URL = window.location.origin + '/api';

// ========== Authentication Functions ==========
function getUser() {
  const token = localStorage.getItem('artpathToken');
  if (!token) return null;
  
  try {
    // Decode JWT token to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      // Token expired, remove it
      localStorage.removeItem('artpathToken');
      localStorage.removeItem('artpathUser');
      return null;
    }
    return localStorage.getItem('artpathUser');
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('artpathToken');
    localStorage.removeItem('artpathUser');
    return null;
  }
}

function getAuthToken() {
  return localStorage.getItem('artpathToken');
}

function setAuthData(user, token) {
  localStorage.setItem('artpathUser', user.name);
  localStorage.setItem('artpathEmail', user.email);
  localStorage.setItem('artpathToken', token);
  localStorage.setItem('artpathMemberSince', user.createdAt || new Date().toISOString());
}

function clearAuthData() {
  localStorage.removeItem('artpathUser');
  localStorage.removeItem('artpathEmail');
  localStorage.removeItem('artpathToken');
  localStorage.removeItem('artpathMemberSince');
}

function logout() {
  clearAuthData();
  updateAuthUI();
  // Redirect to home page if not already there
  if (window.location.pathname !== '/Artpath.html' && !window.location.pathname.endsWith('Artpath.html')) {
    window.location.href = 'Artpath.html';
  }
}

// ========== API Helper Functions ==========
async function apiCall(endpoint, options = {}) {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

// ========== Auth Modal Functions ==========
function showAuthModal(tab) {
  const authModal = document.getElementById('authModal');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showLoginTab = document.getElementById('showLoginTab');
  const showRegisterTab = document.getElementById('showRegisterTab');
  
  if (!authModal) return;
  
  authModal.classList.remove('hidden');
  
  if (tab === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    showLoginTab.classList.remove('active');
    showRegisterTab.classList.add('active');
  } else {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    showLoginTab.classList.add('active');
    showRegisterTab.classList.remove('active');
  }
}

// ========== Enhanced Auth UI Update ==========
async function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  const sidebarAuthLink = document.getElementById('sidebarAuthLink');
  const user = getUser();
  const isGuest = localStorage.getItem('artpathGuest') === 'true';
  
  // Show/hide nav links - show for logged in users AND guests
  document.querySelectorAll('.protected-link').forEach(link => {
    link.style.display = (user || isGuest) ? '' : 'none';
  });
  
  // Update dashboard welcome message if on dashboard page
  const dashboardWelcome = document.querySelector('.dashboard-welcome');
  if (dashboardWelcome && user) {
    dashboardWelcome.textContent = `Welcome, ${user}`;
  }
  
  // Show welcome/logout or login/register
  if (user) {
    authArea.innerHTML = `<span class='welcome-msg'>Welcome, ${user}</span> <button class='menu-toggle' id='logoutBtn'>Logout</button>`;
    document.getElementById('logoutBtn').onclick = logout;
    if (sidebarAuthLink) {
      sidebarAuthLink.textContent = 'Logout';
      sidebarAuthLink.onclick = (e) => { e.preventDefault(); closeSidebar(); };
    }
  } else if (isGuest) {
    authArea.innerHTML = `<span class='welcome-msg'>Exploring as Guest</span>`;
    if (sidebarAuthLink) {
      sidebarAuthLink.textContent = 'Continue as Guest';
      sidebarAuthLink.onclick = (e) => { e.preventDefault(); closeSidebar(); };
    }
  } else {
    authArea.innerHTML = `<button id='openAuthModal' class='menu-toggle'>Login / Register</button>`;
    document.getElementById('openAuthModal').onclick = () => showAuthModal('login');
    if (sidebarAuthLink) {
      sidebarAuthLink.textContent = 'Login / Register';
      sidebarAuthLink.onclick = (e) => { e.preventDefault(); closeSidebar(); showAuthModal('login'); };
    }
  }
}

// ========== Auth Form Handlers ==========
async function handleLogin(e) {
  e.preventDefault();
  clearAuthMessage();
  
  const email = document.getElementById('loginName').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showAuthMessage('Please enter your email and password.');
    return;
  }
  
  if (password.length < 6) {
    showAuthMessage('Password must be at least 6 characters.');
    return;
  }
  
  try {
    showAuthMessage('Logging in...', 'info');
    
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    setAuthData(response.user, response.token);
    updateAuthUI();
    showAuthMessage('Login successful!', 'success');
    
    setTimeout(() => {
      document.getElementById('authModal').classList.add('hidden');
    }, 900);
    
  } catch (error) {
    showAuthMessage(error.message || 'Login failed. Please try again.');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  clearAuthMessage();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  
  if (!name || !email || !password) {
    showAuthMessage('Please fill in all fields.');
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showAuthMessage('Please enter a valid email address.');
    return;
  }
  
  if (password.length < 6) {
    showAuthMessage('Password must be at least 6 characters.');
    return;
  }
  
  try {
    showAuthMessage('Creating your account...', 'info');
    
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    setAuthData(response.user, response.token);
    updateAuthUI();
    showAuthMessage('Registration successful!', 'success');
    
    setTimeout(() => {
      document.getElementById('authModal').classList.add('hidden');
    }, 900);
    
  } catch (error) {
    showAuthMessage(error.message || 'Registration failed. Please try again.');
  }
}

// ========== User Profile Management ==========
async function getCurrentUser() {
  try {
    const response = await apiCall('/auth/me');
    return response.user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

async function updateUserProfile(profileData) {
  try {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response;
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
}

// ========== Enhanced Auth Message Display ==========
function showAuthMessage(msg, type = 'error') {
  const authMessage = document.getElementById('authMessage');
  if (!authMessage) return;
  
  authMessage.textContent = msg;
  authMessage.className = 'auth-message ' + type;
  
  // Add info type styling
  if (type === 'info') {
    authMessage.style.color = '#60aaff';
    authMessage.style.background = 'rgba(96, 170, 255, 0.1)';
  }
  
  if (type === 'success') {
    setTimeout(() => { authMessage.textContent = ''; }, 1200);
  }
}

function clearAuthMessage() {
  const authMessage = document.getElementById('authMessage');
  if (authMessage) {
    authMessage.textContent = '';
  }
}

// ========== Sidebar Menu Toggle ==========
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) {
    sidebar.classList.toggle("show");
  }
  if (overlay) {
    overlay.classList.toggle("show");
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) {
    sidebar.classList.remove("show");
  }
  if (overlay) {
    overlay.classList.remove("show");
  }
}

// ========== Dashboard Functions ==========
function openUploadArtModal() {
  const modal = document.getElementById('uploadArtModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeUploadArtModal() {
  const modal = document.getElementById('uploadArtModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function handleArtUpload(e) {
  e.preventDefault();
  const form = e.target;
  const fileInput = document.getElementById('artImage');
  const titleInput = document.getElementById('artTitle');
  const descInput = document.getElementById('artDesc');
  const messageDiv = document.getElementById('uploadArtMsg');
  
  if (!fileInput.files[0] || !titleInput.value.trim() || !descInput.value.trim()) {
    showUploadMessage('Please fill in all fields', 'error');
    return;
  }
  
  // Simulate upload process
  showUploadMessage('Uploading artwork...', 'success');
  
  setTimeout(() => {
    showUploadMessage('Artwork uploaded successfully!', 'success');
    form.reset();
    setTimeout(() => {
      closeUploadArtModal();
    }, 1500);
  }, 2000);
}

function showUploadMessage(msg, type) {
  const messageDiv = document.getElementById('uploadArtMsg');
  if (messageDiv) {
    messageDiv.textContent = msg;
    messageDiv.className = 'auth-message ' + type;
  }
}

// ========== Learning Functions ==========
function showTopicSelector() {
  const topicSelector = document.getElementById('topicSelector');
  if (topicSelector) {
    topicSelector.classList.remove('hidden');
    window.scrollTo({ top: topicSelector.offsetTop, behavior: 'smooth' });
  }
}

let selectedTopics = new Set();

function toggleTopic(card) {
  const topic = card.querySelector('span') ? card.querySelector('span').innerText : card.innerText.trim();
  if (selectedTopics.has(topic)) {
    selectedTopics.delete(topic);
    card.classList.remove('selected');
  } else {
    selectedTopics.add(topic);
    card.classList.add('selected');
  }
  updateContinueButton();
}

function updateContinueButton() {
  const btn = document.getElementById('continueTopics') || document.getElementById('continue-button');
  if (!btn) return;
  
  if (selectedTopics.size > 0) {
    btn.disabled = false;
    btn.classList.add('enabled');
  } else {
    btn.disabled = true;
    btn.classList.remove('enabled');
  }
}

function continueAfterTopics() {
  localStorage.setItem("selectedTopics", JSON.stringify(Array.from(selectedTopics)));
  // Redirect to learning plan or dashboard
  const user = getUser();
  if (user) {
    window.location.href = "learn.html";
  } else {
    showAuthModal('register');
  }
}

// ========== Art Gallery Functions ==========
const artworks = [
      { title: 'Dreamscape', artist: 'Artist 1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Digital Muse', artist: 'Priya S.', url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Logo Flow', artist: 'Alex R.', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', category: 'logo' },
      { title: 'Serenity', artist: 'Artist 2', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Neon Dreams', artist: 'Chris P.', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', category: 'digital' },
      { title: 'Brand Spark', artist: 'Artist 3', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', category: 'logo' },
  { title: 'Abstract Harmony', artist: 'Sam W.', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Classic Portrait', artist: 'Emma L.', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
];

function renderGallery(filter = 'all') {
  const grid = document.getElementById('artGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  const filtered = filter === 'all' ? artworks : artworks.filter(a => a.category === filter);
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="color:#bfc2d1; text-align:center; width:100%; padding: 40px;">No artworks found for this category.</div>';
    return;
  }
  
  filtered.forEach(art => {
    const card = document.createElement('div');
    card.className = 'art-card';
    card.innerHTML = `
      <img src="${art.url}" alt="${art.title}" loading="lazy" />
      <div class="art-title" style="font-weight:700; color:#fff; margin-top:8px;">${art.title}</div>
      <div class="art-artist" style="color:#bfc2d1; font-size:0.98rem;">by ${art.artist}</div>
    `;
    
    // Add click handler for art cards
    card.addEventListener('click', () => {
      showArtDetail(art);
    });
    
    grid.appendChild(card);
  });
}

function showArtDetail(art) {
  const user = getUser();
  if (!user) {
    showAuthModal('login');
    return;
  }
  
  // Create a simple modal to show art details
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
      <img src="${art.url}" alt="${art.title}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />
      <h3 style="color: #fff; margin-bottom: 8px;">${art.title}</h3>
      <p style="color: #bfc2d1; margin-bottom: 16px;">by ${art.artist}</p>
      <button onclick="contactArtist('${art.artist}')" style="background: #1DBF73; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Contact Artist</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function contactArtist(artistName) {
  alert(`Contact form for ${artistName} would open here. This feature requires backend integration.`);
}

// ========== Help Chat Functions ==========
function setupHelpChat() {
  const helpChatBtn = document.getElementById('helpChatBtn');
  const helpChatModal = document.getElementById('helpChatModal');
  const closeHelpChatModal = document.getElementById('closeHelpChatModal');
  const helpChatForm = document.getElementById('helpChatForm');
  
  if (helpChatBtn) {
    helpChatBtn.addEventListener('click', () => {
      helpChatModal.classList.remove('hidden');
    });
  }
  
  if (closeHelpChatModal) {
    closeHelpChatModal.addEventListener('click', () => {
      helpChatModal.classList.add('hidden');
    });
  }
  
  if (helpChatForm) {
    helpChatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('helpChatEmail').value;
      const message = document.getElementById('helpChatMessage').value;
      
      // Simulate sending message
      document.getElementById('helpChatThanks').style.display = 'block';
      helpChatForm.style.display = 'none';
      
      setTimeout(() => {
        helpChatModal.classList.add('hidden');
        helpChatForm.style.display = 'flex';
        document.getElementById('helpChatThanks').style.display = 'none';
        helpChatForm.reset();
      }, 2000);
    });
  }
}

// ========== Settings Functions ==========
function setupSettings() {
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const settingsTabs = document.querySelectorAll('.settings-tab');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const resetSettingsBtn = document.getElementById('resetSettingsBtn');
  
  // Close settings modal
  if (closeSettingsModal) {
    closeSettingsModal.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }
  
  // Tab switching
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      settingsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show target content
      document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(targetTab + 'Tab').classList.add('active');
    });
  });
  
  // Save settings
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
  }
  
  // Reset settings
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetSettings);
  }
  
  // Setup other settings interactions
  setupSettingsInteractions();
  
  // Load current settings
  loadSettings();
}

function setupSettingsInteractions() {
  // Font size controls
  const decreaseFont = document.getElementById('decreaseFont');
  const increaseFont = document.getElementById('increaseFont');
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  
  if (decreaseFont && increaseFont && fontSizeDisplay) {
    decreaseFont.addEventListener('click', () => changeFontSize(-1));
    increaseFont.addEventListener('click', () => changeFontSize(1));
  }
  
  // Quiet hours toggle
  const quietHoursToggle = document.getElementById('quietHoursToggle');
  const quietHoursRange = document.getElementById('quietHoursRange');
  
  if (quietHoursToggle && quietHoursRange) {
    quietHoursToggle.addEventListener('change', () => {
      quietHoursRange.style.display = quietHoursToggle.checked ? 'flex' : 'none';
    });
  }
  
  // Theme selection
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      applyTheme(e.target.value);
    });
  });
  
  // Animation speed
  const animationSpeedSelect = document.getElementById('animationSpeedSelect');
  if (animationSpeedSelect) {
    animationSpeedSelect.addEventListener('change', (e) => {
      applyAnimationSpeed(e.target.value);
    });
  }
  
  // Account actions
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const exportDataBtn = document.getElementById('exportDataBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', showChangePasswordModal);
  }
  
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', exportUserData);
  }
  
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', showDeleteAccountConfirmation);
  }
}

function changeFontSize(delta) {
  const fontSizeDisplay = document.getElementById('fontSizeDisplay');
  const currentSize = fontSizeDisplay.textContent;
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];
  let currentIndex = sizes.indexOf(currentSize);
  
  currentIndex = Math.max(0, Math.min(sizes.length - 1, currentIndex + delta));
  fontSizeDisplay.textContent = sizes[currentIndex];
  
  // Apply font size to body
  const fontSizes = ['0.9rem', '1rem', '1.1rem', '1.2rem'];
  document.body.style.fontSize = fontSizes[currentIndex];
  
  // Save to localStorage
  localStorage.setItem('artpathFontSize', sizes[currentIndex]);
}

function applyTheme(theme) {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('theme-dark', 'theme-light');
  
  if (theme === 'auto') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').missing;
    body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  } else {
    body.classList.add(`theme-${theme}`);
  }
  
  // Save to localStorage
  localStorage.setItem('artpathTheme', theme);
}

function applyAnimationSpeed(speed) {
  const body = document.body;
  
  // Remove existing animation classes
  body.classList.remove('animation-fast', 'animation-slow', 'animation-off');
  
  if (speed !== 'normal') {
    body.classList.add(`animation-${speed}`);
  }
  
  // Save to localStorage
  localStorage.setItem('artpathAnimationSpeed', speed);
}

function showChangePasswordModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
      <h3 style="color: #1DBF73; margin-bottom: 24px;">Change Password</h3>
      <form id="changePasswordForm">
        <input type="password" id="currentPassword" placeholder="Current Password" required class="setting-input" style="margin-bottom: 16px;">
        <input type="password" id="newPassword" placeholder="New Password" required class="setting-input" style="margin-bottom: 16px;">
        <input type="password" id="confirmPassword" placeholder="Confirm New Password" required class="setting-input" style="margin-bottom: 24px;">
        <button type="submit" class="save-settings-btn" style="width: 100%;">Update Password</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle form submission
  const form = document.getElementById('changePasswordForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    
    if (newPass.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Simulate password change
    alert('Password updated successfully!');
    modal.remove();
  });
}

function exportUserData() {
  const user = getUser();
  const userData = {
    username: user || 'Guest',
    email: localStorage.getItem('artpathEmail') || 'Not provided',
    memberSince: localStorage.getItem('artpathMemberSince') || new Date().toISOString(),
    settings: getAllSettings(),
    timestamp: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `artpath-data-${user || 'guest'}-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  alert('Data exported successfully!');
}

function showDeleteAccountConfirmation() {
  const user = getUser();
  if (!user) {
    alert('No account to delete. You are currently a guest.');
    return;
  }
  
  const confirmed = confirm(`Are you sure you want to delete your account "${user}"? This action cannot be undone and all your data will be permanently lost.`);
  
  if (confirmed) {
    // Simulate account deletion
    clearAuthData();
    updateAuthUI();
    
    alert('Account deleted successfully. You have been logged out.');
    
    // Close settings modal
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.add('hidden');
    }
  }
}

function getAllSettings() {
  const settings = {};
  
  // Collect all setting values
  const inputs = document.querySelectorAll('#settingsModal input, #settingsModal select');
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      settings[input.id] = input.checked;
    } else if (input.type === 'radio' && input.checked) {
      settings[input.name] = input.value;
    } else if (input.type !== 'radio') {
      input.value;
    }
  });
  
  return settings;
}

function saveSettings() {
  const settings = getAllSettings();
  
  // Save to localStorage
  Object.keys(settings).forEach(key => {
    localStorage.setItem(`artpath_${key}`, JSON.stringify(settings[key]));
  });
  
  // Apply settings immediately
  applySettings(settings);
  
  // Show success message
  const saveBtn = document.getElementById('saveSettingsBtn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Settings Saved!';
  saveBtn.style.background = '#18a065';
  
  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background = '#1DBF73';
  }, 2000);
}

function resetSettings() {
  const confirmed = confirm('Are you sure you want to reset all settings to their default values?');
  
  if (confirmed) {
    // Reset all inputs to default values
    const inputs = document.querySelectorAll('#settingsModal input, #settingsModal select');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = input.defaultChecked;
      } else if (input.type === 'radio') {
        input.checked = input.defaultChecked;
      } else {
        input.value = input.defaultValue;
      }
    });
    
    // Reset font size display
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = 'Medium';
    }
    
    // Reset theme to dark
    const darkThemeRadio = document.querySelector('input[name="theme"][value="dark"]');
    if (darkThemeRadio) {
      darkThemeRadio.checked = true;
    }
    
    // Reset animation speed to normal
    const animationSpeedSelect = document.getElementById('animationSpeedSelect');
    if (animationSpeedSelect) {
      animationSpeedSelect.value = 'normal';
    }
    
    // Apply default settings
    applySettings({
      theme: 'dark',
      animationSpeed: 'normal',
      fontSize: 'Medium'
    });
    
    alert('Settings reset to default values!');
  }
}

function applySettings(settings) {
  // Apply theme
  if (settings.theme) {
    applyTheme(settings.theme);
  }
  
  // Apply animation speed
  if (settings.animationSpeed) {
    applyAnimationSpeed(settings.animationSpeed);
  }
  
  // Apply font size
  if (settings.fontSize) {
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = settings.fontSize;
    }
  }
}

function loadSettings() {
  // Load saved settings from localStorage
  const inputs = document.querySelectorAll('#settingsModal input, #settingsModal select');
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(`artpath_${input.id || input.name}`);
    if (savedValue !== null) {
      if (input.type === 'checkbox') {
        input.checked = JSON.parse(savedValue);
      } else if (input.type === 'radio') {
        if (input.value === JSON.parse(savedValue)) {
          input.checked = true;
        }
      } else {
        input.value = JSON.parse(savedValue);
      }
    }
  });
  
  // Load font size
  const savedFontSize = localStorage.getItem('artpathFontSize');
  if (savedFontSize) {
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = savedFontSize;
    }
  }
  
  // Load theme
  const savedTheme = localStorage.getItem('artpathTheme');
  if (savedTheme) {
    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) {
      themeRadio.checked = true;
    }
    applyTheme(savedTheme);
  }
  
  // Load animation speed
  const savedAnimationSpeed = localStorage.getItem('artpathAnimationSpeed');
  if (savedAnimationSpeed) {
    const animationSpeedSelect = document.getElementById('animationSpeedSelect');
    if (animationSpeedSelect) {
      animationSpeedSelect.value = savedAnimationSpeed;
    }
    applyAnimationSpeed(savedAnimationSpeed);
  }
  
  // Update account info
  updateSettingsAccountInfo();
}

function applyTheme(theme) {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('theme-dark', 'theme-light');
  
  if (theme === 'auto') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  } else {
    body.classList.add(`theme-${theme}`);
  }
  
  // Save to localStorage
  localStorage.setItem('artpathTheme', theme);
}

function applyAnimationSpeed(speed) {
  const body = document.body;
  
  // Remove existing animation classes
  body.classList.remove('animation-fast', 'animation-slow', 'animation-off');
  
  if (speed !== 'normal') {
    body.classList.add(`animation-${speed}`);
  }
  
  // Save to localStorage
  localStorage.setItem('artpathAnimationSpeed', speed);
}

function showChangePasswordModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
      <h3 style="color: #1DBF73; margin-bottom: 24px;">Change Password</h3>
      <form id="changePasswordForm">
        <input type="password" id="currentPassword" placeholder="Current Password" required class="setting-input" style="margin-bottom: 16px;">
        <input type="password" id="newPassword" placeholder="New Password" required class="setting-input" style="margin-bottom: 16px;">
        <input type="password" id="confirmPassword" placeholder="Confirm New Password" required class="setting-input" style="margin-bottom: 24px;">
        <button type="submit" class="save-settings-btn" style="width: 100%;">Update Password</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle form submission
  const form = document.getElementById('changePasswordForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    
    if (newPass !== confirmPass) {
      alert('New passwords do not match!');
      return;
    }
    
    if (newPass.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Simulate password change
    alert('Password updated successfully!');
    modal.remove();
  });
}

function exportUserData() {
  const user = getUser();
  const userData = {
    username: user || 'Guest',
    email: localStorage.getItem('artpathEmail') || 'Not provided',
    memberSince: localStorage.getItem('artpathMemberSince') || new Date().toISOString(),
    settings: getAllSettings(),
    timestamp: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const settings = getAllSettings();
  
  // Save to localStorage
  Object.keys(settings).forEach(key => {
    localStorage.setItem(`artpath_${key}`, JSON.stringify(settings[key]));
  });
  
  // Apply settings immediately
  applySettings(settings);
  
  // Show success message
  const saveBtn = document.getElementById('saveSettingsBtn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Settings Saved!';
  saveBtn.style.background = '#18a065';
  
  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.style.background = '#1DBF73';
  }, 2000);
}

function resetSettings() {
  const confirmed = confirm('Are you sure you want to reset all settings to their default values?');
  
  if (confirmed) {
    // Reset all inputs to default values
    const inputs = document.querySelectorAll('#settingsModal input, #settingsModal select');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        input.checked = input.defaultChecked;
      } else if (input.type === 'radio') {
        input.checked = input.defaultChecked;
      } else {
        input.value = input.defaultValue;
      }
    });
    
    // Reset font size display
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = 'Medium';
    }
    
    // Reset theme to dark
    const darkThemeRadio = document.querySelector('input[name="theme"][value="dark"]');
    if (darkThemeRadio) {
      darkThemeRadio.checked = true;
    }
    
    // Reset animation speed to normal
    const animationSpeedSelect = document.getElementById('animationSpeedSelect');
    if (animationSpeedSelect) {
      animationSpeedSelect.value = 'normal';
    }
    
    // Apply default settings
    applySettings({
      theme: 'dark',
      animationSpeed: 'normal',
      fontSize: 'Medium'
    });
    
    alert('Settings reset to default values!');
  }
}

function applySettings(settings) {
  // Apply theme
  if (settings.theme) {
    applyTheme(settings.theme);
  }
  
  // Apply animation speed
  if (settings.animationSpeed) {
    applyAnimationSpeed(settings.animationSpeed);
  }
  
  // Apply font size
  if (settings.fontSize) {
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = settings.fontSize;
    }
  }
}

function loadSettings() {
  // Load saved settings from localStorage
  const inputs = document.querySelectorAll('#settingsModal input, #settingsModal select');
  inputs.forEach(input => {
    const savedValue = localStorage.getItem(`artpath_${input.id || input.name}`);
    if (savedValue !== null) {
      if (input.type === 'checkbox') {
        input.checked = JSON.parse(savedValue);
      } else if (input.type === 'radio') {
        if (input.value === JSON.parse(savedValue)) {
          input.checked = true;
        }
      } else {
        input.value = JSON.parse(savedValue);
      }
    }
  });
  
  // Load font size
  const savedFontSize = localStorage.getItem('artpathFontSize');
  if (savedFontSize) {
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) {
      fontSizeDisplay.textContent = savedFontSize;
    }
  }
  
  // Load theme
  const savedTheme = localStorage.getItem('artpathTheme');
  if (savedTheme) {
    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) {
      themeRadio.checked = true;
    }
    applyTheme(savedTheme);
  }
  
  // Load animation speed
  const savedAnimationSpeed = localStorage.getItem('artpathAnimationSpeed');
  if (savedAnimationSpeed) {
    const animationSpeedSelect = document.getElementById('animationSpeedSelect');
    if (animationSpeedSelect) {
      animationSpeedSelect.value = savedAnimationSpeed;
    }
    applyAnimationSpeed(savedAnimationSpeed);
  }
  
  // Update account info
  updateSettingsAccountInfo();
}

function updateSettingsAccountInfo() {
  const user = getUser();
  const email = localStorage.getItem('artpathEmail');
  const memberSince = localStorage.getItem('artpathMemberSince');
  
  const usernameSpan = document.getElementById('settingsUsername');
  const emailSpan = document.getElementById('settingsEmail');
  const memberSinceSpan = document.getElementById('settingsMemberSince');
  
  if (usernameSpan) {
    usernameSpan.textContent = user || 'Guest';
  }
  
  if (emailSpan) {
    emailSpan.textContent = email || 'Not provided';
  }
  
  if (memberSinceSpan) {
    if (memberSince) {
      const date = new Date(memberSince);
      memberSinceSpan.textContent = date.toLocaleDateString();
    } else {
      memberSinceSpan.textContent = 'Today';
    }
  }
}

// ========== Fade-in on Scroll ==========
function fadeInOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in, .section-fade-in, .card-fade-in');
  
  if ('IntersectionObserver' in window) {
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    fadeEls.forEach(el => observer.observe(el));
  } else {
    // fallback for old browsers
    fadeEls.forEach(el => el.classList.add('visible'));
  }
}

// ========== Event Listeners ==========
document.addEventListener('DOMContentLoaded', function() {
  // Initialize auth UI
  updateAuthUI();
  
  // Try to auto-login if token exists
  refreshTokenIfNeeded().then(() => {
    updateAuthUI();
  });
  
  // Setup fade-in animations
  fadeInOnScroll();
  
  // Setup help chat
  setupHelpChat();
  
  // Setup settings
  setupSettings();
  
  // Setup art gallery
  renderGallery();
  
  // Setup gallery filters
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => { 
        b.style.background = '#23243a'; 
        b.style.color = '#eaeaea'; 
      });
      this.style.background = '#1DBF73'; 
      this.style.color = '#fff';
      renderGallery(this.dataset.filter);
    });
  });
  
  // Setup auth modal event listeners
  const authModal = document.getElementById('authModal');
  const openAuthModal = document.getElementById('openAuthModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const showLoginTab = document.getElementById('showLoginTab');
  const showRegisterTab = document.getElementById('showRegisterTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (openAuthModal) {
    openAuthModal.addEventListener('click', () => showAuthModal('login'));
  }
  
  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => authModal.classList.add('hidden'));
  }
  
  if (showLoginTab) {
    showLoginTab.addEventListener('click', () => showAuthModal('login'));
  }
  
  if (showRegisterTab) {
    showRegisterTab.addEventListener('click', () => showAuthModal('register'));
  }
  
  // Setup form submissions
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
  
  // Setup upload art form
  const uploadArtForm = document.getElementById('uploadArtForm');
  if (uploadArtForm) {
    uploadArtForm.addEventListener('submit', handleArtUpload);
  }
  
  // Setup upload modal
  const openUploadArtModal = document.getElementById('openUploadArtModal');
  const closeUploadArtModal = document.getElementById('closeUploadArtModal');
  
  if (openUploadArtModal) {
    openUploadArtModal.addEventListener('click', openUploadArtModal);
  }
  
  if (closeUploadArtModal) {
    closeUploadArtModal.addEventListener('click', closeUploadArtModal);
  }
  
  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
  
  // Setup sidebar auth link
  const sidebarAuthLink = document.getElementById('sidebarAuthLink');
  if (sidebarAuthLink) {
    sidebarAuthLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
      showAuthModal('login');
    });
  }
});

// ========== Token Refresh & Auto-login ==========
async function refreshTokenIfNeeded() {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const user = await getCurrentUser();
    if (user) {
      // Token is still valid, update user data
      setAuthData(user, token);
      return true;
    }
  } catch (error) {
    // Token is invalid, clear auth data
    clearAuthData();
  }
  return false;
}

// ========== Utility Functions ==========
function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ========== Performance Optimizations ==========
// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(fadeInOnScroll, 100));

// ========== Missing Functions ==========
function clearAuthMessage() {
  const authMessage = document.getElementById('authMessage');
  if (authMessage) {
    authMessage.textContent = '';
  }
}

// ========== Enhanced Settings Functions ==========
function updateSettingsAccountInfo() {
  const user = getUser();
  const email = localStorage.getItem('artpathEmail');
  const memberSince = localStorage.getItem('artpathMemberSince');
  
  const usernameSpan = document.getElementById('settingsUsername');
  const emailSpan = document.getElementById('settingsEmail');
  const memberSinceSpan = document.getElementById('settingsMemberSince');
  
  if (usernameSpan) {
    usernameSpan.textContent = user || 'Guest';
  }
  
  if (emailSpan) {
    emailSpan.textContent = email || 'Not provided';
  }
  
  if (memberSinceSpan) {
    if (memberSince) {
      const date = new Date(memberSince);
      memberSinceSpan.textContent = date.toLocaleDateString();
    } else {
      memberSinceSpan.textContent = 'Today';
    }
  }
}