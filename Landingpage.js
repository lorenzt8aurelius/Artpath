function handleSearch() {
  const input = document.getElementById("searchInput").value;
  console.log("User searched for:", input);

  // You can later use this input to filter artwork, redirect, or fetch data
  alert(`You searched for: ${input}`);
}