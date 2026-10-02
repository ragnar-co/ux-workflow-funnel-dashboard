import { people, products, responses } from "./data.js";
import { getNpsCategory, getNpsScore, groupBy, summarizeResponses } from "./domain/nps.js";

const state = {
  product: "all",
  team: "all",
  person: "all",
  source: "all",
  category: "all",
  view: "dashboard"
};

const titleMap = {
  dashboard: ["Customer Feedback Analytics", "Monitor NPS by product, team, responsible person and event source."],
  org: ["Product & Responsible Team", "Manage products, teams and responsible people used for customer feedback."],
  voc: ["Voice of Customer", "Review comments, detractors and follow-up status."],
  sources: ["Survey Sources", "Map current Blue board / Notion / Metasurvey workflow to the target system."]
};

const $ = (selector) => document.querySelector(selector);

function init() {
  bindNavigation();
  bindFilters();
  populateFilters();
  render();
  $("#updated-at").textContent = `Updated Sep 23, 2026 · ${responses.length} mock responses`;
  $("#export-json").addEventListener("click", () => downloadJson());
  $("#org-search").addEventListener("input", renderOrg);
  $("#voc-search").addEventListener("input", renderVoc);
  $("#voc-sort").addEventListener("change", renderVoc);
  $("#add-product").addEventListener("click", () => alert("Prototype action: Add Product modal"));
  $("#add-team").addEventListener("click", () => alert("Prototype action: Add Team modal"));
  $("#csv-input").addEventListener("change", previewCsv);
}

function bindNavigation() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view;
      document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === `${state.view}-view`));
      const [title, subtitle] = titleMap[state.view];
      $("#page-title").textContent = title;
      $("#page-subtitle").textContent = subtitle;
      render();
    });
  });
}

function bindFilters() {
  ["product", "team", "person", "source"].forEach((name) => {
    $(`#${name}-filter`)?.addEventListener("change", (event) => {
      state[name] = event.target.value;
      renderDashboard();
    });
  });

  $("#category-filter").addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;
    state.category = event.target.dataset.category;
    document.querySelectorAll("#category-filter button").forEach((item) => item.classList.toggle("active", item === event.target));
    renderDashboard();
  });

  $("#voc-tabs").addEventListener("click", (event) => {
    if (!event.target.matches("button")) return;
    state.category = event.target.dataset.category;
    document.querySelectorAll("#voc-tabs button").forEach((item) => item.classList.toggle("active", item === event.target));
    renderVoc();
  });

  $("#reset-filters").addEventListener("click", () => {
    Object.assign(state, { product: "all", team: "all", person: "all", source: "all", category: "all" });
    populateFilters();
    document.querySelectorAll("#category-filter button").forEach((item) => item.classList.toggle("active", item.dataset.category === "all"));
    renderDashboard();
  });
}

function populateFilters() {
  setOptions("#product-filter", ["all", ...products.map((item) => item.name)], "All Products");
  setOptions("#team-filter", ["all", ...new Set(products.flatMap((item) => item.teams))], "All Teams");
  setOptions("#person-filter", ["all", ...people.map((item) => item.name)], "All People");
}

function setOptions(selector, values, allLabel) {
  const element = $(selector);
  if (!element) return;
  element.innerHTML = values.map((value) => `<option value="${value}">${value === "all" ? allLabel : value}</option>`).join("");
  element.value = state[selector.replace("#", "").replace("-filter", "")] || "all";
}

function getFilteredResponses() {
  return responses.filter((item) => {
    const category = getNpsCategory(item.score);
    return (state.product === "all" || item.product === state.product)
      && (state.team === "all" || item.team === state.team)
      && (state.person === "all" || item.responsible === state.person)
      && (state.source === "all" || item.source === state.source)
      && (state.category === "all" || category === state.category);
  });
}

function render() {
  if (state.view === "dashboard") renderDashboard();
  if (state.view === "org") renderOrg();
  if (state.view === "voc") renderVoc();
}

function renderDashboard() {
  const filtered = getFilteredResponses();
  const summary = summarizeResponses(filtered);
  const openFollowUps = filtered.filter((item) => getNpsCategory(item.score) === "detractor" && item.followUpStatus !== "resolved").length;

  $("#metric-grid").innerHTML = [
    metricCard("Overall NPS", signed(summary.nps), "Benchmark B2B Tech: median 30 · good 50", summary.nps < 30 ? "danger" : "good"),
    metricCard("Total Responses", summary.total, "Product + Event survey responses"),
    metricCard("Promoters", `${summary.promoterRate}%`, `${summary.promoters} responses`, "good"),
    metricCard("Passives", `${summary.passiveRate}%`, `${summary.passives} responses`, "warning"),
    metricCard("Detractors", `${summary.detractorRate}%`, `${summary.detractors} responses`, "danger"),
    metricCard("Open Follow-up", openFollowUps, "Detractor cases not resolved", openFollowUps ? "danger" : "good")
  ].join("");

  renderTrend(filtered);
  renderDistribution(summary);
  renderPerformance("#product-performance", filtered, "product");
  renderPerformance("#team-performance", filtered, "team");
  renderPerformance("#person-performance", filtered, "responsible");
}

function metricCard(label, value, caption, tone = "") {
  return `
    <article class="metric-card ${tone}">
      <span>${label}</span>
      <strong>${value}</strong>
      <p>${caption}</p>
    </article>
  `;
}

