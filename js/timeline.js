let allEvents = [];

// 1. Load events from JSON once
async function init() {
  const res = await fetch("events.json");
  allEvents = await res.json();   
  renderEvents(allEvents);        
}

// 2. Render a list of events to the page
function renderEvents(eventsToShow) {
  const container = document.getElementById("event-container");
  container.innerHTML = "";

  eventsToShow.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.innerHTML = `
      <img src="${event.thumbnail}" alt="${event.title}">
      <h2>${event.title}</h2>
      <p>${event.year} – ${event.date}</p>
      <a href="event.html?id=${event.id}">View Details</a>

      <div style="margin-top:8px;">
        <button class="favBtn" data-id="${event.id}"
          style="padding:6px 10px; border:none; background:#1f3d2b; color:white; border-radius:6px; cursor:pointer;">
          ⭐ Add to Favorites
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}
init();

// 3. Search filter
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();

    const filtered = allEvents.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.tags.some(tag => tag.toLowerCase().includes(term))
    );

    renderEvents(filtered);
  });
}

// 4. Favorites with LocalStorage
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("favBtn")) {
    const id = e.target.dataset.id;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.includes(id)) {
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Added to Favorites! ⭐");
    } else {
      alert("Already in Favorites!");
    }
  }
});