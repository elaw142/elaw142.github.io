function appendText(parent, tag, className, text, decode = false) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  if (decode) {
    element.classList.add("decode-line");
    element.dataset.decodeText = text;
  }
  parent.appendChild(element);
  return element;
}

function appendLabel(panel, section) {
  appendText(
    panel,
    "p",
    "hud-label decode-line",
    `[ TRANSLATING GLYPH CLUSTER - ${section.faceName} ]`,
    true,
  );
}

function appendAbout(panel, section) {
  appendLabel(panel, section);
  appendText(panel, "h1", "hud-title decode-line", section.name, true);
  appendText(panel, "p", "hud-subtitle decode-line", section.title, true);

  section.bio.forEach((line) => {
    appendText(panel, "p", "hud-copy decode-line", line, true);
  });

  const meta = document.createElement("div");
  meta.className = "hud-meta";
  section.meta.forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "hud-meta-row";
    appendText(row, "span", "hud-key", `[ ${key} ]`);
    appendText(row, "span", "hud-value decode-line", value, true);
    meta.appendChild(row);
  });
  panel.appendChild(meta);
}

function appendProjectLinks(parent, project) {
  if (!project.repo && !project.view) return;

  const links = document.createElement("div");
  links.className = "link-list";

  if (project.view) {
    const view = document.createElement("a");
    view.className = "hud-link";
    view.href = project.view;
    view.target = "_blank";
    view.rel = "noreferrer";
    view.textContent = "VIEW";
    links.appendChild(view);
  }

  if (project.repo) {
    const repo = document.createElement("a");
    repo.className = "hud-link";
    repo.href = project.repo;
    repo.target = "_blank";
    repo.rel = "noreferrer";
    repo.textContent = "REPO";
    links.appendChild(repo);
  }

  parent.appendChild(links);
}

function appendProjects(panel, section) {
  appendLabel(panel, section);
  section.projects.forEach((project) => {
    const entry = document.createElement("article");
    entry.className = "project-entry";

    appendText(entry, "p", "project-code decode-line", project.code, true);
    appendText(entry, "h2", "project-name decode-line", project.name, true);
    appendText(
      entry,
      "p",
      "project-description decode-line",
      project.description,
      true,
    );

    const tags = document.createElement("div");
    tags.className = "tag-list";
    project.tags.forEach((tag) => {
      appendText(tags, "span", "glyph-tag", tag);
    });
    entry.appendChild(tags);

    appendProjectLinks(entry, project);
    panel.appendChild(entry);
  });
}

function appendExperience(panel, section) {
  appendLabel(panel, section);
  section.records.forEach((record) => {
    const entry = document.createElement("article");
    entry.className = "record-entry";

    appendText(entry, "span", "record-range decode-line", record.range, true);

    const body = document.createElement("div");
    appendText(body, "h2", "record-role decode-line", record.role, true);
    appendText(body, "p", "record-org decode-line", record.org, true);
    appendText(
      body,
      "p",
      "record-description decode-line",
      record.description,
      true,
    );
    entry.appendChild(body);
    panel.appendChild(entry);
  });
}

function appendContact(panel, section) {
  appendLabel(panel, section);

  const signal = document.createElement("div");
  signal.className = "signal-lines";
  section.signal.forEach((line) => {
    appendText(signal, "p", "decode-line", line, true);
  });
  panel.appendChild(signal);

  const list = document.createElement("div");
  list.className = "hud-meta";
  section.links.forEach((link) => {
    const row = document.createElement("div");
    row.className = "contact-row";
    appendText(row, "span", "hud-key", `[ ${link.label} ]`);

    const anchor = document.createElement("a");
    anchor.className = "hud-value";
    anchor.href = link.href;
    if (!link.href.startsWith("mailto:")) {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    anchor.textContent = link.text;
    row.appendChild(anchor);
    list.appendChild(row);
  });
  panel.appendChild(list);

  appendText(panel, "p", "contact-status decode-line", section.status, true);
}

function renderPanel(panel, section) {
  const beam = document.createElement("span");
  beam.className = "scan-beam";
  panel.appendChild(beam);

  if (section.id === "about") appendAbout(panel, section);
  if (section.id === "projects") appendProjects(panel, section);
  if (section.id === "experience") appendExperience(panel, section);
  if (section.id === "contact") appendContact(panel, section);
}

function decodePanel(panel) {
  const token = `${Date.now()}-${Math.random()}`;
  panel.dataset.decodeToken = token;
  const lines = [...panel.querySelectorAll("[data-decode-text]")];

  lines.forEach((line, lineIndex) => {
    const text = line.dataset.decodeText;
    line.textContent = "";
    line.classList.add("decode-caret");

    const delay = 60 + lineIndex * 24;
    const duration = Math.min(680, Math.max(180, text.length * 8));
    const start = performance.now() + delay;

    const tick = (now) => {
      if (panel.dataset.decodeToken !== token) return;

      if (now < start) {
        window.requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - start) / duration, 1);
      const visibleCharacters = Math.ceil(text.length * progress);
      line.textContent = text.slice(0, visibleCharacters);

      if (progress < 1) {
        window.requestAnimationFrame(tick);
        return;
      }

      line.classList.remove("decode-caret");
    };

    window.requestAnimationFrame(tick);
  });
}

export function createHud({ root, tabRoot, sections, onSelect }) {
  const panels = sections.map((section, index) => {
    const panel = document.createElement("section");
    panel.className = `hud-panel side-${section.side}`;
    panel.dataset.section = section.id;
    panel.setAttribute("aria-labelledby", `${section.id}-tab`);
    renderPanel(panel, section);
    root.appendChild(panel);

    const tab = document.createElement("button");
    tab.id = `${section.id}-tab`;
    tab.className = "mobile-tab";
    tab.type = "button";
    tab.textContent = section.shortLabel;
    tab.setAttribute("aria-current", index === 0 ? "true" : "false");
    tab.addEventListener("click", () => onSelect(index));
    tabRoot.appendChild(tab);

    return { panel, tab };
  });

  let activeIndex = -1;

  const setActive = (index) => {
    if (activeIndex === index) return;
    activeIndex = index;

    panels.forEach(({ panel, tab }, panelIndex) => {
      const isActive = panelIndex === index;
      panel.classList.toggle("active", isActive);
      panel.setAttribute("aria-hidden", isActive ? "false" : "true");
      tab.setAttribute("aria-current", isActive ? "true" : "false");

      if (isActive) {
        decodePanel(panel);
      }
    });
  };

  setActive(0);

  return {
    setActive,
  };
}
