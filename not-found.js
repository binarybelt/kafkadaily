let SORTED_ENTRIES = [];
let currentEntryIndex = null;

function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    year: Number(p.get("year")),
    date: p.get("date")
  };
}

function shiftDay(monthDay, offset) {
  const [m, d] = monthDay.split("-").map(Number);
  const date = new Date(2000, m - 1, d + offset);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function loadIndex() {
  const res = await fetch("entries.json");
  SORTED_ENTRIES = await res.json();
}

function updateEntryNav() {
  const prev = document.getElementById("prevEntryBtn");
  const next = document.getElementById("nextEntryBtn");

  prev.disabled = currentEntryIndex <= 0;
  next.disabled = currentEntryIndex >= SORTED_ENTRIES.length - 1;

  if (currentEntryIndex > 0) {
    const e = SORTED_ENTRIES[currentEntryIndex - 1];
    prev.onclick = () =>
      location.href = `index.html?year=${e.year}&date=${e.date}`;
  }

  if (currentEntryIndex < SORTED_ENTRIES.length - 1) {
    const e = SORTED_ENTRIES[currentEntryIndex + 1];
    next.onclick = () =>
      location.href = `index.html?year=${e.year}&date=${e.date}`;
  }
}

(async function init() {
  await loadIndex();

  const { year, date } = getParams();
  document.getElementById("message").textContent =
    `No entry exists for ${date}, ${year}.`;

  // Alternatives (same day, other years)
  const matches = SORTED_ENTRIES.filter(e => e.date === date);
  const list = document.getElementById("alternatives");

  if (matches.length === 0) {
    list.innerHTML = "<li>No entries exist for this date in any year.</li>";
  } else {
    matches.forEach(e => {
      const li = document.createElement("li");
      const a = document.createElement("a");

      a.href = `index.html?year=${e.year}&date=${e.date}`;
      a.textContent = `${e.date} (${e.year})`;

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  // Entry-based nav anchor
  currentEntryIndex = SORTED_ENTRIES.findIndex(
    e => e.year === year && e.date === date
  );

  updateEntryNav();

  // Day navigation
  document.getElementById("prevDayBtn").onclick = () => {
    const d = shiftDay(date, -1);
    location.href = `index.html?year=${year}&date=${d}`;
  };

  document.getElementById("nextDayBtn").onclick = () => {
    const d = shiftDay(date, 1);
    location.href = `index.html?year=${year}&date=${d}`;
  };

  // Browse
  document.getElementById("browseBtn").onclick = () => {
    location.href = "list.html";
  };
})();
