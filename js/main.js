/* ==========================================================
   LOGIKA WEBSITE PORTOFOLIO
   Membaca data dari js/data.js (variabel SITE), lalu:
   1. mengisi halaman, 2. navbar + maskot + scroll-spy,
   3. timeline, folder, tab, carousel, polaroid awards,
   4. form kontak (mailto) dan komentar (localStorage)
   ========================================================== */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- ikon (inline SVG, tanpa library) ---------- */
  const ICONS = {
    code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    maximize: '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
    left: '<polyline points="15 18 9 12 15 6"/>',
    right: '<polyline points="9 18 15 12 9 6"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    imageplus: '<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" y1="5" x2="22" y2="5"/><line x1="19" y1="2" x2="19" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    tiktok: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  /* ==========================================================
     1. ISI HALAMAN DARI DATA
     ========================================================== */
  function fillStatic() {
    document.title = SITE.title;
    $("#name").innerHTML = `${esc(SITE.firstName)}<br>${esc(SITE.lastName)}`;
    $("#bio").textContent = SITE.bio;
    const avatar = $("#avatar");
    avatar.src = SITE.avatar;
    avatar.alt = `Foto ${SITE.name}`;
    const cv = $("#cv-btn");
    cv.innerHTML = `${icon("file")} View CV`;
    cv.href = SITE.cvUrl;
    $("#projects-btn").innerHTML = `${icon("code")} View Projects`;
    $("#contact-photo").src = SITE.contactPhoto;
    $("#year").textContent = new Date().getFullYear();
    $("#footer-name").textContent = SITE.name;
    $("#modal-close").innerHTML = icon("x");
    $$("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
    $$(".car-btn.prev").forEach((b) => (b.innerHTML = icon("left")));
    $$(".car-btn.next").forEach((b) => (b.innerHTML = icon("right")));

    const tabIcons = { projects: ["code", "Projects"], certificates: ["award", "Certificates"], awards: ["trophy", "Awards"] };
    $$(".tab").forEach((t) => {
      const [ic, label] = tabIcons[t.dataset.tab];
      t.innerHTML = `${icon(ic)}<span>${label}</span>`;
    });

    $("#socials").innerHTML = SITE.socials
      .map((s) => {
        const glyph = s.icon === "linkedin" ? "in" : ICONS[s.icon] ? icon(s.icon) : icon("link");
        return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">
          <span class="soc-ico ${ICONS[s.icon] || s.icon === "linkedin" ? esc(s.icon) : "generic"}">${glyph}</span>
          <span class="soc-txt"><b>${esc(s.label)}</b><small>${esc(s.sub)}</small></span>
          <span class="soc-out">${icon("external")}</span></a></li>`;
      })
      .join("");
  }

  /* ---------- timeline (Education & Experience) ---------- */
  function renderTimeline(selector, items) {
    $(selector).innerHTML = items
      .map(
        (it, i) => `<li>
          <span class="tl-num">${i + 1}</span>
          <div>
            <div class="tl-head"><span class="tl-logo">${esc(it.logo || "•")}</span><span class="tl-org">${esc(it.org)}</span><span class="tl-date">${esc(it.date)}</span></div>
            <h3 class="tl-role">${esc(it.role)}</h3>
            <div class="tl-meta"><span>${esc(it.meta)}</span><b>${esc(it.tag)}</b></div>
          </div></li>`
      )
      .join("");
  }

  function watchTimelines() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-active", e.isIntersecting)),
      { rootMargin: "-32% 0px -32% 0px" }
    );
    $$(".timeline li").forEach((li) => io.observe(li));
  }

  /* ---------- folder ---------- */
  function renderFolders() {
    const defs = [
      { tab: "projects", label: "Projects", list: SITE.projects },
      { tab: "certificates", label: "Certificates", list: SITE.certificates },
      { tab: "awards", label: "Awards", list: SITE.awards },
    ];
    $("#folders").innerHTML = defs
      .map(
        (d) => `<button class="folder" type="button" data-tab="${d.tab}" aria-label="Buka ${d.label}">
          <span class="f-back"></span>
          <span class="f-papers">${d.list.slice(0, 3).map((x) => `<img src="${esc(x.image)}" alt="">`).join("")}</span>
          <span class="f-front">
            <span><span class="f-count">${d.list.length}</span><span class="f-label">${d.label}</span></span>
            <span class="f-dots"><i></i><i></i><i></i></span>
          </span></button>`
      )
      .join("");
    $$(".folder").forEach((f) => f.addEventListener("click", () => goToPortfolio(f.dataset.tab)));
  }

  /* ==========================================================
     2. NAVBAR: indikator, maskot, scroll-spy, tema
     ========================================================== */
  const nav = $("#nav");
  const navLinks = $$(".nav-link");
  let currentSection = "home";

  function placeIndicator() {
    const link = navLinks.find((l) => l.dataset.section === currentSection) || navLinks[0];
    nav.style.setProperty("--ind-x", `${link.offsetLeft}px`);
    nav.style.setProperty("--ind-w", `${link.offsetWidth}px`);
    nav.style.setProperty("--mx", `${link.offsetLeft + link.offsetWidth / 2}px`);
  }

  function setActive(id, theme) {
    currentSection = id;
    document.body.dataset.theme = theme || "dark";
    navLinks.forEach((l) => l.classList.toggle("is-active", l.dataset.section === id));
    placeIndicator();
  }

  function initScrollSpy() {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id, e.target.dataset.theme)),
      { rootMargin: "-8% 0px -90% 0px" } // pita tipis di sekitar posisi navbar
    );
    $$("main > section").forEach((s) => io.observe(s));
  }

  // mata maskot mengikuti kursor
  function initMascot() {
    const mascot = $("#mascot");
    window.addEventListener(
      "pointermove",
      (e) => {
        const r = mascot.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 140) * 2;
        mascot.style.setProperty("--ex", `${(dx / dist) * k}px`);
        mascot.style.setProperty("--ey", `${(dy / dist) * k}px`);
      },
      { passive: true }
    );
  }

  /* ==========================================================
     3. TAB + CAROUSEL + AWARDS
     ========================================================== */
  const modal = $("#modal");
  const carousels = {};

  function openModal(html) {
    $("#modal-body").innerHTML = html;
    if (!modal.open) modal.showModal();
  }
  $("#modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => e.target === modal && modal.close()); // klik area gelap = tutup

  function openProject(p) {
    const links = [
      p.demo && p.demo !== "#" ? `<a class="btn sm" href="${esc(p.demo)}" target="_blank" rel="noopener">Live Demo ${icon("external")}</a>` : "",
      p.source && p.source !== "#" ? `<a class="btn sm ghost" href="${esc(p.source)}" target="_blank" rel="noopener">${icon("code")} Source Code</a>` : "",
    ].join("");
    openModal(`<img class="m-img" src="${esc(p.image)}" alt="${esc(p.title)}">
      <div class="m-body"><h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
      <div class="m-tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="m-actions">${links}</div></div>`);
  }

  function openImage(item) {
    openModal(`<img class="m-img" src="${esc(item.image)}" alt="${esc(item.title)}">
      <div class="m-body"><h3>${esc(item.title)}</h3></div>`);
  }

  function makeCarousel(root, items, build) {
    const track = $(".track", root);
    const prev = $(".prev", root);
    const next = $(".next", root);
    if (!items.length) {
      track.innerHTML = '<article class="slide is-active"><h3>Belum ada karya</h3><p class="desc">Karya baru akan segera ditampilkan.</p></article>';
      prev.hidden = true;
      next.hidden = true;
      return { update() {}, go() {}, step() {} };
    }
    const slides = items.map((item, i) => {
      const el = build(item);
      el.classList.add("slide");
      el.addEventListener(
        "click",
        (e) => {
          if (i !== index) { e.preventDefault(); e.stopPropagation(); go(i); }
        },
        true
      );
      track.appendChild(el);
      return el;
    });
    let index = slides.length > 2 ? 1 : 0;

    function update() {
      const active = slides[index];
      if (!active || !root.clientWidth) return;
      const x = root.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
      track.style.transform = `translate3d(${x}px,0,0)`;
      slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    }
    function go(i) { index = clamp(i, 0, slides.length - 1); update(); }

    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));

    // geser dengan jari / mouse
    let startX = null;
    const vp = $(".viewport", root);
    vp.addEventListener("pointerdown", (e) => (startX = e.clientX));
    vp.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
    });
    vp.addEventListener("pointercancel", () => (startX = null));

    return { update, go, step: (d) => go(index + d) };
  }

  function buildCarousels() {
    carousels.projects = makeCarousel($('[data-carousel="projects"]'), SITE.projects, (p) => {
      const el = document.createElement("article");
      el.innerHTML = `<div class="thumb"><img src="${esc(p.image)}" alt="Tampilan ${esc(p.title)}" loading="lazy"></div>
        <h3>${esc(p.title)}</h3><p class="desc">${esc(p.desc)}</p>
        <button class="btn sm" type="button">Details ${icon("arrow")}</button>`;
      $("button", el).addEventListener("click", () => openProject(p));
      return el;
    });
    carousels.certificates = makeCarousel($('[data-carousel="certificates"]'), SITE.certificates, (c) => {
      const el = document.createElement("article");
      el.classList.add("cert");
      el.innerHTML = `<div class="thumb"><img src="${esc(c.image)}" alt="${esc(c.title)}" loading="lazy">
        <button class="view-cert" type="button">${icon("maximize")} View Certificate</button></div>`;
      $(".view-cert", el).addEventListener("click", () => openImage(c));
      return el;
    });
  }

  function renderAwards() {
    const stage = $("#stage");
    let z = 10;
    SITE.awards.forEach((a) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "polaroid";
      el.style.setProperty("--x", `${a.x}%`);
      el.style.setProperty("--y", `${a.y}%`);
      el.style.setProperty("--rot", `${a.rot || 0}deg`);
      el.setAttribute("aria-label", a.title);
      el.innerHTML = `<img src="${esc(a.image)}" alt="${esc(a.title)}" draggable="false"><span>${esc(a.title)}</span>`;

      el.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        const sx = e.clientX, sy = e.clientY;
        const left0 = el.offsetLeft, top0 = el.offsetTop;
        let moved = false;
        el.setPointerCapture(e.pointerId);
        el.style.zIndex = ++z;

        const move = (ev) => {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
          moved = true;
          el.classList.add("dragging");
          const maxX = stage.clientWidth - el.offsetWidth;
          const maxY = stage.clientHeight - el.offsetHeight;
          el.style.setProperty("--x", `${(clamp(left0 + dx, 0, maxX) / stage.clientWidth) * 100}%`);
          el.style.setProperty("--y", `${(clamp(top0 + dy, 0, maxY) / stage.clientHeight) * 100}%`);
        };
        const up = () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", up);
          el.classList.remove("dragging");
          if (!moved) openImage(a);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
      });
      el.addEventListener("keydown", (e) => e.key === "Enter" && openImage(a));
      stage.appendChild(el);
    });
  }

  function switchTab(name) {
    $$(".tab").forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
    });
    ["projects", "certificates", "awards"].forEach((n) => ($(`#panel-${n}`).hidden = n !== name));
    if (carousels[name]) requestAnimationFrame(() => carousels[name].update());
    const stage = $("#stage");
    stage.classList.remove("spread");
    if (name === "awards") requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add("spread")));
  }

  function goToPortfolio(tab) {
    switchTab(tab);
    $("#portfolio").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initTabs() {
    $$(".tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));
    window.addEventListener("keydown", (e) => {
      if (modal.open || currentSection !== "portfolio") return;
      const active = $(".tab.is-active").dataset.tab;
      if (!carousels[active]) return;
      if (e.key === "ArrowRight") carousels[active].step(1);
      if (e.key === "ArrowLeft") carousels[active].step(-1);
    });
    window.addEventListener("resize", () => {
      placeIndicator();
      Object.values(carousels).forEach((c) => c.update());
    });
  }

  /* ==========================================================
     4. FORM KONTAK + KOMENTAR
     ========================================================== */
  function validate(form) {
    let firstBad = null;
    $$("input[required], textarea[required]", form).forEach((el) => {
      const ok = el.value.trim() !== "" && el.checkValidity();
      (el.closest(".field") || el).classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); toast("Lengkapi dulu kolom yang kosong ya."); }
    return !firstBad;
  }

  function initContactForm() {
    const form = $("#contact-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const d = new FormData(form);
      const subject = `Pesan dari ${d.get("name")} (via portofolio)`;
      const body = `${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast("Membuka aplikasi email kamu…");
      form.reset();
    });
  }

  const STORE_KEY = "portfolio-comments-v1";
  const loadComments = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
  };
  const saveComments = (list) => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); return true; } catch { return false; }
  };
  let comments = loadComments();

  function renderComments() {
    $("#comment-count").textContent = `(${comments.length})`;
    const ul = $("#comments");
    ul.innerHTML = "";
    if (!comments.length) {
      ul.innerHTML = '<li class="empty" style="display:block">Belum ada komentar. Jadi yang pertama!</li>';
      return;
    }
    comments.forEach((c) => {
      const li = document.createElement("li");
      let av;
      if (c.photo) { av = document.createElement("img"); av.src = c.photo; av.alt = ""; }
      else { av = document.createElement("div"); av.textContent = (c.name[0] || "?").toUpperCase(); }
      av.className = "avatar";
      const box = document.createElement("div");
      const head = document.createElement("div");
      head.className = "cm-head";
      const b = document.createElement("b"); b.textContent = c.name;
      const t = document.createElement("time"); t.dateTime = c.date;
      t.textContent = new Date(c.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      head.append(b, t);
      const p = document.createElement("p"); p.className = "cm-text"; p.textContent = c.text;
      box.append(head, p);
      li.append(av, box);
      ul.appendChild(li);
    });
  }

  // kecilkan foto profil jadi 96x96 supaya hemat localStorage
  function resizeImage(file, size = 96) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const s = Math.min(img.width, img.height);
        c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
      img.src = url;
    });
  }

  function initComments() {
    const form = $("#comment-form");
    const fileInput = $("#photo");
    const label = $("#file-label");
    let photoData = "";

    fileInput.addEventListener("change", async () => {
      const f = fileInput.files[0];
      photoData = "";
      if (!f) { label.textContent = "Choose Profile Photo"; return; }
      if (!f.type.startsWith("image/")) { toast("File harus berupa gambar."); fileInput.value = ""; return; }
      if (f.size > 5 * 1024 * 1024) { toast("Ukuran file maksimal 5MB."); fileInput.value = ""; return; }
      try { photoData = await resizeImage(f); label.textContent = f.name; }
      catch { toast("Gambar tidak bisa dibaca."); fileInput.value = ""; }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const d = new FormData(form);
      comments.unshift({
        id: Date.now(),
        name: String(d.get("name")).trim().slice(0, 40),
        text: String(d.get("comment")).trim().slice(0, 400),
        photo: photoData,
        date: new Date().toISOString(),
      });
      const saved = saveComments(comments);
      renderComments();
      form.reset();
      photoData = "";
      label.textContent = "Choose Profile Photo";
      toast(saved ? "Komentar terkirim. Terima kasih!" : "Komentar tampil, tapi gagal disimpan di browser.");
    });
    renderComments();
  }

  /* ---------- animasi muncul saat scroll ---------- */
  function initReveal() {
    const targets = $$(".intro > *, .two-col > *, .folder, .tabs, .card, .big-title");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    targets.forEach((t, i) => {
      t.classList.add("reveal");
      t.style.transitionDelay = `${(i % 3) * 80}ms`;
      io.observe(t);
    });
  }

  /* ---------- Supabase: karya publik + admin (multi-tenant) ---------- */
  const SUPABASE = SITE.supabase;

  const isValidKey = typeof SUPABASE.publishableKey === "string" &&
    (SUPABASE.publishableKey.startsWith("eyJ") || SUPABASE.publishableKey.startsWith("sb_publishable_")) &&
    SUPABASE.publishableKey.length > 20;

  if (!isValidKey) console.warn("[Supabase] publishableKey di data.js tampak tidak valid.");

  const apiHeaders = { apikey: SUPABASE.publishableKey, Authorization: `Bearer ${SUPABASE.publishableKey}` };
  let adminToken   = sessionStorage.getItem("portfolio-admin-token") || "";
  let currentUser  = null;   // user yg sedang login
  let cloudItems   = [];

  // Deteksi username dari URL: site.com/username atau site.com?user=username
  const urlUsername = (() => {
    const path = window.location.pathname.replace(/^\//, "").split("/")[0];
    if (path && /^[a-z0-9_-]{2,30}$/.test(path)) return path;
    return new URLSearchParams(window.location.search).get("user") || null;
  })();

  // Path gambar disimpan di folder milik owner: {userId}/{filename}
  const publicImageUrl = (path) =>
    `${SUPABASE.url}/storage/v1/object/public/portfolio-assets/${path.includes("/") ? path : encodeURIComponent(path)}`;

  const cloudToItem = (item, i) => ({
    title: item.title, desc: item.description,
    image: publicImageUrl(item.image_path),
    tags: item.tags || [], demo: item.demo_url || "#", source: "#", id: item.id,
    x: 18 + (i * 17) % 58, y: 12 + (i * 19) % 52, rot: (i % 3 - 1) * 4
  });

  async function responseError(response, fallback) {
    try {
      const r = await response.json();
      return r.message || r.error_description || r.error || fallback;
    } catch { return fallback; }
  }

  function refreshPublicPortfolio() {
    SITE.projects      = cloudItems.filter((x) => x.category === "projects").map(cloudToItem);
    SITE.certificates  = cloudItems.filter((x) => x.category === "certificates").map(cloudToItem);
    SITE.awards        = cloudItems.filter((x) => x.category === "awards").map(cloudToItem);
    $$(".track").forEach((t) => (t.innerHTML = ""));
    $("#stage").innerHTML = "";
    renderFolders(); buildCarousels(); renderAwards();
  }

  async function loadCloudItems() {
    try {
      const res = await fetch(`${SUPABASE.url}/rest/v1/portfolio_items?select=*&order=position.asc,created_at.desc`, {
        headers: apiHeaders,
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        cloudItems = await res.json();
        SITE.projects     = cloudItems.filter((x) => x.category === "projects").map(cloudToItem);
        SITE.certificates = cloudItems.filter((x) => x.category === "certificates").map(cloudToItem);
        SITE.awards       = cloudItems.filter((x) => x.category === "awards").map(cloudToItem);
      }
    } catch (err) {
      console.warn("Gagal memuat karya online:", err);
    }
  }

  function refreshAdminList() {
    const list = $("#admin-work-list");
    if (!list) return;
    const mine = cloudItems;
    list.innerHTML = mine.length
      ? mine.map((item) => `
        <li>
          <img src="${esc(publicImageUrl(item.image_path))}" alt="">
          <span>${esc(item.title)} <small style="color:var(--muted,#64748b); font-weight:normal;">(${esc(item.category)})</small></span>
          <div class="item-actions">
            <button type="button" class="btn-edit" data-edit="${esc(item.id)}" title="Edit keterangan karya ini">✏️ Edit</button>
            <button type="button" class="btn-delete" data-delete="${esc(item.id)}" title="Hapus karya ini">🗑️ Hapus</button>
          </div>
        </li>
      `).join("")
      : "<li>Belum ada karya online. Upload karya pertamamu di atas!</li>";

    $$("[data-edit]", list).forEach((btn) => btn.addEventListener("click", () => startEditWork(btn.dataset.edit)));
    $$("[data-delete]", list).forEach((btn) => btn.addEventListener("click", () => deleteCloudItem(btn.dataset.delete)));
  }

  function startEditWork(id) {
    const item = cloudItems.find((x) => x.id === id);
    if (!item) return;

    // Pastikan berada di tab kelola karya
    switchAdminTab("works");

    const editIdInput = $("#edit-work-id");
    const titleInput  = $("#work-title");
    const descInput   = $("#work-desc");
    const catInput    = $("#work-category");
    const tagsInput   = $("#work-tags");
    const demoInput   = $("#work-demo");
    const imgLabel    = $("#work-image-label");
    const imgInput    = $("#work-image-input");
    const submitBtn   = $("#work-submit-btn");
    const cancelBtn   = $("#work-cancel-edit-btn");
    const formTitle   = $("#admin-work-form-title");
    const formDesc    = $("#admin-work-form-desc");

    if (editIdInput) editIdInput.value = item.id;
    if (titleInput)  titleInput.value  = item.title;
    if (descInput)   descInput.value   = item.desc || item.description || "";
    if (catInput)    catInput.value    = item.category;
    if (tagsInput)   tagsInput.value   = Array.isArray(item.tags) ? item.tags.join(", ") : "";
    if (demoInput)   demoInput.value   = item.demo && item.demo !== "#" ? item.demo : "";

    if (imgLabel)    imgLabel.textContent = "Ganti gambar (opsional, biarkan kosong jika foto tidak diubah)";
    if (imgInput)    imgInput.required    = false;
    if (submitBtn)   submitBtn.textContent = "Simpan Perubahan";
    if (cancelBtn)   cancelBtn.style.display = "inline-block";
    if (formTitle)   formTitle.textContent = `Edit Karya: ${item.title}`;
    if (formDesc)    formDesc.textContent  = "Ubah judul, keterangan, kategori, link, atau ganti foto karya.";

    const form = $("#admin-work-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEditWork() {
    const form        = $("#admin-work-form");
    if (form) form.reset();
    const editIdInput = $("#edit-work-id");
    const imgLabel    = $("#work-image-label");
    const imgInput    = $("#work-image-input");
    const submitBtn   = $("#work-submit-btn");
    const cancelBtn   = $("#work-cancel-edit-btn");
    const formTitle   = $("#admin-work-form-title");
    const formDesc    = $("#admin-work-form-desc");
    const statusEl    = $("#admin-save-status");

    if (editIdInput) editIdInput.value = "";
    if (imgLabel)    imgLabel.textContent = "Gambar karya";
    if (imgInput)    imgInput.required = true;
    if (submitBtn)   submitBtn.textContent = "Simpan karya";
    if (cancelBtn)   cancelBtn.style.display = "none";
    if (formTitle)   formTitle.textContent = "Tambah karya baru";
    if (formDesc)    formDesc.textContent = "Upload gambar karya (JPG, PNG, WebP, GIF). Maksimal 50MB.";
    if (statusEl)    statusEl.textContent = "";
  }

  async function deleteCloudItem(id) {
    const item = cloudItems.find((x) => x.id === id);
    const itemTitle = item ? `"${item.title}"` : "karya ini";
    if (!confirm(`Hapus ${itemTitle} dari portofolio? Foto dan data akan dihapus permanen.`)) return;
    const hdr = { ...apiHeaders, Authorization: `Bearer ${adminToken}` };
    try {
      const res = await fetch(`${SUPABASE.url}/rest/v1/portfolio_items?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: hdr });
      if (!res.ok) return toast(`Gagal hapus: ${await responseError(res, "izin ditolak")}`);
      if (item && item.image_path) {
        fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${item.image_path}`, { method: "DELETE", headers: hdr }).catch(() => {});
      }
    } catch (err) { return toast(`Gagal hapus: ${err.message}`); }

    cloudItems = cloudItems.filter((x) => x.id !== id);
    const editIdInput = $("#edit-work-id");
    if (editIdInput && editIdInput.value === id) cancelEditWork();
    refreshAdminList();
    refreshPublicPortfolio();
    toast("✅ Karya dan foto berhasil dihapus.");
  }

  function switchAdminTab(tab) {
    const worksSection    = $("#admin-tab-works");
    const timelineSection = $("#admin-tab-timeline");
    const profileSection  = $("#admin-tab-profile");

    const btnWorks    = $("#tab-btn-works");
    const btnTimeline = $("#tab-btn-timeline");
    const btnProfile  = $("#tab-btn-profile");

    if (worksSection)    worksSection.style.display    = tab === "works"    ? "block" : "none";
    if (timelineSection) timelineSection.style.display = tab === "timeline" ? "block" : "none";
    if (profileSection)  profileSection.style.display  = tab === "profile"  ? "block" : "none";

    const setBtn = (btn, active) => {
      if (!btn) return;
      if (active) {
        btn.style.background = "";
        btn.style.border = "none";
      } else {
        btn.style.background = "transparent";
        btn.style.border = "1px solid #cbd5e1";
      }
    };

    setBtn(btnWorks,    tab === "works");
    setBtn(btnTimeline, tab === "timeline");
    setBtn(btnProfile,  tab === "profile");

    if (tab === "timeline") {
      refreshTimelineLists();
    } else if (tab === "profile") {
      const nameInp = $("#profile-name");
      const bioInp  = $("#profile-bio");
      const cvInp   = $("#profile-cv");
      if (nameInp) nameInp.value = SITE.name || "";
      if (bioInp)  bioInp.value  = SITE.bio || "";
      if (cvInp)   cvInp.value   = SITE.cvUrl && SITE.cvUrl !== "#" ? SITE.cvUrl : "";
    }
  }

  function refreshTimelineLists() {
    const eduList = $("#admin-edu-list");
    const expList = $("#admin-exp-list");
    if (!eduList || !expList) return;

    eduList.innerHTML = (SITE.education || []).length
      ? SITE.education.map((it, idx) => `
        <li>
          <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; background:#e2e8f0; border-radius:6px; font-weight:800; font-size:12px; color:#334155;">${esc(it.logo || "•")}</span>
          <span style="flex:1;">
            <b>${esc(it.org)}</b> <small style="color:#64748b;">(${esc(it.date)})</small><br>
            <small style="color:#475569;">${esc(it.role)} • <span style="font-weight:600; color:#0284c7;">${esc(it.tag)}</span></small>
          </span>
          <div class="item-actions">
            <button type="button" class="btn-edit" data-edit-edu="${idx}">✏️ Edit</button>
            <button type="button" class="btn-delete" data-del-edu="${idx}">🗑️ Hapus</button>
          </div>
        </li>
      `).join("")
      : "<li>Belum ada data education.</li>";

    expList.innerHTML = (SITE.experience || []).length
      ? SITE.experience.map((it, idx) => `
        <li>
          <span style="display:inline-flex; align-items:center; justify-content:center; width:34px; height:34px; background:#e2e8f0; border-radius:6px; font-weight:800; font-size:12px; color:#334155;">${esc(it.logo || "•")}</span>
          <span style="flex:1;">
            <b>${esc(it.org)}</b> <small style="color:#64748b;">(${esc(it.date)})</small><br>
            <small style="color:#475569;">${esc(it.role)} • <span style="font-weight:600; color:#0284c7;">${esc(it.tag)}</span></small>
          </span>
          <div class="item-actions">
            <button type="button" class="btn-edit" data-edit-exp="${idx}">✏️ Edit</button>
            <button type="button" class="btn-delete" data-del-exp="${idx}">🗑️ Hapus</button>
          </div>
        </li>
      `).join("")
      : "<li>Belum ada data experience.</li>";

    $$("[data-edit-edu]", eduList).forEach((b) => b.addEventListener("click", () => startEditTimeline("education", Number(b.dataset.editEdu))));
    $$("[data-del-edu]", eduList).forEach((b) => b.addEventListener("click", () => deleteTimelineItem("education", Number(b.dataset.delEdu))));

    $$("[data-edit-exp]", expList).forEach((b) => b.addEventListener("click", () => startEditTimeline("experience", Number(b.dataset.editExp))));
    $$("[data-del-exp]", expList).forEach((b) => b.addEventListener("click", () => deleteTimelineItem("experience", Number(b.dataset.delExp))));
  }

  function startEditTimeline(type, idx) {
    const list = SITE[type];
    if (!list || !list[idx]) return;
    const it = list[idx];

    $("#timeline-edit-index").value = `${type}:${idx}`;
    $("#timeline-type").value       = type;
    $("#timeline-logo").value       = it.logo || "";
    $("#timeline-org").value        = it.org || "";
    $("#timeline-role").value       = it.role || "";
    $("#timeline-date").value       = it.date || "";
    $("#timeline-meta").value       = it.meta || "";
    $("#timeline-tag").value        = it.tag || "";

    $("#timeline-form-title").textContent  = `✏️ Edit ${type === "education" ? "Education" : "Experience"}: ${it.org}`;
    $("#timeline-submit-btn").textContent  = "Simpan Perubahan";
    $("#timeline-cancel-btn").style.display = "inline-block";

    const form = $("#admin-timeline-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEditTimeline() {
    const form = $("#admin-timeline-form");
    if (form) form.reset();
    $("#timeline-edit-index").value = "-1";
    $("#timeline-form-title").textContent  = "+ Tambah Riwayat Baru";
    $("#timeline-submit-btn").textContent  = "Simpan Riwayat";
    $("#timeline-cancel-btn").style.display = "none";
    $("#timeline-save-status").textContent  = "";
  }

  async function deleteTimelineItem(type, idx) {
    const list = SITE[type];
    if (!list || !list[idx]) return;
    const it = list[idx];
    if (!confirm(`Hapus riwayat "${it.org} (${it.role})"?`)) return;

    list.splice(idx, 1);
    cancelEditTimeline();
    renderTimeline("#education", SITE.education);
    renderTimeline("#experience", SITE.experience);
    watchTimelines();
    refreshTimelineLists();
    await saveCloudSettings();
    toast(`✅ Riwayat ${it.org} berhasil dihapus.`);
  }

  async function saveCloudSettings() {
    const settingsData = {
      profile: {
        name: SITE.name,
        firstName: SITE.firstName,
        lastName: SITE.lastName,
        bio: SITE.bio,
        cvUrl: SITE.cvUrl,
        avatar: SITE.avatar
      },
      education: SITE.education,
      experience: SITE.experience
    };
    try {
      localStorage.setItem("portfolio-cloud-settings", JSON.stringify(settingsData));
    } catch {}

    // Simpan ke Supabase Storage (public json agar sync untuk semua pengunjung)
    if (adminToken) {
      try {
        const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: "application/json" });
        await fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/portfolio-settings.json`, {
          method: "POST",
          headers: {
            ...apiHeaders,
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
            "x-upsert": "true"
          },
          body: blob
        });
      } catch (err) {
        console.warn("Gagal upload settings ke cloud storage:", err);
      }
    }
  }

  function initAdmin() {
    const dialog = $("#admin-modal");
    const setLoginStatus = (msg) => { const el = $("#admin-status");      if (el) el.textContent = msg; };
    const setSaveStatus  = (msg) => { const el = $("#admin-save-status"); if (el) el.textContent = msg; };

    const trigger = $("#admin-trigger");
    if (trigger) trigger.addEventListener("click", () => { dialog.showModal(); });
    $("#admin-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => e.target === dialog && dialog.close());

    // Tab navigasi admin
    const btnWorks    = $("#tab-btn-works");
    const btnTimeline = $("#tab-btn-timeline");
    const btnProfile  = $("#tab-btn-profile");
    if (btnWorks)    btnWorks.addEventListener("click", () => switchAdminTab("works"));
    if (btnTimeline) btnTimeline.addEventListener("click", () => switchAdminTab("timeline"));
    if (btnProfile)  btnProfile.addEventListener("click", () => switchAdminTab("profile"));

    // Tombol Batal Edit Karya
    const cancelEditBtn = $("#work-cancel-edit-btn");
    if (cancelEditBtn) cancelEditBtn.addEventListener("click", cancelEditWork);

    // Tombol Tambah Education / Experience
    const btnAddEdu = $("#btn-add-edu");
    if (btnAddEdu) btnAddEdu.addEventListener("click", () => {
      cancelEditTimeline();
      $("#timeline-type").value = "education";
      $("#admin-timeline-form").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const btnAddExp = $("#btn-add-exp");
    if (btnAddExp) btnAddExp.addEventListener("click", () => {
      cancelEditTimeline();
      $("#timeline-type").value = "experience";
      $("#admin-timeline-form").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Tombol Batal Edit Timeline
    const cancelTimelineBtn = $("#timeline-cancel-btn");
    if (cancelTimelineBtn) cancelTimelineBtn.addEventListener("click", cancelEditTimeline);

    // Form Submit Timeline (Education & Experience)
    const timelineForm = $("#admin-timeline-form");
    if (timelineForm) {
      timelineForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const editVal  = $("#timeline-edit-index").value;
        const type     = $("#timeline-type").value;
        const logo     = $("#timeline-logo").value.trim();
        const org      = $("#timeline-org").value.trim();
        const role     = $("#timeline-role").value.trim();
        const date     = $("#timeline-date").value.trim();
        const meta     = $("#timeline-meta").value.trim();
        const tag      = $("#timeline-tag").value.trim();
        const statusEl = $("#timeline-save-status");
        const submitBtn = $("#timeline-submit-btn");

        if (!org || !role || !date) {
          if (statusEl) statusEl.textContent = "Organisasi, peran/jurusan, dan tahun/periode wajib diisi.";
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan...";
        if (statusEl) statusEl.textContent = "Menyimpan riwayat...";

        const newItem = { logo: logo || "•", org, role, date, meta, tag: tag || "General" };

        if (editVal && editVal.includes(":")) {
          const [oldType, oldIdx] = editVal.split(":");
          const idx = Number(oldIdx);
          if (oldType === type) {
            SITE[type][idx] = newItem;
          } else {
            SITE[oldType].splice(idx, 1);
            if (!SITE[type]) SITE[type] = [];
            SITE[type].push(newItem);
          }
        } else {
          if (!SITE[type]) SITE[type] = [];
          SITE[type].push(newItem);
        }

        renderTimeline("#education", SITE.education);
        renderTimeline("#experience", SITE.experience);
        watchTimelines();
        refreshTimelineLists();
        cancelEditTimeline();

        await saveCloudSettings();

        submitBtn.disabled = false;
        submitBtn.textContent = "Simpan Riwayat";
        toast("✅ Riwayat berhasil disimpan!");
      });
    }

    const showDashboard = (user) => {
      currentUser = user;
      const nameEl = $("#admin-username-display");
      if (nameEl) nameEl.textContent = user.email;
      $("#admin-login").hidden     = true;
      $("#admin-dashboard").hidden = false;
      setSaveStatus("");
      switchAdminTab("works");
      refreshAdminList();
    };

    if (adminToken) {
      fetch(`${SUPABASE.url}/auth/v1/user`, {
        headers: { ...apiHeaders, Authorization: `Bearer ${adminToken}` },
        signal: AbortSignal.timeout(8000)
      })
        .then((r) => { if (!r.ok) throw new Error("expired"); return r.json(); })
        .then((user) => showDashboard(user))
        .catch(() => { adminToken = ""; sessionStorage.removeItem("portfolio-admin-token"); });
    }

    if (window.location.protocol === "file:") {
      setLoginStatus("Buka via Live Server (http://localhost), bukan file:///.");
    }

    // LOGIN
    $("#admin-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (window.location.protocol === "file:") return setLoginStatus("Jalankan via Live Server, bukan file:///.");
      const email    = $("#admin-email").value.trim();
      const password = $("#admin-password").value;
      if (!email || !password) return setLoginStatus("Email dan password tidak boleh kosong.");
      setLoginStatus("Memeriksa akun...");
      try {
        const res  = await fetch(`${SUPABASE.url}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: { ...apiHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal: AbortSignal.timeout(12000)
        });
        const data = await res.json();
        if (!res.ok || !data.access_token) {
          const detail = data.error_description || data.msg || data.error || "cek email/password";
          setLoginStatus(`Login gagal: ${detail}`);
          return toast(`Login gagal: ${detail}`);
        }
        adminToken = data.access_token;
        sessionStorage.setItem("portfolio-admin-token", adminToken);
        setLoginStatus("");
        showDashboard(data.user);
        toast("Berhasil masuk.");
      } catch (err) {
        console.error("[Login]", err);
        setLoginStatus(`Koneksi gagal: ${err.message}`);
        toast("Koneksi Supabase gagal.");
      }
    });

    // LOGOUT
    const logoutBtn = $("#admin-logout");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
      adminToken = ""; currentUser = null;
      sessionStorage.removeItem("portfolio-admin-token");
      $("#admin-dashboard").hidden = true;
      $("#admin-login").hidden     = false;
      setLoginStatus("Berhasil keluar.");
    });

    // SIMPAN / UPDATE KARYA
    $("#admin-work-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form     = e.currentTarget;
      const data     = new FormData(form);
      const editId   = $("#edit-work-id").value;
      const title    = String(data.get("title")    || "").trim();
      const desc     = String(data.get("desc")     || "").trim();
      const category = String(data.get("category") || "").trim();
      const file     = data.get("image");

      if (!title)                      return setSaveStatus("Judul karya tidak boleh kosong.");
      if (!desc)                       return setSaveStatus("Deskripsi tidak boleh kosong.");
      if (!category)                   return setSaveStatus("Pilih kategori karya.");
      if (!editId && (!(file instanceof File) || !file.size)) return setSaveStatus("Pilih gambar karya dulu.");
      if (file && file.size > 50 * 1024 * 1024) return setSaveStatus("Ukuran gambar maksimal 50MB.");
      if (!adminToken || !currentUser) return setSaveStatus("Sesi habis. Tutup dan login ulang.");

      const submitBtn = $("#work-submit-btn");
      submitBtn.disabled = true;
      submitBtn.textContent = editId ? "Memperbarui..." : "Menyimpan...";

      const authHdr = { ...apiHeaders, Authorization: `Bearer ${adminToken}` };

      try {
        if (editId) {
          // ==================== MODE EDIT KARYA ====================
          const existingItem = cloudItems.find((x) => x.id === editId);
          let imgPath = existingItem ? existingItem.image_path : "";

          // Jika ada file gambar baru dipilih saat edit
          if (file instanceof File && file.size > 0) {
            setSaveStatus("Mengunggah gambar baru...");
            const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
            const newPath  = `${Date.now()}-${safeName}`;
            const upRes = await fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${encodeURIComponent(newPath)}`, {
              method: "POST", headers: { ...authHdr, "Content-Type": file.type, "x-upsert": "false" }, body: file, signal: AbortSignal.timeout(30000)
            });
            if (!upRes.ok) throw new Error(`Upload gambar baru gagal: ${await responseError(upRes, "izin storage ditolak")}`);
            
            // Hapus gambar lama jika ada
            if (imgPath) fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${encodeURIComponent(imgPath)}`, { method: "DELETE", headers: authHdr }).catch(() => {});
            imgPath = newPath;
          }

          setSaveStatus("Menyimpan perubahan karya...");
          const updateRecord = {
            title,
            description: desc,
            category,
            image_path: imgPath,
            tags: String(data.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
            demo_url: String(data.get("demo") || "").trim() || null
          };

          const patchRes = await fetch(`${SUPABASE.url}/rest/v1/portfolio_items?id=eq.${encodeURIComponent(editId)}`, {
            method: "PATCH",
            headers: { ...authHdr, "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify(updateRecord),
            signal: AbortSignal.timeout(12000)
          });
          if (!patchRes.ok) throw new Error(`Gagal update karya: ${await responseError(patchRes, "izin tabel ditolak")}`);

          const updatedRows = await patchRes.json();
          const updatedItem = updatedRows[0] || { ...existingItem, ...updateRecord };
          const idx = cloudItems.findIndex((x) => x.id === editId);
          if (idx !== -1) cloudItems[idx] = updatedItem;

          cancelEditWork();
          refreshAdminList();
          refreshPublicPortfolio();
          toast("✅ Karya berhasil diperbarui!");
        } else {
          // ==================== MODE UPLOAD KARYA BARU ====================
          setSaveStatus("Mengunggah gambar...");
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
          const imgPath  = `${Date.now()}-${safeName}`;

          const upRes = await fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${encodeURIComponent(imgPath)}`, {
            method: "POST", headers: { ...authHdr, "Content-Type": file.type, "x-upsert": "false" }, body: file, signal: AbortSignal.timeout(30000)
          });
          if (!upRes.ok) throw new Error(`Upload gambar gagal: ${await responseError(upRes, "izin storage ditolak")}`);

          setSaveStatus("Menyimpan data...");
          const record = {
            title, description: desc, category, image_path: imgPath,
            tags: String(data.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
            demo_url: String(data.get("demo") || "").trim() || null,
            position: 0
          };

          const dbRes = await fetch(`${SUPABASE.url}/rest/v1/portfolio_items`, {
            method: "POST",
            headers: { ...authHdr, "Content-Type": "application/json", Prefer: "return=representation" },
            body: JSON.stringify(record),
            signal: AbortSignal.timeout(12000)
          });
          if (!dbRes.ok) {
            fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${encodeURIComponent(imgPath)}`, { method: "DELETE", headers: authHdr }).catch(() => {});
            throw new Error(`Simpan data gagal: ${await responseError(dbRes, "izin tabel ditolak")}`);
          }
          const rows = await dbRes.json();
          cloudItems.unshift(rows[0]);
          cancelEditWork();
          refreshAdminList();
          refreshPublicPortfolio();
          toast("✅ Karya berhasil disimpan!");
        }
      } catch (err) {
        console.error("[Karya Save/Edit]", err);
        setSaveStatus(`❌ ${err.message}`);
        toast(`Gagal: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = $("#edit-work-id").value ? "Simpan Perubahan" : "Simpan karya";
      }
    });

    // PENGATURAN TAMPILAN PORTOFOLIO (NAMA, BIO, CV, FOTO/KARAKTER INTRO)
    const profileForm = $("#admin-profile-form");
    if (profileForm) {
      profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameInput   = $("#profile-name");
        const bioInput    = $("#profile-bio");
        const cvInput     = $("#profile-cv");
        const avatarInput = $("#profile-avatar-file");
        const statusEl    = $("#profile-save-status");
        const submitBtn   = $("#profile-submit-btn");

        const name       = nameInput ? nameInput.value.trim() : "";
        const bio        = bioInput  ? bioInput.value.trim()  : "";
        const cvUrl      = cvInput   ? cvInput.value.trim()   : "";
        const avatarFile = avatarInput && avatarInput.files ? avatarInput.files[0] : null;

        if (!name) return statusEl.textContent = "Nama tidak boleh kosong.";
        if (!bio)  return statusEl.textContent = "Bio tidak boleh kosong.";

        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan tampilan...";
        statusEl.textContent = "Menyimpan perubahan...";

        try {
          let newAvatarUrl = SITE.avatar;

          // Jika ada upload gambar ilustrasi / karakter baru
          if (avatarFile instanceof File && avatarFile.size > 0) {
            if (avatarFile.size > 50 * 1024 * 1024) throw new Error("Ukuran foto maksimal 50MB.");
            statusEl.textContent = "Mengunggah karakter ilustrasi baru...";
            const safeName   = avatarFile.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
            const avatarPath = `avatar-${Date.now()}-${safeName}`;
            const authHdr    = { ...apiHeaders, Authorization: `Bearer ${adminToken}` };

            const upRes = await fetch(`${SUPABASE.url}/storage/v1/object/portfolio-assets/${encodeURIComponent(avatarPath)}`, {
              method: "POST",
              headers: { ...authHdr, "Content-Type": avatarFile.type, "x-upsert": "true" },
              body: avatarFile,
              signal: AbortSignal.timeout(30000)
            });
            if (!upRes.ok) throw new Error(`Upload foto karakter gagal: ${await responseError(upRes, "izin storage ditolak")}`);
            newAvatarUrl = publicImageUrl(avatarPath);
          }

          // Perbarui objek data runtime
          SITE.name      = name;
          const parts    = name.split(" ");
          SITE.firstName = parts[0];
          SITE.lastName  = parts.slice(1).join(" ") || parts[0];
          SITE.bio       = bio;
          SITE.cvUrl     = cvUrl || "#";
          SITE.avatar    = newAvatarUrl;

          // Render ulang tampilan halaman depan seketika
          fillStatic();

          // Simpan ke cloud settings (localStorage & Supabase Storage)
          await saveCloudSettings();

          statusEl.textContent = "✅ Tampilan portofolio berhasil disimpan!";
          toast("✅ Tampilan portofolio berhasil diperbarui!");
        } catch (err) {
          console.error("[Profile Update]", err);
          statusEl.textContent = `❌ ${err.message}`;
          toast(`Gagal: ${err.message}`);
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = "Simpan Tampilan Portofolio";
        }
      });
    }
  }

  /* ==========================================================
     START
     ========================================================== */
  async function start() {
    // 1. Muat settings dari localStorage jika ada
    const cachedSettings = localStorage.getItem("portfolio-cloud-settings") || localStorage.getItem("portfolio-custom-profile");
    if (cachedSettings) {
      try {
        const cs = JSON.parse(cachedSettings);
        if (cs.education && Array.isArray(cs.education))   SITE.education  = cs.education;
        if (cs.experience && Array.isArray(cs.experience)) SITE.experience = cs.experience;
        const p = cs.profile || cs;
        if (p.name)      SITE.name      = p.name;
        if (p.firstName) SITE.firstName = p.firstName;
        if (p.lastName)  SITE.lastName  = p.lastName;
        if (p.bio)       SITE.bio       = p.bio;
        if (p.cvUrl)     SITE.cvUrl     = p.cvUrl;
        if (p.avatar)    SITE.avatar    = p.avatar;
      } catch {}
    }

    // 2. Muat settings terbaru dari Supabase Storage jika ada
    try {
      const setRes = await fetch(`${SUPABASE.url}/storage/v1/object/public/portfolio-assets/portfolio-settings.json?t=${Date.now()}`);
      if (setRes.ok) {
        const cs = await setRes.json();
        if (cs.education && Array.isArray(cs.education))   SITE.education  = cs.education;
        if (cs.experience && Array.isArray(cs.experience)) SITE.experience = cs.experience;
        if (cs.profile) {
          const p = cs.profile;
          if (p.name)      SITE.name      = p.name;
          if (p.firstName) SITE.firstName = p.firstName;
          if (p.lastName)  SITE.lastName  = p.lastName;
          if (p.bio)       SITE.bio       = p.bio;
          if (p.cvUrl)     SITE.cvUrl     = p.cvUrl;
          if (p.avatar)    SITE.avatar    = p.avatar;
        }
        localStorage.setItem("portfolio-cloud-settings", JSON.stringify(cs));
      }
    } catch {}

    initAdmin();
    await loadCloudItems();
    fillStatic();
    renderTimeline("#education", SITE.education);
    renderTimeline("#experience", SITE.experience);
    renderFolders(); buildCarousels(); renderAwards(); initTabs(); initContactForm(); initComments(); watchTimelines(); initScrollSpy(); initMascot(); initReveal();
    switchTab("projects"); placeIndicator();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicator);
    window.addEventListener("load", () => { placeIndicator(); Object.values(carousels).forEach((c) => c.update()); });
  }
  start();
})();
