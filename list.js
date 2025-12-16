(async function () {
  const res = await fetch("entries.json");
  const entries = await res.json();

  const list = document.getElementById("entryList");

  entries.forEach(e => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `index.html?year=${e.year}&date=${e.date}`;
    a.textContent = `${e.date} (${e.year})`;

    li.appendChild(a);
    list.appendChild(li);
  });
})();
