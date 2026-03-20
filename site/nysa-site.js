(function () {
  const DATA = window.NYSA_DATA;
  if (!DATA) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const app =
    document.getElementById("nysa-app") ||
    (() => {
      const el = document.createElement("div");
      el.id = "nysa-app";
      document.body.appendChild(el);
      return el;
    })();

  document.body.classList.add("nysa-bg-grid");

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(dateString));
  }

  function navLink(href, label) {
    const active =
      href === "/"
        ? path === "/"
        : path === href || path.startsWith(href + "/");
    return '<a href="' + href + '"' + (active ? ' class="is-active"' : "") + ">" + label + "</a>";
  }

  function renderHeader() {
    return (
      '<header class="nysa-header" data-header>' +
      '<div class="nysa-container nysa-header__inner">' +
      '<a class="nysa-logo" href="/">' +
      '<span class="nysa-logo__mark" aria-hidden="true"></span>' +
      "<span>Nysa Olakkengil</span>" +
      "</a>" +
      '<nav class="nysa-nav" aria-label="Primary">' +
      navLink("/", "Home") +
      navLink("/work", "Work") +
      navLink("/about", "About") +
      navLink("/contact", "Contact") +
      "</nav>" +
      "</div>" +
      "</header>"
    );
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return (
      '<footer class="nysa-footer">' +
      '<div class="nysa-container nysa-footer__inner">' +
      '<div class="nysa-footer__brand">' +
      '<h2 class="nysa-footer__title">Built for evidence-driven impact.</h2>' +
      '<p class="nysa-copy">Neuroscience, health equity, and consulting-style execution brought together in one portfolio.</p>' +
      "</div>" +
      '<div class="nysa-footer__links">' +
      '<a href="' +
      DATA.profile.linkedIn +
      '" target="_blank" rel="noreferrer">LinkedIn</a>' +
      '<a href="mailto:' +
      DATA.profile.email +
      '">Email</a>' +
      '<a href="' +
      DATA.profile.resumeUrl +
      '" target="_blank" rel="noreferrer">Resume</a>' +
      "</div>" +
      "</div>" +
      '<div class="nysa-container" style="margin-top:18px;color:var(--nysa-text-muted);font-size:0.9rem;">' +
      "&copy; " +
      year +
      " Nysa Olakkengil" +
      "</div>" +
      "</footer>"
    );
  }

  function projectCard(project) {
    return (
      '<a class="nysa-card nysa-project-card" href="/projects/' +
      project.slug +
      '" data-category="' +
      escapeHtml(project.category) +
      '" data-reveal>' +
      '<div class="nysa-project-card__media">' +
      '<img src="' +
      project.heroImage +
      '" alt="' +
      escapeHtml(project.heroAlt) +
      '">' +
      "</div>" +
      '<div class="nysa-project-card__body">' +
      '<div class="nysa-project-card__meta">' +
      '<span class="nysa-tag nysa-tag--accent">' +
      escapeHtml(project.category) +
      "</span>" +
      "<span>" +
      escapeHtml(formatDate(project.date)) +
      "</span>" +
      "</div>" +
      '<h3 class="nysa-project-card__title">' +
      escapeHtml(project.name) +
      "</h3>" +
      '<p class="nysa-project-card__summary">' +
      escapeHtml(project.summary) +
      "</p>" +
      "</div>" +
      "</a>"
    );
  }

  function skillCard(skill, index) {
    return (
      '<article class="nysa-card nysa-skill-card" data-reveal>' +
      '<span class="nysa-skill-card__index">Skill ' +
      String(index + 1).padStart(2, "0") +
      "</span>" +
      '<h3 class="nysa-skill-card__title">' +
      escapeHtml(skill.name) +
      "</h3>" +
      '<div class="nysa-tag">' +
      escapeHtml(skill.category) +
      "</div>" +
      '<p class="nysa-skill-card__copy">' +
      escapeHtml(skill.description) +
      "</p>" +
      "</article>"
    );
  }

  function buildHome() {
    const featured = DATA.projects
      .filter((project) => project.featured)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const skills = DATA.skills
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const calendlyPanel = DATA.profile.calendlyUrl.indexOf("YOUR_LINK") !== -1
      ? '<div class="nysa-card nysa-contact-panel" data-reveal>' +
        '<div class="nysa-kicker">Calendly Placeholder</div>' +
        '<h3 class="nysa-project-card__title">Add your live scheduling link.</h3>' +
        '<p class="nysa-copy">Replace <code>https://calendly.com/YOUR_LINK</code> in the shared data bundle to activate embedded scheduling here.</p>' +
        "</div>"
      : '<div class="nysa-card nysa-contact-panel nysa-embed" data-reveal>' +
        '<iframe title="Calendly scheduling" src="' +
        DATA.profile.calendlyUrl +
        '"></iframe>' +
        "</div>";

    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-home-hero">' +
      '<img class="nysa-hero-poster" src="' +
      DATA.assets.heroPoster +
      '" alt="" aria-hidden="true">' +
      '<video class="nysa-hero-video" autoplay muted loop playsinline preload="none" poster="' +
      DATA.assets.heroPoster +
      '" data-video-lazy>' +
      '<source data-src="' +
      DATA.assets.heroWebm +
      '" type="video/webm">' +
      '<source data-src="' +
      DATA.assets.heroMp4 +
      '" type="video/mp4">' +
      "</video>" +
      '<div class="nysa-hero-overlay"></div>' +
      '<div class="nysa-hero-mesh"></div>' +
      '<div class="nysa-container nysa-hero-content">' +
      '<div class="nysa-kicker" data-reveal>Neuroscience × Strategy × Healthcare</div>' +
      '<h1 class="nysa-title" data-reveal><span class="nysa-gradient">' +
      escapeHtml(DATA.profile.title) +
      "</span></h1>" +
      '<p class="nysa-subtitle nysa-copy--tight" data-reveal>' +
      escapeHtml(DATA.profile.subtitle) +
      "</p>" +
      '<div class="nysa-actions" data-reveal>' +
      '<a class="nysa-btn nysa-btn--primary" href="/work">View My Work</a>' +
      '<a class="nysa-btn nysa-btn--secondary" href="/contact">Get in Touch</a>' +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container nysa-about">' +
      '<div class="nysa-card nysa-contact-panel" data-reveal>' +
      '<div class="nysa-kicker">About / Journey</div>' +
      '<h2 class="nysa-section-title">From the lab bench to healthcare strategy.</h2>' +
      '<p class="nysa-copy">' +
      escapeHtml(DATA.aboutPreview) +
      "</p>" +
      '<a class="nysa-btn nysa-btn--secondary" href="/about">Read My Story</a>' +
      "</div>" +
      '<div class="nysa-about__visual" data-reveal>' +
      '<img src="' +
      DATA.assets.aboutVisual +
      '" alt="Abstract visualization representing Nysa Olakkengil\'s interdisciplinary work">' +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section nysa-section--spacious">' +
      '<div class="nysa-container">' +
      '<div class="nysa-section-head">' +
      '<div><div class="nysa-kicker">Featured Work</div><h2 class="nysa-section-title">Selected projects with measurable outcomes.</h2></div>' +
      '<a class="nysa-btn nysa-btn--secondary" href="/work">See All Projects</a>' +
      "</div>" +
      '<div class="nysa-grid nysa-grid--projects">' +
      featured.map(projectCard).join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container">' +
      '<div class="nysa-section-head">' +
      '<div><div class="nysa-kicker">Core Competencies</div><h2 class="nysa-section-title">Consulting-framed strengths, not just tools.</h2></div>' +
      "</div>" +
      '<div class="nysa-grid nysa-grid--skills">' +
      skills.map(skillCard).join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container nysa-contact">' +
      '<div class="nysa-card nysa-contact-panel" data-reveal>' +
      '<div class="nysa-kicker">Contact / Calendly</div>' +
      '<h2 class="nysa-section-title">Let\'s talk about healthcare, research, and strategy.</h2>' +
      '<p class="nysa-contact-copy">Whether the conversation is consulting, health equity research, or operational problem solving, this portfolio is built to open the right one.</p>' +
      '<div class="nysa-contact-links">' +
      '<a class="nysa-btn nysa-btn--primary" href="/contact">Open Contact Page</a>' +
      '<a class="nysa-btn nysa-btn--secondary" href="' +
      DATA.profile.linkedIn +
      '" target="_blank" rel="noreferrer">LinkedIn</a>' +
      "</div>" +
      "</div>" +
      calendlyPanel +
      "</div>" +
      "</section>" +
      "</main>" +
      renderFooter()
    );
  }

  function buildWork() {
    const filters = [
      { label: "All", value: "All" },
      { label: "Research", value: "Research" },
      { label: "Internship", value: "Internship" },
      { label: "Case Study", value: "Case Study" },
      { label: "Coursework / Academic", value: "Academic" },
      { label: "Extracurricular", value: "Extracurricular" },
    ];
    const projects = DATA.projects
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-page-hero">' +
      '<div class="nysa-container">' +
      '<div class="nysa-kicker" data-reveal>Selected Work</div>' +
      '<h1 class="nysa-title nysa-title--page" data-reveal>Research, operations, and strategy through a consulting lens.</h1>' +
      '<p class="nysa-subtitle nysa-copy--tight" data-reveal>Every project here starts with evidence, moves through structure, and ends with a measurable outcome.</p>' +
      '<div class="nysa-filter" data-filter-bar data-reveal>' +
      filters
        .map(function (filter, index) {
          return (
            '<button type="button" data-filter="' +
            filter.value +
            '"' +
            (index === 0 ? ' class="is-active"' : "") +
            ">" +
            filter.label +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container">' +
      '<div class="nysa-grid nysa-grid--projects" data-work-grid>' +
      projects.map(projectCard).join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      "</main>" +
      renderFooter()
    );
  }

  function buildAbout() {
    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-page-hero">' +
      '<div class="nysa-container--narrow">' +
      '<div class="nysa-kicker" data-reveal>About / Journey</div>' +
      '<h1 class="nysa-title nysa-title--page" data-reveal>Scientific rigor, structured thinking, and healthcare impact.</h1>' +
      '<p class="nysa-subtitle" data-reveal>Why neuroscience became the starting point, not the endpoint.</p>' +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container--narrow">' +
      DATA.aboutNarrative
        .map(function (paragraph) {
          return '<p class="nysa-copy" data-reveal>' + escapeHtml(paragraph) + "</p>";
        })
        .join("") +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container">' +
      '<div class="nysa-section-head"><div><div class="nysa-kicker">Timeline</div><h2 class="nysa-section-title">How the work evolved.</h2></div></div>' +
      '<div class="nysa-timeline">' +
      DATA.timeline
        .map(function (item) {
          return (
            '<article class="nysa-timeline__item" data-reveal>' +
            '<div class="nysa-timeline__date">' +
            escapeHtml(item.date) +
            "</div>" +
            '<h3 class="nysa-timeline__title">' +
            escapeHtml(item.title) +
            "</h3>" +
            '<p class="nysa-timeline__copy">' +
            escapeHtml(item.description) +
            "</p>" +
            "</article>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container">' +
      '<div class="nysa-grid nysa-grid--info">' +
      DATA.aboutCards
        .map(function (card) {
          return (
            '<article class="nysa-card nysa-info-card" data-reveal>' +
            '<div class="nysa-kicker">' +
            escapeHtml(card.label) +
            "</div>" +
            '<h3 class="nysa-info-card__title">' +
            escapeHtml(card.value) +
            "</h3>" +
            "</article>"
          );
        })
        .join("") +
      "</div>" +
      "</div>" +
      "</section>" +
      "</main>" +
      renderFooter()
    );
  }

  function buildContact() {
    const calendlyPanel = DATA.profile.calendlyUrl.indexOf("YOUR_LINK") !== -1
      ? '<div class="nysa-card nysa-contact-panel" data-reveal>' +
        '<div class="nysa-kicker">Calendly Placeholder</div>' +
        '<h3 class="nysa-project-card__title">Scheduling will appear here.</h3>' +
        '<p class="nysa-copy">Swap in the live Calendly URL to enable embedded booking on the contact page.</p>' +
        "</div>"
      : '<div class="nysa-card nysa-contact-panel nysa-embed" data-reveal>' +
        '<iframe title="Calendly scheduling" src="' +
        DATA.profile.calendlyUrl +
        '"></iframe>' +
        "</div>";

    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-page-hero">' +
      '<div class="nysa-container--narrow">' +
      '<div class="nysa-kicker" data-reveal>Contact</div>' +
      '<h1 class="nysa-title nysa-title--page" data-reveal>Open a conversation.</h1>' +
      '<p class="nysa-subtitle" data-reveal>Reach out for healthcare consulting conversations, research collaboration, or portfolio questions.</p>' +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container nysa-contact">' +
      '<div class="nysa-card nysa-contact-panel" data-reveal>' +
      '<h2 class="nysa-section-title">Send a note</h2>' +
      '<p class="nysa-contact-copy">This form opens a pre-filled email draft so inquiries can be sent immediately while production form handling is finalized.</p>' +
      '<form class="nysa-contact-form" id="nysa-contact-form">' +
      '<div class="nysa-field"><label for="nysa-name">Name</label><input id="nysa-name" name="name" type="text" required></div>' +
      '<div class="nysa-field"><label for="nysa-email">Email</label><input id="nysa-email" name="email" type="email" required></div>' +
      '<div class="nysa-field"><label for="nysa-message">Message</label><textarea id="nysa-message" name="message" required></textarea></div>' +
      '<button class="nysa-btn nysa-btn--primary" type="submit">Open Email Draft</button>' +
      "</form>" +
      '<div class="nysa-contact-links">' +
      '<a class="nysa-btn nysa-btn--secondary" href="' +
      DATA.profile.linkedIn +
      '" target="_blank" rel="noreferrer">LinkedIn</a>' +
      '<a class="nysa-btn nysa-btn--secondary" href="' +
      DATA.profile.resumeUrl +
      '" target="_blank" rel="noreferrer">Resume</a>' +
      "</div>" +
      "</div>" +
      calendlyPanel +
      "</div>" +
      "</section>" +
      "</main>" +
      renderFooter()
    );
  }

  function buildProject(project) {
    if (!project) {
      return (
        renderHeader() +
        '<main class="nysa-shell"><section class="nysa-page-hero"><div class="nysa-container--narrow"><div class="nysa-empty">Project not found.</div></div></section></main>' +
        renderFooter()
      );
    }

    const skills = project.skillsApplied.split(/\s*,\s*/).filter(Boolean);
    const media = project.projectVideo
      ? '<video controls preload="none" poster="' +
        project.heroImage +
        '"><source src="' +
        project.projectVideo +
        '" type="video/mp4"></video>'
      : '<img src="' +
        project.heroImage +
        '" alt="' +
        escapeHtml(project.heroAlt) +
        '">';

    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-page-hero">' +
      '<div class="nysa-container">' +
      '<a class="nysa-btn nysa-btn--secondary" href="/work">Back to Work</a>' +
      '<div class="nysa-detail-hero" style="margin-top:24px;">' +
      '<div class="nysa-detail-meta" data-reveal>' +
      '<span class="nysa-tag nysa-tag--accent">' +
      escapeHtml(project.category) +
      "</span>" +
      "<span>" +
      escapeHtml(project.organization) +
      "</span>" +
      "<span>" +
      escapeHtml(formatDate(project.date)) +
      "</span>" +
      "</div>" +
      '<h1 class="nysa-title nysa-title--page" data-reveal>' +
      escapeHtml(project.name) +
      "</h1>" +
      '<p class="nysa-subtitle" data-reveal>' +
      escapeHtml(project.summary) +
      "</p>" +
      '<div class="nysa-detail-media" data-reveal>' +
      media +
      "</div>" +
      "</div>" +
      "</div>" +
      "</section>" +
      '<section class="nysa-section">' +
      '<div class="nysa-container nysa-detail-sections">' +
      '<article class="nysa-card nysa-detail-section" data-reveal><h2 class="nysa-detail-section__title">The Challenge</h2><div class="nysa-detail-prose">' +
      project.problem +
      "</div></article>" +
      '<article class="nysa-card nysa-detail-section" data-reveal><h2 class="nysa-detail-section__title">The Approach</h2><div class="nysa-detail-prose">' +
      project.approach +
      "</div></article>" +
      '<article class="nysa-card nysa-detail-section" data-reveal><h2 class="nysa-detail-section__title">The Impact</h2><div class="nysa-detail-prose">' +
      project.impact +
      "</div></article>" +
      '<article class="nysa-card nysa-detail-section" data-reveal><h2 class="nysa-detail-section__title">Skills Applied</h2><div class="nysa-pill-list">' +
      skills
        .map(function (skill) {
          return '<span class="nysa-tag">' + escapeHtml(skill) + "</span>";
        })
        .join("") +
      "</div></article>" +
      '<article class="nysa-insight" data-reveal><div class="nysa-kicker">Key Insight</div><p class="nysa-copy">' +
      escapeHtml(project.keyInsight) +
      "</p></article>" +
      "</div>" +
      "</section>" +
      "</main>" +
      renderFooter()
    );
  }

  function mount() {
    let html = "";

    if (path === "/") {
      html = buildHome();
    } else if (path === "/work") {
      html = buildWork();
    } else if (path === "/about") {
      html = buildAbout();
    } else if (path === "/contact") {
      html = buildContact();
    } else if (path.indexOf("/projects/") === 0) {
      const slug = path.split("/projects/")[1];
      const project = DATA.projects.find(function (item) {
        return item.slug === slug;
      });
      html = buildProject(project);
    } else {
      html = buildHome();
    }

    app.innerHTML = html;
  }

  function loadLazyVideo() {
    const video = document.querySelector("[data-video-lazy]");
    if (!video || prefersReducedMotion) return;

    const activate = function () {
      Array.prototype.forEach.call(video.querySelectorAll("source"), function (source) {
        if (source.dataset.src) source.src = source.dataset.src;
      });
      video.load();
      video.addEventListener("canplay", function () {
        video.classList.add("is-ready");
      });
    };

    if (!("IntersectionObserver" in window)) {
      activate();
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        activate();
        observer.disconnect();
      }
    });

    observer.observe(video);
  }

  function setupFilter() {
    const bar = document.querySelector("[data-filter-bar]");
    const cards = Array.prototype.slice.call(
      document.querySelectorAll("[data-work-grid] [data-category]")
    );
    if (!bar || !cards.length) return;

    bar.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;

      Array.prototype.forEach.call(bar.querySelectorAll("button"), function (item) {
        item.classList.toggle("is-active", item === button);
      });

      const filter = button.getAttribute("data-filter");
      cards.forEach(function (card) {
        const visible =
          filter === "All" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !visible);
      });
    });
  }

  function setupHeader() {
    const header = document.querySelector("[data-header]");
    if (!header || prefersReducedMotion) return;

    let lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        const currentY = window.scrollY;
        header.classList.toggle("is-hidden", currentY > lastY && currentY > 120);
        lastY = currentY;
      },
      { passive: true }
    );
  }

  function setupReveal() {
    const items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!items.length || prefersReducedMotion) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      items.forEach(function (item, index) {
        window.gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 86%",
            once: true,
          },
        });
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupLenis() {
    if (!window.Lenis || prefersReducedMotion) return;
    const lenis = new window.Lenis({ smoothWheel: true, lerp: 0.09 });
    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);
  }

  function setupContactForm() {
    const form = document.getElementById("nysa-contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const subject = encodeURIComponent("Portfolio inquiry from " + name);
      const body = encodeURIComponent(
        "Name: " +
          name +
          "\nEmail: " +
          email +
          "\n\nMessage:\n" +
          message
      );
      window.location.href =
        "mailto:" + DATA.profile.email + "?subject=" + subject + "&body=" + body;
    });
  }

  function installSchema() {
    if (path !== "/") return;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: DATA.profile.name,
      jobTitle: "Neuroscience researcher and aspiring healthcare consultant",
      url: DATA.profile.siteUrl,
      sameAs: [DATA.profile.linkedIn],
    });
    document.head.appendChild(script);
  }

  function installClarityPlaceholder() {
    if (!DATA.profile.clarityId || DATA.profile.clarityId === "YOUR_CLARITY_ID") {
      console.info("Microsoft Clarity placeholder is still set.");
      return;
    }
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", DATA.profile.clarityId);
  }

  mount();
  loadLazyVideo();
  setupFilter();
  setupHeader();
  setupReveal();
  setupLenis();
  setupContactForm();
  installSchema();
  installClarityPlaceholder();
})();
