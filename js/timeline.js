async function loadEvents() {
  const res = await fetch("events.json");
  const events = await res.json();

  const container = document.getElementById("event-container");
  container.innerHTML = "";

  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.innerHTML = `
      <img src="${event.thumbnail}" alt="${event.title}">
      <h2>${event.title}</h2>
      <p>${event.year} – ${event.date}</p>
      <a href="event.html?id=${event.id}">View Details</a>
    `;
    container.appendChild(card);
  });
}

loadEvents();
