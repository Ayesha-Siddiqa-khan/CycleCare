"use strict";

const STORAGE_KEY = "cyclecare.v1";
const DEFAULT_CYCLE = 28;
const DEFAULT_DURATION = 5;

/* ---------- date helpers (pure) ---------- */

function parseDate(s) {
  const [y, m, d] = String(s).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toKey(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function todayKey() {
  return toKey(new Date());
}

function addDays(key, n) {
  const d = parseDate(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

function daysBetween(a, b) {
  const A = parseDate(a);
  const B = parseDate(b);
  return Math.round(
    (Date.UTC(B.getFullYear(), B.getMonth(), B.getDate()) -
      Date.UTC(A.getFullYear(), A.getMonth(), A.getDate())) /
      86400000
  );
}

function formatDate(key, opts) {
  const d = parseDate(key);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const withYear = opts && opts.withYear;
  return withYear ? `${month} ${d.getDate()}, ${d.getFullYear()}` : `${month} ${d.getDate()}`;
}

function formatDateRange(start, end) {
  if (!end) return `${formatDate(start)} – ongoing`;
  const sameYear = parseDate(start).getFullYear() === parseDate(end).getFullYear();
  return `${formatDate(start, { withYear: !sameYear })} – ${formatDate(end, { withYear: !sameYear })}`;
}

/* ---------- validation (pure) ---------- */

function validatePeriod(start, end) {
  if (!start) return "Please enter the date your period started.";
  if (Number.isNaN(parseDate(start).getTime())) return "Please enter a valid start date.";
  if (end) {
    if (Number.isNaN(parseDate(end).getTime())) return "Please enter a valid end date.";
    if (daysBetween(start, end) < 0) return "End date cannot be earlier than the start date.";
  }
  return null;
}

/* ---------- cycle calculation (pure) ---------- */

function sortedDesc(periods) {
  return [...(periods || [])].sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
}

function computeCycle(periods, defaultCycleLength) {
  const sorted = sortedDesc(periods);
  if (!sorted.length) return { empty: true };

  const asc = [...sorted].reverse();
  const lengths = [];
  for (let i = 1; i < asc.length; i++) {
    const d = daysBetween(asc[i - 1].start, asc[i].start);
    if (d > 0) lengths.push(d);
  }

  const limited = lengths.length === 0;
  const avgCycle = limited
    ? defaultCycleLength || DEFAULT_CYCLE
    : Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);

  const durations = asc
    .filter((p) => p.end && daysBetween(p.start, p.end) >= 0)
    .map((p) => daysBetween(p.start, p.end) + 1);
  const avgDuration = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : DEFAULT_DURATION;

  const last = sorted[0];
  const next = addDays(last.start, avgCycle);
  const today = todayKey();
  const cycleDay = daysBetween(last.start, today) + 1;
  const onPeriod =
    daysBetween(last.start, today) >= 0 && (!last.end || daysBetween(today, last.end) >= 0);
  const periodDay = onPeriod ? cycleDay : null;
  const daysUntil = daysBetween(today, next);

  return { empty: false, limited, avgCycle, avgDuration, lengths, last, next, cycleDay, onPeriod, periodDay, daysUntil };
}

function estimatedKeys(cycle) {
  const keys = new Set();
  if (cycle && !cycle.empty) {
    for (let i = 0; i < cycle.avgDuration; i++) keys.add(addDays(cycle.next, i));
  }
  return keys;
}

/* ---------- storage ---------- */

let db = null;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && Array.isArray(d.periods)) {
        d.settings = d.settings || {};
        if (!d.settings.defaultCycleLength) d.settings.defaultCycleLength = DEFAULT_CYCLE;
        return d;
      }
    }
  } catch (e) { /* fall through to default */ }
  return { periods: [], settings: { defaultCycleLength: DEFAULT_CYCLE } };
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ---------- DOM helpers ---------- */

