const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "entries");
const OUTPUT_FILE = path.join(__dirname, "..", "entries.json");

const entries = [];

const years = fs.readdirSync(DATA_DIR).filter(name =>
  fs.statSync(path.join(DATA_DIR, name)).isDirectory()
);

for (const year of years) {
  const yearDir = path.join(DATA_DIR, year);
  const files = fs.readdirSync(yearDir);

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;

    const date = file.replace(".txt", "");
    entries.push({
      year: Number(year),
      date
    });
  }
}

// Sort chronologically
entries.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  return a.date.localeCompare(b.date);
});

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(entries, null, 2),
  "utf-8"
);

console.log(`Generated ${entries.length} entries`);
