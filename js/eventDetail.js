// eventDetail.js

// 1. Tomar el id de la URL: event.html?id=1
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

// 2. Contenedor principal donde se va a pintar todo
const container = document.getElementById("event-details");

async function loadEvent() {
  try {
    const res = await fetch("events.json");
    const events = await res.json();

    // Buscar el evento que tenga ese id
    const event = events.find(e => String(e.id) === String(eventId));

    if (!event) {
      container.innerHTML = "<p>Event not found.</p>";
      return;
    }

    // Pintar la info del evento
    container.innerHTML = `
      <article class="event-detail">
        <img src="${event.thumbnail}" alt="${event.title}">
        <h2>${event.title}</h2>
        <p class="event-meta"><strong>Year:</strong> ${event.year} — ${event.date}</p>
        <p class="event-meta"><strong>Location:</strong> ${event.location}</p>
        <p class="event-description">${event.description}</p>

        <section class="related-book" id="related-book">
          <h3>Related Book</h3>
          <p class="book-loading">Loading recommendation...</p>
        </section>
      </article>
    `;

    // Si el evento tiene bookQuery, llamamos al API
    if (event.bookQuery) {
      loadBookRecommendation(event.bookQuery);
    } else {
      const bookSection = document.getElementById("related-book");
      bookSection.innerHTML = "<h3>Related Book</h3><p>No book query provided.</p>";
    }
  } catch (err) {
    console.error("Error loading event:", err);
    container.innerHTML = "<p>There was an error loading this event.</p>";
  }
}

// 3. Google Books API
async function loadBookRecommendation(query) {
  const bookSection = document.getElementById("related-book");

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      bookSection.innerHTML = "<h3>Related Book</h3><p>No related books found.</p>";
      return;
    }

    const info = data.items[0].volumeInfo;

    const title = info.title || "Untitled";
    const authors = info.authors ? info.authors.join(", ") : "Unknown author";
    const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "";
    const link = info.infoLink || "#";

    bookSection.innerHTML = `
      <h3>Related Book</h3>
      <div class="book-card">
        ${thumbnail ? `<img src="${thumbnail}" alt="${title}">` : ""}
        <div class="book-info">
          <h4>${title}</h4>
          <p>${authors}</p>
          <a href="${link}" target="_blank" rel="noopener noreferrer">View on Google Books</a>
        </div>
      </div>
    `;
  } catch (err) {
    console.error("Error loading book:", err);
    bookSection.innerHTML = "<h3>Related Book</h3><p>Could not load book information.</p>";
  }
}

// 4. Ejecutar
loadEvent();