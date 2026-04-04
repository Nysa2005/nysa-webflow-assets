(function () {
  const DATA = window.NYSA_DATA;
  if (!DATA) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const nativePage =
    document.body &&
    document.body.hasAttribute("data-nysa-native-page");

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

  function hasLiveCalendly() {
    return (
      DATA.profile.calendlyUrl &&
      DATA.profile.calendlyUrl.indexOf("YOUR_LINK") === -1
    );
  }

  function hasResume() {
    return DATA.profile.resumeUrl && DATA.profile.resumeUrl !== "#";
  }

  function resumeLink(label, className) {
    if (hasResume()) {
      return (
        '<a class="' +
        className +
        '" href="' +
        DATA.profile.resumeUrl +
        '" target="_blank" rel="noreferrer noopener">' +
        label +
        "</a>"
      );
    }

    const subject = encodeURIComponent("Resume request from portfolio");
    return (
      '<a class="' +
      className +
      '" href="mailto:' +
      DATA.profile.email +
      "?subject=" +
      subject +
      '">' +
      (label === "Resume" ? "Request Resume" : label) +
      "</a>"
    );
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
      '" target="_blank" rel="noreferrer noopener">LinkedIn</a>' +
      '<a href="mailto:' +
      DATA.profile.email +
      '">Email</a>' +
      resumeLink("Resume", "nysa-footer__link") +
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
      '<a class="nysa-card nysa-project-card" href="/projects' +
      "?slug=" +
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

    const calendlyPanel = !hasLiveCalendly()
      ? ""
      : '<div class="nysa-card nysa-contact-panel nysa-embed" data-reveal>' +
        '<iframe title="Calendly scheduling" src="' +
        DATA.profile.calendlyUrl +
        '"></iframe>' +
        "</div>";

    return (
      renderHeader() +
      '<main class="nysa-shell">' +
      '<section class="nysa-home-hero">' +
      '<div class="nysa-3d-hero-container" id="nysa-3d-hero" aria-hidden="true">' +
      "<!-- 3D model embed: Replace this comment with a Spline viewer tag or Three.js canvas -->" +
      "<!-- Example: <spline-viewer url='https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode'></spline-viewer> -->" +
      "</div>" +
      '<img class="nysa-hero-poster nysa-3d-hero-fallback" src="' +
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
      '" target="_blank" rel="noreferrer noopener">LinkedIn</a>' +
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
    const projects = DATA.projects
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    var activeCategories = {};
    projects.forEach(function (p) { activeCategories[p.category] = true; });

    const allFilters = [
      { label: "All", value: "All" },
      { label: "Research", value: "Research" },
      { label: "Internship", value: "Internship" },
      { label: "Case Study", value: "Case Study" },
      { label: "Coursework / Academic", value: "Academic" },
      { label: "Extracurricular", value: "Extracurricular" },
    ];

    const filters = allFilters.filter(function (f) {
      return f.value === "All" || activeCategories[f.value];
    });

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
    var headshotBlock = DATA.assets.headshotUrl
      ? '<div class="nysa-about-headshot" data-reveal>' +
        '<img src="' + DATA.assets.headshotUrl + '" alt="Nysa Olakkengil" class="nysa-headshot-img">' +
        '</div>'
      : "";

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
      headshotBlock +
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
    const calendlyPanel = !hasLiveCalendly()
      ? ""
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
      '<div class="nysa-container' + (hasLiveCalendly() ? " nysa-contact" : "") + '">' +
      '<div class="nysa-card nysa-contact-panel" data-reveal>' +
      '<h2 class="nysa-section-title">Send a note</h2>' +
      '<p class="nysa-contact-copy">Fill out the form below and your message will be delivered directly.</p>' +
      '<form class="nysa-contact-form" id="nysa-contact-form" action="https://formsubmit.co/' + DATA.profile.email + '" method="POST">' +
      '<input type="hidden" name="_subject" value="Portfolio inquiry — Nysa Olakkengil">' +
      '<input type="hidden" name="_captcha" value="false">' +
      '<input type="hidden" name="_template" value="table">' +
      '<input type="hidden" name="_next" value="' + (DATA.profile.siteUrl || window.location.origin) + '/contact?submitted=true">' +
      '<div class="nysa-field"><label for="nysa-name">Name</label><input id="nysa-name" name="name" type="text" required></div>' +
      '<div class="nysa-field"><label for="nysa-email">Email</label><input id="nysa-email" name="email" type="email" required></div>' +
      '<div class="nysa-field"><label for="nysa-message">Message</label><textarea id="nysa-message" name="message" required></textarea></div>' +
      '<button class="nysa-btn nysa-btn--primary" type="submit" id="nysa-submit-btn">Send Message</button>' +
      '<div id="nysa-form-status" class="nysa-form-status" style="display:none;"></div>' +
      "</form>" +
      '<div class="nysa-contact-links">' +
      '<a class="nysa-btn nysa-btn--secondary" href="' +
      DATA.profile.linkedIn +
      '" target="_blank" rel="noreferrer noopener">LinkedIn</a>' +
      resumeLink("Resume", "nysa-btn nysa-btn--secondary") +
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
        '<main class="nysa-shell"><section class="nysa-page-hero"><div class="nysa-container--narrow"><div class="nysa-empty">Project not found. Return to <a href="/work">Selected Work</a> to browse the available case studies.</div></div></section></main>' +
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
    const app =
      document.getElementById("nysa-app") ||
      (() => {
        const el = document.createElement("div");
        el.id = "nysa-app";
        document.body.appendChild(el);
        return el;
      })();
    let html = "";
    const querySlug = new URLSearchParams(window.location.search).get("slug");

    if (path === "/") {
      html = buildHome();
    } else if (path === "/work") {
      html = buildWork();
    } else if (path === "/about") {
      html = buildAbout();
    } else if (path === "/contact") {
      html = buildContact();
    } else if ((path === "/projects" || path === "/project-view") && querySlug) {
      const project = DATA.projects.find(function (item) {
        return item.slug === querySlug;
      });
      if (project) document.title = project.name + " — Nysa Olakkengil";
      html = buildProject(project);
    } else if (path.indexOf("/projects/") === 0) {
      const slug = path.split("/projects/")[1];
      const project = DATA.projects.find(function (item) {
        return item.slug === slug;
      });
      if (project) document.title = project.name + " — Nysa Olakkengil";
      html = buildProject(project);
    } else {
      html = buildHome();
    }

    app.innerHTML = html;
  }

  function loadLazyVideo() {
    const videos = Array.prototype.slice.call(
      document.querySelectorAll("[data-video-lazy]")
    );
    if (!videos.length || prefersReducedMotion) return;

    videos.forEach(function (video) {
      const activate = function () {
        Array.prototype.forEach.call(
          video.querySelectorAll("source"),
          function (source) {
            if (source.dataset.src) source.src = source.dataset.src;
          }
        );
        video.load();
        video.addEventListener(
          "canplay",
          function () {
            video.classList.add("is-ready");
          },
          { once: true }
        );
      };

      if (!("IntersectionObserver" in window)) {
        activate();
        return;
      }

      const observer = new IntersectionObserver(function (entries) {
        if (
          entries.some(function (entry) {
            return entry.isIntersecting;
          })
        ) {
          activate();
          observer.disconnect();
        }
      });

      observer.observe(video);
    });
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
        header.classList.toggle(
          "nysa-header--hidden",
          currentY > lastY && currentY > 120
        );
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
    if (typeof lenis.on === "function" && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }
    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }
    window.requestAnimationFrame(raf);
  }

  function updateMeta() {
    var title = document.title;
    var description = "Nysa Olakkengil — Neuroscience researcher at Michigan State University bridging lab rigor, health equity research, and consulting-style strategy. Turning research into results.";
    var canonical = window.location.origin + window.location.pathname + window.location.search;
    var metaQuerySlug = new URLSearchParams(window.location.search).get("slug");

    if (path === "/work") {
      title = "Selected Work — Nysa Olakkengil";
      description =
        "Explore Nysa Olakkengil's portfolio of research, internship, and strategy projects spanning neuroscience, health equity, and healthcare operations.";
    } else if (path === "/about") {
      title = "About — Nysa Olakkengil";
      description =
        "Learn how Nysa Olakkengil, a neuroscience major at Michigan State University, combines scientific rigor, policy analysis, and operational problem solving for healthcare consulting.";
    } else if (path === "/contact") {
      title = "Contact — Nysa Olakkengil";
      description =
        "Get in touch with Nysa Olakkengil for healthcare consulting conversations, research collaboration, and portfolio inquiries.";
    } else if (path === "/projects" || path === "/project-view" || path.indexOf("/projects/") === 0) {
      var lookupSlug =
        metaQuerySlug || (path.indexOf("/projects/") === 0 ? path.split("/projects/")[1] : "");
      var project = DATA.projects.find(function (item) {
        return item.slug === lookupSlug;
      });
      if (project) {
        title = project.name + " — Nysa Olakkengil";
        description = project.summary;
      }
    }

    document.title = title;

    var metaTags = [
      ['meta[name="description"]', "content", description],
      ['meta[property="og:title"]', "content", title],
      ['meta[property="og:description"]', "content", description],
      ['meta[property="og:type"]', "content", "website"],
      ['meta[property="og:url"]', "content", canonical],
      ['meta[name="twitter:card"]', "content", "summary_large_image"],
      ['meta[name="twitter:title"]', "content", title],
      ['meta[name="twitter:description"]', "content", description],
    ];

    metaTags.forEach(function (item) {
      var node = document.head.querySelector(item[0]);
      if (!node) {
        node = document.createElement("meta");
        var attr = item[0].match(/\[(\w+)="([^"]+)"\]/);
        if (attr) node.setAttribute(attr[1], attr[2]);
        document.head.appendChild(node);
      }
      node.setAttribute(item[1], item[2]);
    });

    var canonicalNode = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalNode) {
      canonicalNode = document.createElement("link");
      canonicalNode.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalNode);
    }
    canonicalNode.setAttribute("href", canonical);
  }

  function setupContactForm() {
    const form = document.getElementById("nysa-contact-form");
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    if (params.get("submitted") === "true") {
      var statusEl = document.getElementById("nysa-form-status");
      if (statusEl) {
        statusEl.style.display = "block";
        statusEl.style.color = "var(--nysa-cyan)";
        statusEl.style.padding = "14px 0";
        statusEl.textContent = "Message sent successfully. Nysa will be in touch soon.";
      }
    }

    form.addEventListener("submit", function (event) {
      var btn = document.getElementById("nysa-submit-btn");
      if (btn) {
        btn.textContent = "Sending...";
        btn.disabled = true;
      }
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

  function setupCardTilt() {
    if (prefersReducedMotion) return;
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(".nysa-project-card")
    );
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var midX = rect.width / 2;
        var midY = rect.height / 2;
        var rotateY = ((x - midX) / midX) * 6;
        var rotateX = ((midY - y) / midY) * 4;
        card.style.transform =
          "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  function setupRevealStagger() {
    if (prefersReducedMotion) return;
    var grids = Array.prototype.slice.call(
      document.querySelectorAll(".nysa-grid")
    );
    grids.forEach(function (grid) {
      var children = Array.prototype.slice.call(
        grid.querySelectorAll("[data-reveal]")
      );
      children.forEach(function (child, index) {
        child.style.transitionDelay = (index * 0.08) + "s";
      });
    });
  }

  function setup3dHero() {
    var container = document.getElementById("nysa-3d-hero");
    if (!container) return;

    if (DATA.assets.splineUrl) {
      var script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js";
      document.head.appendChild(script);

      script.onload = function () {
        container.innerHTML =
          '<spline-viewer url="' + DATA.assets.splineUrl + '" loading-anim-type="none"></spline-viewer>';
        var poster = document.querySelector(".nysa-hero-poster");
        if (poster) poster.style.display = "none";
        var video = document.querySelector(".nysa-hero-video");
        if (video) video.style.display = "none";
      };
    }
  }

  if (!nativePage) {
    mount();
  }
  loadLazyVideo();
  setupFilter();
  setupHeader();
  setupReveal();
  setupRevealStagger();
  setupLenis();
  setupContactForm();
  setupCardTilt();
  setup3dHero();
  updateMeta();
  installSchema();
  installClarityPlaceholder();
})();
