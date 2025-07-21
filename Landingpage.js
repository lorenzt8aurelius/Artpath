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