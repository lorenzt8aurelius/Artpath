function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    alert(`You searched for: ${query}`);
    // Later: Add logic to filter content or redirect to search results
  }
}

function startPortfolio() {
  alert("Redirecting to portfolio builder...");
  // Later: window.location.href = "/portfolio.html";
}

function startLearning() {
  alert("Redirecting to beginner courses...");
  // Later: window.location.href = "/learn.html";
}

function startPortfolio() {
  alert("Redirecting to portfolio builder...");
  // You can add: window.location.href = "portfolio.html";
}

function startLearning() {
  alert("Redirecting to learning page...");
  // You can add: window.location.href = "learn.html";
}

function continueAsGuest() {
  alert("You're now exploring as a guest!");
  // Future: window.location.href = "explore.html";
}

function toggleMainMenu() {
  const menu = document.getElementById("mainMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}