function el(sel) {
  return document.querySelector(sel);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function cycle() {
  return computeCycle(db.periods, db.settings.defaultCycleLength);
}

function newId() {
  return crypto.randomUUID ? crypto.randomUUID() : `p${Date.now()}${Math.random().toString(16).slice(2)}`;
}

/* ---------- render: dashboard ---------- */

function renderDashboard() {
  const c = cycle();
  const empty = el("#dash-empty");
  const content = el("#dash-content");

  if (c.empty) {
    empty.hidden = false;
    content.hidden = true;
    return;
  }
  empty.hidden = true;
  content.hidden = false;

  const thisYear = new Date().getFullYear();
  el("#dash-last").textContent = c.last.end
    ? formatDateRange(c.last.start, c.last.end)
    : `${formatDate(c.last.start)} – ongoing`;

  el("#dash-next").textContent = formatDate(c.next, {
    withYear: parseDate(c.next).getFullYear() !== thisYear,
  });
  el("#dash-until").textContent =
    c.daysUntil > 0
      ? `About ${c.daysUntil} day${c.daysUntil === 1 ? "" : "s"} away`
      : c.daysUntil === 0
        ? "Estimated for today"
        : "";

  el("#dash-status").textContent = c.onPeriod
    ? `Period day ${c.periodDay}`
    : c.cycleDay >= 1
      ? `Cycle day ${c.cycleDay}`
      : `Expected to start ${formatDate(c.last.start)}`;

  el("#dash-avg").textContent = `${c.avgCycle} days`;
  el("#dash-limited").textContent = c.limited
    ? "Using your default setting. Your next period is an estimate based on limited cycle history — record more cycles to improve it."
    : `Based on ${c.lengths.length} recorded cycle${c.lengths.length === 1 ? "" : "s"}.`;

  const passed = el("#dash-passed");
  if (c.daysUntil < 0) {
    passed.hidden = false;
    passed.textContent =
      "Your estimated next period date has passed. Record your period when it starts to update the estimate.";
  } else {
    passed.hidden = true;
  }

  const latestId = c.last.id;
  const recent = sortedDesc(db.periods).slice(0, 3);
  el("#dash-recent").innerHTML = recent
    .map((p) => {
      let range;
      if (p.end) range = formatDateRange(p.start, p.end);
      else if (p.id === latestId) range = `${formatDate(p.start)} – ongoing`;
      else range = `${formatDate(p.start)} (end not recorded)`;
      return `<li>${esc(range)}</li>`;
    })
    .join("");
}

/* ---------- render: calendar ---------- */

function renderCalendar() {
  const first = new Date(calY, calM, 1);
  el("#cal-title").textContent = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  el("#day-detail").hidden = true;

  const c = cycle();
  const est = estimatedKeys(c);
  const today = todayKey();

  const recorded = new Map();
  const asc = [...db.periods].sort((a, b) => (a.start > b.start ? 1 : a.start < b.start ? -1 : 0));
  const latestId = asc.length ? asc[asc.length - 1].id : null;
  for (const p of asc) {
    let lastDay = p.start;
    if (p.end && daysBetween(p.start, p.end) >= 0) lastDay = p.end;
    else if (!p.end && p.id === latestId && daysBetween(p.start, today) > 0) lastDay = today;
    for (let k = p.start; daysBetween(k, lastDay) >= 0; k = addDays(k, 1)) recorded.set(k, p);
  }

  const daysInMonth = new Date(calY, calM + 1, 0).getDate();
  const offset = first.getDay();
  const monthNum = String(calM + 1).padStart(2, "0");

  let html = "";
  for (let i = 0; i < offset; i++) html += '<div class="day-blank" aria-hidden="true"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${calY}-${monthNum}-${String(d).padStart(2, "0")}`;
    const cls = ["day"];
    const labels = [];
    const rec = recorded.get(key);
    if (rec) {
      cls.push("recorded");
      labels.push("recorded period day");
    } else if (est.has(key)) {
      cls.push("estimated");
      labels.push("estimated period day, estimate only");
    }
    if (key === today) {
      cls.push("today");
      labels.push("today");
    }
    const label = `${formatDate(key, { withYear: true })}${labels.length ? ", " + labels.join(", ") : ""}`;
    html += `<button type="button" class="${cls.join(" ")}" data-date="${key}" aria-label="${esc(label)}">${d}</button>`;
  }
  el("#cal-days").innerHTML = html;
}

