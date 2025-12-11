const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const container = document.getElementById("event-details");

async function loadEvent() {
  const res = await fetch("events.json");
  const events = await res.json();

  const event = events.find(e => String(e.id) === String(eventId));

  if (!event) {
    container.innerHTML = "<p>Event not found.</p>";
    return;
  }

  container.innerHTML = `
    <article class="event-detail">
      <img src="${event.thumbnail}" alt="${event.title}">
      <h2>${event.title}</h2>
      <p class="event-meta"><strong>Year:</strong> ${event.year} &mdash; ${event.date}</p>
      <p class="event-meta"><strong>Location:</strong> ${event.location}</p>
      <p class="event-description">${event.description}</p>

      <section class="related-book" id="related-book">
        <h3>Related Book</h3>
        <p class="book-loading">Loading recommendation...</p>
      </section>
    </article>
  `;

  if (event.bookQuery) {
    loadBookRecommendation(event.bookQuery);
  } else {
    const bookSection = document.getElementById("related-book");
    bookSection.innerHTML = "<h3>Related Book</h3><p>No book query provided.</p>";
  }
}

async function loadBookRecommendation(query) {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
    );
    const data = await res.json();

    const bookSection = document.getElementById("related-book");

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
    const bookSection = document.getElementById("related-book");
    bookSection.innerHTML = "<h3>Related Book</h3><p>Could not load book information.</p>";
    console.error(err);
  }
}

loadEvent();
