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
  alert("You're now exploring as a guest!");
  // TODO: window.location.href = "explore.html";
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