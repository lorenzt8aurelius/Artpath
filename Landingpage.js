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

// ========== Authentication Functions ==========
function getUser() {
  return localStorage.getItem('artpathUser');
}

function logout() {
  localStorage.removeItem('artpathUser');
  localStorage.removeItem('artpathGuest');
  updateAuthUI();
  // Redirect to home page if not already there
  if (window.location.pathname !== '/Artpath.html' && !window.location.pathname.endsWith('Artpath.html')) {
    window.location.href = 'Artpath.html';
  }
}

function updateAuthUI() {
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
      sidebarAuthLink.onclick = (e) => { e.preventDefault(); logout(); closeSidebar(); };
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

function showAuthMessage(msg, type = 'error') {
  const authMessage = document.getElementById('authMessage');
  if (!authMessage) return;
  
  authMessage.textContent = msg;
  authMessage.className = 'auth-message ' + type;
  
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
  { title: 'Dreamscape', artist: 'Jamie L.', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Digital Muse', artist: 'Priya S.', url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Logo Flow', artist: 'Alex R.', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', category: 'logo' },
  { title: 'Serenity', artist: 'Morgan T.', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Neon Dreams', artist: 'Chris P.', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Brand Spark', artist: 'Taylor K.', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', category: 'logo' },
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
  
  // Setup fade-in animations
  fadeInOnScroll();
  
  // Setup help chat
  setupHelpChat();
  
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

// ========== Auth Form Handlers ==========
function handleLogin(e) {
  e.preventDefault();
  clearAuthMessage();
  
  const name = document.getElementById('loginName').value.trim();
  const pass = document.getElementById('loginPassword').value;
  
  if (!name || !pass) {
    showAuthMessage('Please enter your name and password.');
    return;
  }
  
  if (pass.length < 6) {
    showAuthMessage('Password must be at least 6 characters.');
    return;
  }
  
  // Simulate login (in a real app, this would validate against a backend)
  localStorage.setItem('artpathUser', name);
  updateAuthUI();
  showAuthMessage('Login successful!', 'success');
  
  setTimeout(() => {
    document.getElementById('authModal').classList.add('hidden');
  }, 900);
}

function handleRegister(e) {
  e.preventDefault();
  clearAuthMessage();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const pass = document.getElementById('registerPassword').value;
  
  if (!name || !email || !pass) {
    showAuthMessage('Please fill in all fields.');
    return;
  }
  
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showAuthMessage('Please enter a valid email address.');
    return;
  }
  
  if (pass.length < 6) {
    showAuthMessage('Password must be at least 6 characters.');
    return;
  }
  
  // Simulate registration (in a real app, this would send data to a backend)
  localStorage.setItem('artpathUser', name);
  localStorage.setItem('artpathEmail', email);
  updateAuthUI();
  showAuthMessage('Registration successful!', 'success');
  
  setTimeout(() => {
    document.getElementById('authModal').classList.add('hidden');
  }, 900);
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