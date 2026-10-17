(() => {
  const data = window.PORTFOLIO;
  const hasPlaceholder = value => !value || /^\[.*\]$/.test(value);
  document.querySelectorAll("[data-content]").forEach(el => {
    const value = data[el.dataset.content];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-link]").forEach(link => {
    const value = data.links[link.dataset.link];
    if (!value || value === "#") {
      link.href = "#contact";
      link.classList.add("is-placeholder");
    } else {
      link.href = link.dataset.link === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value;
      link.classList.remove("is-placeholder");
    }
  });
  document.querySelectorAll("[data-content=name]").forEach(el => el.textContent = data.name);
  document.title = `${data.name} — ${data.role}`;
  document.querySelector('meta[name="description"]').content = `The portfolio of ${data.name}, ${data.role}. Explore selected work, skills, experience, and get in touch.`;
  document.querySelector('meta[property="og:title"]').content = `${data.name} — ${data.role}`;
  document.querySelector('meta[property="og:description"]').content = `Selected work, experience, and ways to connect with ${data.name}.`;

  const projectGrid = document.querySelector("#project-grid");
  const countFor = filter => filter === "all" ? data.projects.length : data.projects.filter(p => p.category === filter).length;
  document.querySelectorAll(".filter-button").forEach(button => {
    const count = button.querySelector("span");
    if (count) count.textContent = String(countFor(button.dataset.filter)).padStart(2, "0");
  });
  const drawProjects = filter => {
    const projects = data.projects.filter(p => filter === "all" || p.category === filter);
    if (!projects.length) {
      projectGrid.innerHTML = `<p class="quiet-placeholder">No projects in this category yet.</p>`;
      return;
    }
    projectGrid.innerHTML = projects.map((p, i) => `
      <article class="project-card${p.details ? " project-featured" : ""}" style="--card-index:${i}">
        <div class="project-visual ${p.visual}" aria-hidden="true"><div class="visual-frame"><span class="visual-kicker">${p.label}</span><span class="visual-glyph">${p.visual === "orange" ? "↗" : p.visual === "blue" ? "◌" : "✳"}</span><span class="visual-caption">${p.title}</span></div><span class="visual-number">0${i + 1}</span></div>
        <div class="project-meta"><span>${p.category.toUpperCase()}</span><span>${p.year}</span></div>
        <h3>${p.title}</h3><p>${p.description}</p>
        ${p.details ? `<details class="project-detail"><summary>Project details <span aria-hidden="true">+</span></summary><div class="detail-content"><h4>WHAT IT INCLUDES</h4><ul>${p.details.features.map(feature => `<li>${feature}</li>`).join("")}</ul><h4>TECHNOLOGY</h4><div class="detail-tags">${p.details.stack.map(item => `<span>${item}</span>`).join("")}</div><p class="detail-note">${p.details.note}</p></div></details>` : ""}
        <div class="project-bottom"><div class="tag-list">${p.tags.map(t => `<span>${t}</span>`).join("")}</div><div class="project-links">${p.demo ? `<a href="${p.demo}" target="_blank" rel="noreferrer">Live demo ↗</a>` : ""}${p.source ? `<a href="${p.source}" target="_blank" rel="noreferrer">Source ↗</a>` : ""}</div></div>
      </article>`).join("");
  };
  drawProjects("all");
  document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-pressed", b === button ? "true" : "false"); });
    drawProjects(button.dataset.filter);
  }));

  const skills = document.querySelector("#skills-list");
  skills.innerHTML = data.skills.filter(s => s.items.length && !hasPlaceholder(s.area)).map(s => `<div class="skill-row"><h4>${s.area}</h4><div>${s.items.filter(x => !hasPlaceholder(x)).map(x => `<span>${x}</span>`).join("")}</div></div>`).join("");
  if (!skills.innerHTML) skills.innerHTML = `<p class="quiet-placeholder">Add your verified skill areas in <code>content.js</code>.</p>`;

  const timeline = document.querySelector("#timeline");
  timeline.innerHTML = data.experience.filter(e => !hasPlaceholder(e.title)).map(e => `<article class="timeline-row"><span class="timeline-date">${e.period}</span><div><h3>${e.title}</h3><p class="timeline-org">${e.organization}</p><p class="timeline-description">${e.description}</p>${e.type ? `<span class="timeline-type">${e.type}</span>` : ""}</div><span class="timeline-arrow" aria-hidden="true">↗</span></article>`).join("");
  if (!timeline.innerHTML) timeline.innerHTML = `<p class="quiet-placeholder">No experience entries added yet. Add only verified roles, education, certifications, or achievements in <code>content.js</code>.</p>`;

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  toggle.addEventListener("click", () => { const open = toggle.getAttribute("aria-expanded") !== "true"; toggle.setAttribute("aria-expanded", String(open)); nav.classList.toggle("open", open); });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("open"); }));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
    document.querySelectorAll(".section-heading, .about-grid, .timeline-row").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".section-heading, .project-card, .about-grid, .timeline-row").forEach(el => el.classList.add("in-view"));
  }
})();
