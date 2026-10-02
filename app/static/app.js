(() => {
  "use strict";

  const state = {
    selectedWorkflow: null,
  };

  const el = (id) => document.getElementById(id);

  function formatInt(n) {
    if (n === null || n === undefined) return "—";
    return Number(n).toLocaleString("en-US");
  }

  function formatPercent(n) {
    if (n === null || n === undefined) return "no data";
    return (Number(n) * 100).toFixed(1) + "%";
  }

  function qs(params) {
    const usp = new URLSearchParams();
    for (const [key, values] of Object.entries(params)) {
      (values || []).forEach((v) => usp.append(key, v));
    }
    const s = usp.toString();
    return s ? `?${s}` : "";
  }

  // ---- Searchable multi-select combobox (replaces plain <select multiple>) --

  function createCombo({ chipsEl, inputEl, listboxEl, clearBtn, onChange = () => {} }) {
    let allValues = [];
    let selected = new Set();
    let filtered = [];
    let activeIndex = -1;

    function currentQuery() {
      return inputEl.value.trim().toLowerCase();
    }

    function renderChips() {
      chipsEl.innerHTML = "";
      selected.forEach((v) => {
        const li = document.createElement("li");
        li.className = "combo-chip";
        const label = document.createElement("span");
        label.textContent = v;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "×";
        btn.setAttribute("aria-label", `Remove ${v}`);
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          selected.delete(v);
          renderChips();
          renderOptions();
          onChange();
        });
        li.appendChild(label);
        li.appendChild(btn);
        chipsEl.appendChild(li);
      });
    }

    function renderOptions() {
      const query = currentQuery();
      filtered = allValues.filter((v) => v.toLowerCase().includes(query));
      listboxEl.innerHTML = "";
      if (!filtered.length) {
        const empty = document.createElement("li");
        empty.className = "combo-empty";
        empty.textContent = "No matches";
        listboxEl.appendChild(empty);
        activeIndex = -1;
        return;
      }
      if (activeIndex >= filtered.length) activeIndex = filtered.length - 1;
      filtered.forEach((v, i) => {
        const li = document.createElement("li");
        li.className = "combo-option";
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", selected.has(v) ? "true" : "false");
        if (selected.has(v)) li.classList.add("is-selected");
        if (i === activeIndex) li.classList.add("is-active");
        const label = document.createElement("span");
        label.textContent = v;
        const check = document.createElement("span");
        check.className = "combo-check";
        check.setAttribute("aria-hidden", "true");
        check.textContent = "✓";
        li.appendChild(label);
        li.appendChild(check);
        li.addEventListener("mousedown", (e) => e.preventDefault());
        li.addEventListener("click", () => toggle(v));
        listboxEl.appendChild(li);
      });
    }

    function toggle(v) {
      if (selected.has(v)) selected.delete(v);
      else selected.add(v);
      inputEl.value = "";
      open();
      renderChips();
      renderOptions();
      inputEl.focus();
      onChange();
    }

    function open() {
      listboxEl.hidden = false;
      inputEl.setAttribute("aria-expanded", "true");
      renderOptions();
    }

    function close() {
      listboxEl.hidden = true;
      inputEl.setAttribute("aria-expanded", "false");
      activeIndex = -1;
    }

    inputEl.addEventListener("focus", open);
    inputEl.addEventListener("input", () => {
      activeIndex = -1;
      open();
    });
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        renderOptions();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        open();
        activeIndex = Math.max(activeIndex - 1, 0);
        renderOptions();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) toggle(filtered[activeIndex]);
      } else if (e.key === "Escape") {
        close();
        inputEl.blur();
      } else if (e.key === "Backspace" && !inputEl.value && selected.size) {
        const last = Array.from(selected).pop();
        selected.delete(last);
        renderChips();
        renderOptions();
        onChange();
      }
    });

    document.addEventListener("click", (e) => {
      const root = chipsEl.closest(".combo");
      if (root && !root.contains(e.target)) close();
    });

    clearBtn.addEventListener("click", () => {
      selected.clear();
      inputEl.value = "";
      renderChips();
      renderOptions();
      onChange();
    });

    return {
      setOptions(values) {
        allValues = values;
        renderChips();
        renderOptions();
      },
      getSelected() {
        return Array.from(selected);
      },
      clear() {
        selected.clear();
        inputEl.value = "";
        renderChips();
        renderOptions();
      },
    };
  }

  function setupCombos() {
    state.orgCombo = createCombo({
      chipsEl: el("combo-org-chips"),
      inputEl: el("combo-org-input"),
      listboxEl: el("combo-org-listbox"),
      clearBtn: document.querySelector('[data-combo-clear="org"]'),
    });
    state.periodCombo = createCombo({
      chipsEl: el("combo-period-chips"),
      inputEl: el("combo-period-input"),
      listboxEl: el("combo-period-listbox"),
      clearBtn: document.querySelector('[data-combo-clear="period"]'),
    });
  }

  // ---- Navigation -------------------------------------------------------

  const PAGE_HEADINGS = {
    overview: {
      title: "Workflow Funnel Dashboard",
      subtitle:
        "Identify workflow completion and drop-off opportunities across organizations and time periods.",
    },
    import: {
      title: "Import & Validate",
      subtitle: "",
    },
  };

  function setupNav() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
        const view = link.dataset.view;
        document.querySelectorAll(".view").forEach((v) => {
          v.hidden = v.id !== `view-${view}`;
        });
        const heading = PAGE_HEADINGS[view] || PAGE_HEADINGS.overview;
        el("page-title").textContent = heading.title;
        const subtitleEl = el("page-subtitle");
        subtitleEl.textContent = heading.subtitle;
        subtitleEl.hidden = !heading.subtitle;
        if (view === "import") {
          loadActiveDatasetDetail();
        }
      });
    });
  }

  // ---- Status / dataset chip --------------------------------------------

  async function loadStatus() {
    const res = await fetch("/api/status");
    const data = await res.json();
    const chip = el("dataset-chip");
    if (data.active && data.dataset) {
      chip.textContent = `Active: ${data.dataset.source_filename} · ${formatInt(data.dataset.row_count)} rows · ${formatInt(data.dataset.workflow_count)} workflows`;
      chip.classList.add("is-active");
    } else {
      chip.textContent = "No active dataset — upload a CSV to begin";
      chip.classList.remove("is-active");
    }
    return data;
  }

  async function loadActiveDatasetDetail() {
    const data = await loadStatus();
    const box = el("active-dataset-detail");
    if (!data.active || !data.dataset) {
      box.innerHTML = `<p class="card-hint">No active dataset yet.</p>`;
      return;
    }
    const d = data.dataset;
    box.innerHTML = `
      <div class="meta-grid">
        <div class="meta-item"><span class="meta-label">File</span><span class="meta-value">${d.source_filename}</span></div>
        <div class="meta-item"><span class="meta-label">Rows</span><span class="meta-value">${formatInt(d.row_count)}</span></div>
        <div class="meta-item"><span class="meta-label">Organizations</span><span class="meta-value">${formatInt(d.organization_count)}</span></div>
        <div class="meta-item"><span class="meta-label">Months</span><span class="meta-value">${formatInt(d.period_count)} (${d.period_min}–${d.period_max})</span></div>
        <div class="meta-item"><span class="meta-label">Workflows</span><span class="meta-value">${formatInt(d.workflow_count)}</span></div>
        <div class="meta-item"><span class="meta-label">Imported</span><span class="meta-value">${new Date(d.imported_at).toLocaleString()}</span></div>
      </div>
    `;
  }

  // ---- Filters -----------------------------------------------------------

  async function loadFilters() {
    const res = await fetch("/api/filters");
    const data = await res.json();
    state.orgCombo.setOptions(data.organizations);
    state.periodCombo.setOptions(data.periods);
  }

  function currentFilters() {
    return {
      organization_id: state.orgCombo.getSelected(),
      period_month: state.periodCombo.getSelected(),
    };
  }

  // ---- Workflow overview ---------------------------------------------------

  async function loadWorkflows() {
    const tbody = el("workflow-table-body");
    tbody.innerHTML = `<tr><td colspan="5" class="empty-row">Loading…</td></tr>`;
    const res = await fetch(`/api/workflows${qs(currentFilters())}`);
    const rows = await res.json();
    state.workflowRows = rows;
    renderWorkflowTable(rows);
    renderCompletionChart(rows);
    renderKpis(rows);
  }

  function sortByCompletionRateAscending(rows) {
    return [...rows].sort((a, b) => {
      const ra = a.workflow_completion_rate;
      const rb = b.workflow_completion_rate;
      if (ra === null) return 1;
      if (rb === null) return -1;
      return ra - rb;
    });
  }

  function renderWorkflowTable(rows) {
    const tbody = el("workflow-table-body");
    tbody.innerHTML = "";
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No data for the active filter scope.</td></tr>`;
      return;
    }
    sortByCompletionRateAscending(rows).forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = "is-selectable";
      tr.tabIndex = 0;
      tr.dataset.workflowName = row.workflow_name;
      tr.setAttribute("role", "button");
      tr.setAttribute(
        "aria-label",
        `View funnel detail for ${row.workflow_name}`
      );
      if (row.workflow_name === state.selectedWorkflow) {
        tr.classList.add("is-selected");
      }
      tr.innerHTML = `
        <td>${row.workflow_name}</td>
        <td>${formatInt(row.workflow_started)}</td>
        <td>${formatInt(row.workflow_completed)}</td>
        <td>${formatPercent(row.workflow_completion_rate)}</td>
        <td><button type="button" class="btn btn-ghost">View funnel</button></td>
      `;
      const select = () => {
        state.selectedWorkflow = row.workflow_name;
        openModal();
        loadFunnel();
      };
      tr.addEventListener("click", select);
      tr.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      });
      tbody.appendChild(tr);
    });
  }

  // ---- Completion chart (horizontal bars) ---------------------------------

  function renderCompletionChart(rows) {
    const chart = el("completion-chart");
    chart.innerHTML = "";
    if (!rows.length) {
      chart.innerHTML = `<p class="empty-row">No data for the active filter scope.</p>`;
      return;
    }
    sortByCompletionRateAscending(rows).forEach((row) => {
      const pct =
        row.workflow_completion_rate === null
          ? 0
          : Math.max(0, Math.min(100, row.workflow_completion_rate * 100));
      const line = document.createElement("div");
      line.className = "chart-row";
      line.innerHTML = `
        <span class="chart-label" title="${row.workflow_name}">${row.workflow_name}</span>
        <span class="chart-bar-track">
          <span class="chart-bar-fill" style="width:${pct}%"></span>
        </span>
        <span class="chart-value">${formatPercent(row.workflow_completion_rate)}</span>
      `;
      chart.appendChild(line);
    });
  }

  // ---- KPI summary cards ----------------------------------------------------

  function renderKpis(rows) {
    const totalStarted = rows.reduce((sum, r) => sum + (r.workflow_started || 0), 0);
    const totalCompleted = rows.reduce((sum, r) => sum + (r.workflow_completed || 0), 0);
    // Sum counts first, then compute the ratio (per METRIC_LOGIC.md convention) —
    // never average the per-workflow completion rates.
    const overallRate = totalStarted > 0 ? totalCompleted / totalStarted : null;

    el("kpi-active-workflows").textContent = formatInt(rows.length);
    el("kpi-total-started").textContent = formatInt(totalStarted);
    el("kpi-total-completed").textContent = formatInt(totalCompleted);
    el("kpi-completion-rate").textContent = rows.length ? formatPercent(overallRate) : "no data";
  }

  // ---- Modal ---------------------------------------------------------------

  function openModal() {
    const modal = el("funnel-modal");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    el("modal-close-x").focus();
  }

  function closeModal() {
    const modal = el("funnel-modal");
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    // Look up the trigger by workflow name rather than keeping a DOM
    // reference, since the table row is rebuilt on every data refresh.
    const trigger =
      state.selectedWorkflow &&
      document.querySelector(
        `tr[data-workflow-name="${CSS.escape(state.selectedWorkflow)}"] .btn`
      );
    if (trigger) trigger.focus();
  }

  function setupModal() {
    const modal = el("funnel-modal");
    el("modal-close-x").addEventListener("click", closeModal);
    el("modal-close-footer").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  // ---- Funnel detail -------------------------------------------------------

  async function loadFunnel() {
    if (!state.selectedWorkflow) return;
    el("selected-workflow-name").textContent = state.selectedWorkflow;
    el("funnel-viz").innerHTML = `<p class="card-hint">Loading…</p>`;
    el("funnel-table-body").innerHTML = `<tr><td colspan="6" class="empty-row">Loading…</td></tr>`;
    renderWorkflowTable(state.workflowRows || []);

    const params = { ...currentFilters(), workflow_name: [state.selectedWorkflow] };
    const res = await fetch(`/api/funnel${qs(params)}`);
    const data = await res.json();
    renderFunnel(data);
  }

  function renderDetailKpis(data) {
    const overviewRow = (state.workflowRows || []).find(
      (r) => r.workflow_name === state.selectedWorkflow
    );
    el("detail-completion-rate").textContent = overviewRow
      ? formatPercent(overviewRow.workflow_completion_rate)
      : "no data";
    el("detail-total-started").textContent = overviewRow
      ? formatInt(overviewRow.workflow_started)
      : "no data";
    el("detail-total-completed").textContent = overviewRow
      ? formatInt(overviewRow.workflow_completed)
      : "no data";
    const h = data.highest_dropoff_step;
    el("detail-highest-dropoff").textContent = h
      ? `Step ${h.step_order} — ${h.step_name} (${formatPercent(h.step_dropoff_rate)})`
      : "no data";
  }

  function renderFunnelViz(steps, highestDropoffStep) {
    const viz = el("funnel-viz");
    viz.innerHTML = "";
    const maxStarted = steps[0] ? steps[0].step_started : 0;
    steps.forEach((step) => {
      const isHighest =
        highestDropoffStep && step.step_order === highestDropoffStep.step_order;
      const totalPct = maxStarted ? (step.step_started / maxStarted) * 100 : 0;
      const completedShare = step.step_started ? step.step_completed / step.step_started : 0;
      const dropoffShare = step.step_started ? step.step_dropoff_count / step.step_started : 0;

      const row = document.createElement("div");
      row.className = "funnel-step" + (isHighest ? " is-highest" : "");
      row.innerHTML = `
        <div class="funnel-step-label">
          <span class="funnel-step-order">Step ${step.step_order}</span>
          <span class="funnel-step-name">${step.step_name}${isHighest ? " ⚠ highest drop-off" : ""}</span>
        </div>
        <div class="funnel-bar-outer">
          <div class="funnel-bar-inner" style="width:${totalPct}%">
            <span class="funnel-bar-completed" style="flex-grow:${Math.max(completedShare, 0.0001)}"></span>
            <span class="funnel-bar-dropoff" style="flex-grow:${Math.max(dropoffShare, 0.0001)}"></span>
          </div>
        </div>
        <div class="funnel-step-values">
          <span>Started <strong>${formatInt(step.step_started)}</strong></span>
          <span>Completed <strong>${formatInt(step.step_completed)}</strong></span>
          <span class="is-dropoff-text">Drop-off <strong>${formatInt(step.step_dropoff_count)}</strong> (${formatPercent(step.step_dropoff_rate)})</span>
        </div>
      `;
      viz.appendChild(row);
    });
  }

  function renderFunnel(data) {
    const tbody = el("funnel-table-body");
    el("funnel-scope-hint").textContent =
      `Ordered steps for "${state.selectedWorkflow}" within the active filter scope.`;

    renderDetailKpis(data);

    if (!data.steps.length) {
      el("funnel-viz").innerHTML = `<p class="empty-row">No data for this workflow in the active filter scope.</p>`;
      tbody.innerHTML = `<tr><td colspan="6" class="empty-row">No data for this workflow in the active filter scope.</td></tr>`;
      return;
    }

    renderFunnelViz(data.steps, data.highest_dropoff_step);

    tbody.innerHTML = "";
    data.steps.forEach((step) => {
      const isHighest =
        data.highest_dropoff_step &&
        step.step_order === data.highest_dropoff_step.step_order;
      const tr = document.createElement("tr");
      if (isHighest) tr.classList.add("is-highest-dropoff");
      tr.innerHTML = `
        <td>${step.step_order}</td>
        <td>${step.step_name}${isHighest ? " ⚠" : ""}</td>
        <td>${formatInt(step.step_started)}</td>
        <td>${formatInt(step.step_completed)}</td>
        <td>${formatInt(step.step_dropoff_count)}</td>
        <td>${formatPercent(step.step_dropoff_rate)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ---- Filter actions ------------------------------------------------------

  function setupFilterActions() {
    el("apply-filters").addEventListener("click", () => {
      loadWorkflows();
      if (state.selectedWorkflow) loadFunnel();
    });
    el("clear-filters").addEventListener("click", () => {
      state.orgCombo.clear();
      state.periodCombo.clear();
      loadWorkflows();
      if (state.selectedWorkflow) loadFunnel();
    });
  }

  // ---- Upload ----------------------------------------------------------

  function setupUpload() {
    el("upload-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fileInput = el("upload-file");
      if (!fileInput.files.length) return;
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const resultBox = el("upload-result");
      resultBox.innerHTML = `<p class="card-hint">Validating…</p>`;

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        resultBox.innerHTML = `
          <span class="status-pill passed">PASSED</span>
          <p>${formatInt(data.row_count)} rows loaded · ${formatInt(data.workflow_count)} workflows · ${formatInt(data.organization_count)} organizations · ${formatInt(data.period_count)} months (${data.period_min}–${data.period_max}).</p>
          <p class="card-hint">Active dataset replaced.</p>
        `;
        fileInput.value = "";
        await Promise.all([loadActiveDatasetDetail(), loadFilters(), loadWorkflows()]);
        if (state.selectedWorkflow) loadFunnel();
      } else {
        const detail = data.detail || data;
        const errors = detail.errors || [];
        resultBox.innerHTML = `
          <span class="status-pill failed">FAILED</span>
          <p>${detail.file ? detail.file + ": " : ""}upload rejected. The active dataset was not changed.</p>
          ${errors.length ? `<ul class="error-list">${errors.slice(0, 20).map((e) => `<li>${e}</li>`).join("")}</ul>` : ""}
          ${errors.length > 20 ? `<p class="card-hint">${errors.length - 20} more error(s) not shown.</p>` : ""}
        `;
      }
    });
  }

  // ---- Boot --------------------------------------------------------------

  async function boot() {
    setupNav();
    setupCombos();
    setupFilterActions();
    setupUpload();
    setupModal();
    await loadStatus();
    await loadFilters();
    await loadWorkflows();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
