function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    alert(`You searched for: ${query}`);
    // TODO: Implement search filtering or redirection
  }
}

// ========== User Choice Actions ==========
function startPortfolio() {
  window.location.href = "portfolio.html";
}

function startLearning() {
  window.location.href = "learn.html";
}

function continueAsGuest() {
  localStorage.setItem('artpathGuest', 'true');
  localStorage.removeItem('artpathUser');
  updateAuthUI();
  alert("You're now exploring as a guest!");
}

function getUser() {
  return localStorage.getItem('artpathUser');
}

function logout() {
  localStorage.removeItem('artpathUser');
  localStorage.removeItem('artpathGuest');
  updateAuthUI();
}

function updateAuthUI() {
  const authArea = document.getElementById('authArea');
  const sidebarAuthLink = document.getElementById('sidebarAuthLink');
  const user = getUser();
  const isGuest = localStorage.getItem('artpathGuest') === 'true';
  // Show/hide nav links
  document.querySelectorAll('.protected-link').forEach(link => {
    link.style.display = user ? '' : 'none';
  });
  // Show welcome/logout or login/register
  if (user) {
    authArea.innerHTML = `<span class='welcome-msg'>Welcome, ${user}</span> <button class='menu-toggle' id='logoutBtn'>Logout</button>`;
    document.getElementById('logoutBtn').onclick = logout;
    if (sidebarAuthLink) sidebarAuthLink.textContent = 'Logout';
    if (sidebarAuthLink) sidebarAuthLink.onclick = (e) => { e.preventDefault(); logout(); closeSidebar(); };
  } else if (isGuest) {
    authArea.innerHTML = `<span class='welcome-msg'>Exploring as Guest</span>`;
    if (sidebarAuthLink) sidebarAuthLink.textContent = 'Continue as Guest';
    if (sidebarAuthLink) sidebarAuthLink.onclick = (e) => { e.preventDefault(); closeSidebar(); };
  } else {
    authArea.innerHTML = `<button id='openAuthModal' class='menu-toggle'>Login / Register</button>`;
    document.getElementById('openAuthModal').onclick = () => showAuthModal('login');
    if (sidebarAuthLink) sidebarAuthLink.textContent = 'Login / Register';
    if (sidebarAuthLink) sidebarAuthLink.onclick = (e) => { e.preventDefault(); closeSidebar(); showAuthModal('login'); };
  }
}

// ========== Sidebar Menu Toggle ==========
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("show");
}

// ========== (Optional) Old Dropdown Menu Logic ==========
function toggleMainMenu() {
  const menu = document.getElementById("mainMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function previewArt() {
  const fileInput = document.getElementById('artUpload');
  const previewArea = document.getElementById('previewArea');

  previewArea.innerHTML = ''; // Clear previous

  const file = fileInput.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '100%';
    img.style.borderRadius = '8px';
    img.style.marginTop = '10px';
    previewArea.appendChild(img);
  }
}

function showTopicSelector() {
  document.getElementById('topicSelector').classList.remove('hidden');
  window.scrollTo({ top: document.getElementById('topicSelector').offsetTop, behavior: 'smooth' });
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
  if (selectedTopics.size) {
    btn.disabled = false;
    btn.classList.add('enabled');
  } else {
    btn.disabled = true;
    btn.classList.remove('enabled');
  }
}

function continueAfterTopics() {
  localStorage.setItem("selectedTopics", JSON.stringify(Array.from(selectedTopics)));
  window.location.href = "myLearningPlan.html";  // Redirect to next step (future page)
}

// ========== Fade-in on Scroll ==========
function fadeInOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in');
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
window.addEventListener('DOMContentLoaded', fadeInOnScroll);
document.addEventListener('DOMContentLoaded', updateAuthUI);

// ===== Dynamic Art Gallery =====
const artworks = [
  { title: 'Dreamscape', artist: 'Jamie L.', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Digital Muse', artist: 'Priya S.', url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Logo Flow', artist: 'Alex R.', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', category: 'logo' },
  { title: 'Serenity', artist: 'Morgan T.', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', category: 'portrait' },
  { title: 'Neon Dreams', artist: 'Chris P.', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', category: 'digital' },
  { title: 'Brand Spark', artist: 'Taylor K.', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80', category: 'logo' },
];

function renderGallery(filter = 'all') {
  const grid = document.getElementById('artGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = filter === 'all' ? artworks : artworks.filter(a => a.category === filter);
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="color:#bfc2d1; text-align:center; width:100%;">No artworks found for this category.</div>';
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
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  renderGallery();
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.onclick = function() {
      filterBtns.forEach(b => { b.style.background = '#23243a'; b.style.color = '#eaeaea'; });
      this.style.background = '#1DBF73'; this.style.color = '#fff';
      renderGallery(this.dataset.filter);
    };
  });
});