const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

async function loadEvent() {
  const res = await fetch("../events.json");
  const events = await res.json();
  const event = events.find(e => e.id == eventId);

  const container = document.getElementById("event-details");
  container.innerHTML = `
    <h2>${event.title}</h2>
    <img src="${event.thumbnail}" alt="${event.title}">
    <p><strong>Year:</strong> ${event.year}</p>
    <p><strong>Date:</strong> ${event.date}</p>
    <p>${event.description}</p>
  `;
}

loadEvent();
