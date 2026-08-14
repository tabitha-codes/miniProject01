/* ===== Data (local array matching schema) ===== */
const USE_API = true;
const API_URL = "https://6a7a815f8c69b3eb4a173899.mockapi.io/realitychecks";

const localPosts = [
  {
    id: "rc_001",
    author: { name: "Taylor R." },
    postedAgo: "3 mins ago",
    property: { name: "Camden Belmont", location: "Dallas, TX" },
    rating: 4,
    wouldSign: "Yes",
    pros: ["Resort-style pool", "Friendly staff"],
    cons: ["Small closets", "Street noise"],
    likes: 23,
    comments: 5
  },
  {
    id: "rc_002",
    author: { name: "DeShawn M." },
    postedAgo: "1 day ago",
    property: { name: "Parkview Commons", location: "Logan Square, Chicago" },
    rating: 4,
    wouldSign: "Yes",
    pros: ["Responsive landlord", "Clean common areas"],
    cons: ["Street noise", "Small closets"],
    likes: 89,
    comments: 31
  },
  {
    id: "rc_003",
    author: { name: "Priya K." },
    postedAgo: "2 days ago",
    property: { name: "Riverline Lofts", location: "West Loop, Chicago" },
    rating: 2,
    wouldSign: "No",
    pros: ["Great views", "In-unit laundry"],
    cons: ["Slow maintenance", "Thin walls"],
    likes: 14,
    comments: 8
  },
  {
    id: "rc_004",
    author: { name: "Marcus B." },
    postedAgo: "4 days ago",
    property: { name: "Oakwood Terrace", location: "Andersonville, Chicago" },
    rating: 3,
    wouldSign: "Maybe",
    pros: ["Quiet block", "Pet friendly"],
    cons: ["Outdated kitchen", "Limited parking"],
    likes: 31,
    comments: 6
  }
];

/* ===== Helpers ===== */

/* Safety: escape user text before it goes into innerHTML */
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* Build the 5 stars from a 0–5 rating (loop). */
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating
      ? '<i class="bi bi-star-fill"></i>'
      : '<i class="bi bi-star"></i>';
  }
  return stars;
}

/* Build the pro/con tag pills from an array (map). */
function renderTags(items, kind) {
  const icon = kind === "pro" ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-down-fill";
  return items
    .map(item =>
      `<span class="tag tag-${kind}"><i class="bi ${icon}"></i> ${escapeHTML(item)}</span>`
    )
    .join("");
}

/* One card's HTML from one post object. This replaces all four hardcoded blocks. */
function renderCard(post) {
  return `
    <div class="card mb-3 user-card">
      <div class="card-photo">Hero photo</div>
      <div class="card-body">

        <div class="user-row">
          <div class="avatar"></div>
          <div class="user-name">${escapeHTML(post.author.name)}</div>
          <div class="post-time">${escapeHTML(post.postedAgo)}</div>
        </div>

        <div class="property-info">
          <span class="property-name">${escapeHTML(post.property.name)}</span>
          <span class="property-location">${escapeHTML(post.property.location)}</span>
        </div>

        <div class="rating-row">
          <span class="stars">${renderStars(post.rating)}</span>
          <span class="sign-badge">Would I sign? ${escapeHTML(post.wouldSign)}</span>
        </div>

        <div class="tags-row">${renderTags(post.pros, "pro")}</div>
        <div class="tags-row">${renderTags(post.cons, "con")}</div>

        <div class="engagement-bar"></div>

        <div class="actions-row">
          <span class="action"><i class="bi bi-heart"></i> ${post.likes}</span>
          <span class="action"><i class="bi bi-chat"></i> ${post.comments}</span>
          <span class="action"><i class="bi bi-share"></i></span>
        </div>

      </div>
    </div>`;
}

/* ===== Feed rendering + states ===== */
const feedEl = document.querySelector(".newsfeed");
const loadMoreBtn = document.querySelector(".load-more-button");

/* Remove any cards or status messages I added before (so re-render is clean). */
function clearFeed() {
  feedEl.querySelectorAll(".user-card, .feed-status").forEach(el => el.remove());
}

/* Show a single centered message: loading / empty / error. */
function showStatus(message) {
  clearFeed();
  const div = document.createElement("div");
  div.className = "feed-status";
  div.style.gridColumn = "1 / -1";
  div.style.textAlign = "center";
  div.style.padding = "24px";
  div.style.color = "#8a8a8a";
  div.textContent = message; // textContent = safe, no escaping needed
  loadMoreBtn.insertAdjacentElement("beforebegin", div);
}

/* Loop the posts, build the cards, inject before the load-more button. */
function renderFeed(posts) {
  clearFeed();
  const html = posts.map(renderCard).join("");
  loadMoreBtn.insertAdjacentHTML("beforebegin", html);
}

/* ===== Data loading ===== */
async function fetchPosts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function loadPosts() {
  showStatus("Loading Reality Checks…");
  try {
    const posts = USE_API ? await fetchPosts() : localPosts;

    if (!posts.length) {
      showStatus("No Reality Checks yet. Be the first to post one.");
      return;
    }
    renderFeed(posts);
  } catch (err) {
    console.error(err);
    showStatus("Couldn't load Reality Checks. Please try again.");
  }
}

/* ===== Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const modalEl = document.getElementById("loginModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.hide();
      loginForm.reset();
    });
  }

  // Feed (only runs on the Neighbor Notes page, where these elements exist)
  if (feedEl && loadMoreBtn) {
    loadPosts();
  }
});