function showDayDetail(key) {
  const panel = el("#day-detail");
  const rec = db.periods.find((p) => {
    let lastDay = p.start;
    if (p.end && daysBetween(p.start, p.end) >= 0) lastDay = p.end;
    else if (!p.end) lastDay = todayKey();
    return daysBetween(p.start, key) >= 0 && daysBetween(key, lastDay) >= 0;
  });
  const c = cycle();
  const isEst = !rec && estimatedKeys(c).has(key);
  const today = todayKey();

  let html = `<h2>${esc(formatDate(key, { withYear: true }))}</h2>`;
  if (rec) {
    html += `<p><strong>Recorded period:</strong> ${esc(rec.end ? formatDateRange(rec.start, rec.end) : formatDateRange(rec.start, null))}</p>`;
    const dur = rec.end ? daysBetween(rec.start, rec.end) + 1 : null;
    if (dur) html += `<p class="muted">Duration: ${dur} day${dur === 1 ? "" : "s"}${rec.flow ? ` &middot; Flow: ${esc(rec.flow)}` : ""}</p>`;
    html += `<div class="actions"><a class="btn btn-primary" href="#/periods/edit/${esc(rec.id)}">Edit this period</a></div>`;
  } else if (isEst) {
    html += `<p><strong>Estimated period day.</strong> An estimate from your history — not a guarantee.</p>`;
    if (key <= today) {
      html += `<div class="actions"><button type="button" class="btn btn-primary" data-record="${key}">Record period starting this day</button></div>`;
    }
  } else if (key === today) {
    html += `<p>Today. No period recorded for this date.</p>`;
    html += `<div class="actions"><a class="btn" href="#/periods/new">Add Period</a></div>`;
  } else {
    html += `<p>No period information for this date.</p>`;
    if (key <= today) {
      html += `<div class="actions"><a class="btn" href="#/periods/new">Record period starting this date</a></div>`;
    }
  }
  panel.innerHTML = html;
  panel.hidden = false;
}

/* ---------- render: add/edit form ---------- */

let prefillStart = null;

function renderForm(editId) {
  const form = el("#period-form");
  form.reset();
  el("#form-err").textContent = "";
  el("#delete-btn").hidden = true;
  el("#period-id").value = "";

  const p = editId ? db.periods.find((x) => x.id === editId) : null;
  el("#form-title").textContent = p ? "Edit Period" : "Add Period";

  if (p) {
    el("#period-id").value = p.id;
    form.start.value = p.start;
    form.end.value = p.end || "";
    if (p.flow) {
      const r = form.querySelector(`[name="flow"][value="${p.flow}"]`);
      if (r) r.checked = true;
    }
    const symptoms = p.symptoms || [];
    form.querySelectorAll('[name="symptoms"]').forEach((cb) => {
      cb.checked = symptoms.includes(cb.value);
    });
    form.notes.value = p.notes || "";
    el("#delete-btn").hidden = false;
  } else if (prefillStart) {
    form.start.value = prefillStart;
    prefillStart = null;
  }
  el("#start").focus({ preventScroll: false });
}