function renderTrend(items) {
  const weeks = ["Aug 17", "Aug 24", "Aug 31", "Sep 7", "Sep 14", "Sep 21"];
  const values = [24, 31, 18, getNpsScore(items.slice(0, 5)), getNpsScore(items.slice(2, 9)), getNpsScore(items)];
  const points = values.map((value, index) => {
    const x = 64 + index * 126;
    const y = 150 - ((value + 100) / 200) * 120;
    return [x, y, value];
  });
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  $("#trend-chart").innerHTML = `
    <svg viewBox="0 0 760 190" role="img" aria-label="NPS trend">
      <line x1="40" y1="150" x2="720" y2="150" class="axis" />
      <polyline points="${polyline}" class="trend-line" />
      ${points.map(([x, y, value]) => `<circle cx="${x}" cy="${y}" r="5" /><text x="${x}" y="${y - 13}">${signed(value)}</text>`).join("")}
      ${weeks.map((week, index) => `<text x="${64 + index * 126}" y="178" class="tick">${week}</text>`).join("")}
    </svg>
  `;
}

function renderDistribution(summary) {
  $("#distribution").innerHTML = `
    <div class="stacked-bar">
      <span class="bar-promoter" style="width:${summary.promoterRate}%">${summary.promoterRate}%</span>
      <span class="bar-passive" style="width:${summary.passiveRate}%">${summary.passiveRate}%</span>
      <span class="bar-detractor" style="width:${summary.detractorRate}%">${summary.detractorRate}%</span>
    </div>
    <div class="legend">
      <span><b class="dot promoter"></b>Promoter ${summary.promoters}</span>
      <span><b class="dot passive"></b>Passive ${summary.passives}</span>
      <span><b class="dot detractor"></b>Detractor ${summary.detractors}</span>
    </div>
  `;
}

function renderPerformance(selector, items, key) {
  const groups = groupBy(items, key);
  const rows = Object.entries(groups).map(([name, group]) => {
    const nps = getNpsScore(group);
    const width = Math.max(8, Math.min(100, nps + 50));
    return `
      <button class="score-row" data-name="${name}">
        <span><strong>${name}</strong><small>${group.length} responses</small></span>
        <span class="score-track"><i style="width:${width}%"></i></span>
        <strong>${signed(nps)}</strong>
      </button>
    `;
  });
  $(selector).innerHTML = rows.length ? rows.join("") : `<p class="empty">No data from current filters.</p>`;
}

function renderOrg() {
  const query = ($("#org-search")?.value || "").toLowerCase();
  $("#org-tree").innerHTML = products.map((product) => {
    const teams = product.teams.map((team) => {
      const members = people.filter((person) => person.team === team);
      return `
        <div class="tree-team">
          <div class="tree-row"><strong>${team}</strong><span>${members.length} people</span><button>+ Add Person</button></div>
          ${members.map((person) => `<div class="tree-person"><span>${person.name}</span><small>${person.email || "no email on file"}</small><b>ACTIVE</b></div>`).join("")}
        </div>
      `;
    }).join("");
    const text = `${product.name} ${product.teams.join(" ")}`.toLowerCase();
    if (query && !text.includes(query)) return "";
    return `
      <article class="tree-product">
        <div class="tree-row"><strong>${product.name}</strong><span>${product.teams.length} teams</span><button>+ Add Team</button></div>
        ${teams}
      </article>
    `;
  }).join("");
}

function renderVoc() {
  const search = ($("#voc-search")?.value || "").toLowerCase();
  const sort = $("#voc-sort")?.value || "newest";
  let items = responses.filter((item) => state.category === "all" || getNpsCategory(item.score) === state.category);
  items = items.filter((item) => `${item.customer} ${item.comment} ${item.product}`.toLowerCase().includes(search));
  if (sort === "lowest") items.sort((a, b) => a.score - b.score);
  if (sort === "sla") items.sort((a, b) => (a.slaHoursLeft ?? 999) - (b.slaHoursLeft ?? 999));
  if (sort === "newest") items.sort((a, b) => b.date.localeCompare(a.date));

  $("#voc-grid").innerHTML = items.map((item) => {
    const category = getNpsCategory(item.score);
    const slaText = item.slaHoursLeft == null ? "" : item.slaHoursLeft < 0 ? `SLA breached ${Math.abs(item.slaHoursLeft)}h ago` : `SLA ${item.slaHoursLeft}h remaining`;
    return `
      <article class="voc-card ${category}">
        <div class="voc-top"><strong>${item.customer}</strong><span>${item.score}/10 · ${category}</span></div>
        <p class="meta">${item.product} · ${item.team} · ${item.responsible}</p>
        <blockquote>${item.comment}</blockquote>
        <div class="tag-row">
          <span>${item.source === "event" ? "Event" : "Product"}</span>
          ${item.followUpStatus !== "none" ? `<span>${item.followUpStatus}</span>` : ""}
        </div>
        <div class="voc-bottom"><small>${item.date}</small><small class="${item.slaHoursLeft < 0 ? "sla-danger" : ""}">${slaText}</small></div>
      </article>
    `;
  }).join("");
}

function signed(value) {
  return Number(value) > 0 ? `+${value}` : `${value}`;
}

function downloadJson() {
  const blob = new Blob([JSON.stringify({ products, people, responses }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ragnar-nps-mock-data.json";
  link.click();
}

function previewCsv(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  file.text().then((text) => {
    const rows = text.trim().split(/\r?\n/);
    $("#import-result").textContent = `Ready to map ${Math.max(0, rows.length - 1)} rows.\nHeader: ${rows[0] || "-"}`;
  });
}

init();
