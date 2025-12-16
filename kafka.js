
const REAL_START_YEAR = 2025;
const ARCHIVE_START_YEAR = 1910;
const ARCHIVE_END_YEAR = 1923;

let SORTED_ENTRIES = [];
let currentEntryIndex = null;
let currentYear = null;
let currentDate = null;

async function loadEntryIndex() {
  const res = await fetch("entries.json");
  if (!res.ok) throw new Error("entries.json missing");
  SORTED_ENTRIES = await res.json();
}

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const year = params.get("year");
  const date = params.get("date");

  if (year && date) {
    return { year: Number(year), date };
  }
  return null;
}

function getMonthDay() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getArchiveYear() {
  const realYear = new Date().getFullYear();
  return Math.min(
    ARCHIVE_START_YEAR + (realYear - REAL_START_YEAR),
    ARCHIVE_END_YEAR
  );
}

function shiftDay(monthDay, offset) {
  const [m, d] = monthDay.split("-").map(Number);
  const date = new Date(2000, m - 1, d + offset);
  return `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

async function fetchEntry(year, date) {
  const path = `entries/${year}/${date}.txt`;
  const res = await fetch(path);
  if (!res.ok) return null;
  return await res.text();
}

function displayEntry(year, text, date) {
  currentYear = year;
  currentDate = date;

  document.getElementById("content").textContent = text;
  document.getElementById("choices").innerHTML =
    `<small>${date}, ${year}</small>`;

  currentEntryIndex = SORTED_ENTRIES.findIndex(
    e => e.year === year && e.date === date
  );

  updateEntryButtons();
}

function updateEntryButtons() {
  document.getElementById("prevEntryBtn").disabled =
    currentEntryIndex === null || currentEntryIndex <= 0;

  document.getElementById("nextEntryBtn").disabled =
    currentEntryIndex === null ||
    currentEntryIndex >= SORTED_ENTRIES.length - 1;
}

async function loadEntryByIndex(index) {
  const entry = SORTED_ENTRIES[index];
  const text = await fetchEntry(entry.year, entry.date);
  if (text) {
    displayEntry(entry.year, text, entry.date);
  }
}

async function loadByDay(offset) {
  const newDate = shiftDay(currentDate, offset);
  const text = await fetchEntry(currentYear, newDate);

  if (text) {
    displayEntry(currentYear, text, newDate);
  } else {
    window.location.href =
      `not-found.html?year=${currentYear}&date=${newDate}`;
  }
}

(async function init() {
  await loadEntryIndex();

  const urlOverride = getUrlParams();
  if (urlOverride) {
    const { year, date } = urlOverride;
    const text = await fetchEntry(year, date);

    if (text) {
      displayEntry(year, text, date);
      return;
    } else {
      window.location.href =
        `not-found.html?year=${year}&date=${date}`;
      return;
    }
  }

  const today = new Date();
  document.getElementById("date").textContent =
    today.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric"
    });

  const monthDay = getMonthDay();
  const archiveYear = getArchiveYear();

  const primary = await fetchEntry(archiveYear, monthDay);
  if (primary) {
    displayEntry(archiveYear, primary, monthDay);
    return;
  }

  const matches = SORTED_ENTRIES.filter(e => e.date === monthDay);
  const contentEl = document.getElementById("content");
  const choicesEl = document.getElementById("choices");

  if (matches.length === 0) {
    contentEl.textContent = "No entries exist for this date.";
    return;
  }

  contentEl.textContent = "Choose another year:";
  matches.forEach(e => {
    const btn = document.createElement("button");
    btn.textContent = e.year;
    btn.onclick = async () => {
      const t = await fetchEntry(e.year, e.date);
      displayEntry(e.year, t, e.date);
    };
    choicesEl.appendChild(btn);
  });
})();

document.getElementById("prevEntryBtn").onclick = () => {
  if (currentEntryIndex > 0) {
    loadEntryByIndex(currentEntryIndex - 1);
  }
};

document.getElementById("nextEntryBtn").onclick = () => {
  if (currentEntryIndex < SORTED_ENTRIES.length - 1) {
    loadEntryByIndex(currentEntryIndex + 1);
  }
};

document.getElementById("prevDayBtn").onclick = () => loadByDay(-1);
document.getElementById("nextDayBtn").onclick = () => loadByDay(1);

document.getElementById("browseBtn").onclick = () => {
  window.location.href = "list.html";
};
