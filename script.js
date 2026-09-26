let visitors = JSON.parse(localStorage.getItem("officeVisitors")) || [];

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active-page");
  });

  document.getElementById(page).classList.add("active-page");

  document.querySelectorAll(".nav").forEach(n => {
    n.classList.remove("active");
  });

  if (page === "dashboard") document.querySelectorAll(".nav")[0].classList.add("active");
  if (page === "register") document.querySelectorAll(".nav")[1].classList.add("active");
  if (page === "visitors") document.querySelectorAll(".nav")[2].classList.add("active");

  if (page === "visitors") renderVisitors();
  if (page === "dashboard") updateDashboard();
}

document.getElementById("visitorForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const visitor = {
    id: Date.now(),
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    occupation: document.getElementById("occupation").value,
    company: document.getElementById("company").value,
    host: document.getElementById("host").value,
    department: document.getElementById("department").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    reason: document.getElementById("reason").value,
    notes: document.getElementById("notes").value
  };

  visitors.unshift(visitor);

  localStorage.setItem("officeVisitors", JSON.stringify(visitors));

  this.reset();

  showToast("✓ Visitor registered successfully");

  updateDashboard();
  showPage("dashboard");
});

function updateDashboard() {
  document.getElementById("totalVisitors").textContent = visitors.length;

  const today = new Date().toISOString().split("T")[0];

  const todayCount = visitors.filter(v => v.date === today).length;
  document.getElementById("todayVisitors").textContent = todayCount;

  const upcoming = visitors.filter(v => v.date >= today).length;
  document.getElementById("upcomingVisitors").textContent = upcoming;

  const recent = visitors.slice(0, 5);

  if (!recent.length) {
    document.getElementById("recentVisitors").innerHTML =
      `<div class="empty">No visitors registered yet.</div>`;
    return;
  }

  document.getElementById("recentVisitors").innerHTML =
    recent.map(visitorHTML).join("");
}

function renderVisitors() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = visitors.filter(v =>
    v.name.toLowerCase().includes(search) ||
    v.company.toLowerCase().includes(search) ||
    v.host.toLowerCase().includes(search)
  );

  if (!filtered.length) {
    document.getElementById("allVisitors").innerHTML =
      `<div class="empty">No visitors found.</div>`;
    return;
  }

  document.getElementById("allVisitors").innerHTML =
    filtered.map(visitorHTML).join("");
}

function visitorHTML(v) {
  const initials = v.name
    .split(" ")
    .map(x => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return `
    <div class="visitor">
      <div class="visitor-left">
        <div class="avatar">${initials}</div>

        <div>
          <div class="visitor-name">${escapeHTML(v.name)}</div>

          <div class="visitor-info">
            ${escapeHTML(v.occupation)}
            ${v.company ? " • " + escapeHTML(v.company) : ""}
            • Meeting ${escapeHTML(v.host)}
          </div>

          <div class="visitor-info">
            📅 ${escapeHTML(v.date)} &nbsp; ⏰ ${escapeHTML(v.time)}
            • ${escapeHTML(v.reason)}
          </div>
        </div>
      </div>

      <span class="badge">REGISTERED</span>
    </div>
  `;
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

updateDashboard();
