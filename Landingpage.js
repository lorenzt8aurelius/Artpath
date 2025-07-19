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