function submitPeriod(e) {
  e.preventDefault();
  const form = e.target;
  const start = form.start.value;
  const end = form.end.value || "";
  const errBox = el("#form-err");

  const err = validatePeriod(start, end);
  if (err) {
    errBox.textContent = err;
    form.start.focus();
    return;
  }
  errBox.textContent = "";

  const id = el("#period-id").value || newId();
  const fd = new FormData(form);
  const existing = db.periods.find((x) => x.id === id);
  const rec = {
    id,
    start,
    end: end || null,
    flow: fd.get("flow") || null,
    symptoms: fd.getAll("symptoms"),
    notes: (form.notes.value || "").trim(),
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const i = db.periods.findIndex((x) => x.id === id);
  if (i >= 0) db.periods[i] = rec;
  else db.periods.push(rec);
  save(db);
  location.hash = "#/";
}

function deleteCurrentPeriod() {
  const id = el("#period-id").value;
  if (!id) return;
  if (!confirm("Delete this period record? This cannot be undone.")) return;
  db.periods = db.periods.filter((p) => p.id !== id);
  save(db);
  location.hash = "#/history";
}

/* ---------- render: history ---------- */

function renderHistory() {
  const emptyEl = el("#history-empty");
  const list = el("#history-list");
  const periods = sortedDesc(db.periods);

  if (!periods.length) {
    emptyEl.hidden = false;
    list.innerHTML = "";
    return;
  }
  emptyEl.hidden = true;

  const asc = [...periods].reverse();
  const latestId = asc.length ? asc[asc.length - 1].id : null;

  list.innerHTML = periods
    .map((p) => {
      let dur;
      if (p.end && daysBetween(p.start, p.end) >= 0) {
        const n = daysBetween(p.start, p.end) + 1;
        dur = `${n} day${n === 1 ? "" : "s"}`;
      } else if (p.id === latestId) {
        dur = "ongoing";
      } else {
        dur = "not recorded";
      }

      const i = asc.findIndex((x) => x.id === p.id);
      const cl = i > 0 ? daysBetween(asc[i - 1].start, asc[i].start) : null;

      const range = p.end
        ? formatDateRange(p.start, p.end)
        : p.id === latestId
          ? `${formatDate(p.start)} – ongoing`
          : formatDate(p.start);

      let html = `<article class="card record">
        <div class="record-head">
          <h2>${esc(range)}</h2>
          <div class="record-actions">
            <a class="btn btn-sm" href="#/periods/edit/${esc(p.id)}">Edit</a>
            <button type="button" class="btn btn-sm btn-danger" data-delete="${esc(p.id)}">Delete</button>
          </div>
        </div>
        <p>Duration: ${esc(dur)}${cl ? ` &middot; Cycle length: ${cl} days` : ""}</p>`;
      if (p.flow) html += `<p>Flow: ${esc(p.flow)}</p>`;
      if (p.symptoms && p.symptoms.length) html += `<p>Symptoms: ${esc(p.symptoms.join(", "))}</p>`;
      if (p.notes) html += `<p class="notes">Notes: ${esc(p.notes)}</p>`;
      html += `</article>`;
      return html;
    })
    .join("");
}

function deleteFromHistory(e) {
  const btn = e.target.closest("[data-delete]");
  if (!btn) return;
  if (!confirm("Delete this period record? This cannot be undone.")) return;
  db.periods = db.periods.filter((p) => p.id !== btn.dataset.delete);
  save(db);
  renderHistory();
}

/* ---------- render: settings ---------- */

function renderSettings() {
  el("#default-cycle").value = db.settings.defaultCycleLength;
  el("#settings-err").textContent = "";
  el("#settings-msg").textContent = "";
}

function submitSettings(e) {
  e.preventDefault();
  const v = parseInt(el("#default-cycle").value, 10);
  const errBox = el("#settings-err");
  if (Number.isNaN(v) || v < 15 || v > 60) {
    errBox.textContent = "Enter a cycle length between 15 and 60 days.";
    el("#default-cycle").focus();
    return;
  }
  errBox.textContent = "";
  db.settings.defaultCycleLength = v;
  save(db);
  el("#settings-msg").textContent = "Settings saved.";
}

/* ---------- router ---------- */

const PAGES = ["dashboard", "calendar", "periods", "history", "diet", "precautions", "settings"];
let calY, calM;

function router() {
  const raw = (location.hash || "#/").replace(/^#\/?/, "");
  const parts = raw.split("/").filter(Boolean);
  let page = parts[0] || "dashboard";
  if (!PAGES.includes(page)) page = "dashboard";

  document.querySelectorAll(".page").forEach((s) => {
    s.hidden = s.id !== "page-" + page;
  });
  document.querySelectorAll("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  if (page === "dashboard") renderDashboard();
  else if (page === "calendar") renderCalendar();
  else if (page === "history") renderHistory();
  else if (page === "periods") renderForm(parts[1] === "edit" ? parts[2] : null);
  else if (page === "settings") renderSettings();
}

/* ---------- init ---------- */

function init() {
  db = load();
  const now = new Date();
  calY = now.getFullYear();
  calM = now.getMonth();

  el("#cal-prev").addEventListener("click", () => {
    calM--;
    if (calM < 0) { calM = 11; calY--; }
    renderCalendar();
  });
  el("#cal-next").addEventListener("click", () => {
    calM++;
    if (calM > 11) { calM = 0; calY++; }
    renderCalendar();
  });
  el("#cal-days").addEventListener("click", (e) => {
    const b = e.target.closest("[data-date]");
    if (b) showDayDetail(b.dataset.date);
  });
  el("#day-detail").addEventListener("click", (e) => {
    const b = e.target.closest("[data-record]");
    if (!b) return;
    prefillStart = b.dataset.record;
    location.hash = "#/periods/new";
  });
  el("#history-list").addEventListener("click", deleteFromHistory);
  el("#period-form").addEventListener("submit", submitPeriod);
  el("#delete-btn").addEventListener("click", deleteCurrentPeriod);
  el("#settings-form").addEventListener("submit", submitSettings);

  window.addEventListener("hashchange", router);
  router();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseDate, toKey, todayKey, addDays, daysBetween,
    formatDate, formatDateRange, validatePeriod,
    computeCycle, estimatedKeys, sortedDesc,
  };
}
if (typeof document !== "undefined") init();
