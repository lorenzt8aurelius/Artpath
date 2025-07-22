function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    alert(`You searched for: ${query}`);
    // TODO: Implement search filtering or redirection
  }
}

// ========== User Choice Actions ==========
function startPortfolio() {
  alert("Redirecting to portfolio builder...");
  // TODO: window.location.href = "portfolio.html";
}

function startLearning() {
  alert("Redirecting to learning path...");
  // TODO: window.location.href = "learn.html";
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

function startPortfolio() {
  window.location.href = "portfolio.html";
}

function startLearning() {
  window.location.href = "learn.html";
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
  const topic = card.querySelector('span').innerText;
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
  const btn = document.getElementById('continueTopics');
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

const selectedTopics = new Set();

function toggleTopic(topic) {
  if (selectedTopics.has(topic)) {
    selectedTopics.delete(topic);
  } else {
    selectedTopics.add(topic);
  }

  updateUI();
  updateContinueButton();
}

function updateUI() {
  document.querySelectorAll('.topic-card').forEach(card => {
    const topic = card.innerText.trim().split(" ").slice(1).join(" ");
    if (selectedTopics.has(topic)) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

function updateContinueButton() {
  const btn = document.getElementById("continue-button");
  btn.disabled = selectedTopics.size === 0;
}

function continueAfterTopics() {
  localStorage.setItem("selectedTopics", JSON.stringify([...selectedTopics]));
  window.location.href = "myLearningPlan.html"; // or your next step page
}