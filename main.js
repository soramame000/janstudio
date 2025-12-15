// Theme Management
function setTheme(nextTheme) {
  const theme = nextTheme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function setupThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;
  setTheme(getInitialTheme());
  button.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "light" ? "dark" : "light");
  });
}

// Smooth scroll with easing
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let startTime = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          history.pushState(null, "", href);
        }
      }

      requestAnimationFrame(animation);
    });
  });
}

function setupYear() {
  const el = document.querySelector("[data-year]");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

// Intersection Observer for reveal animations
function setupReveal() {
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document.documentElement.dataset.motion = "reduced";
    return;
  }

  document.documentElement.dataset.motion = "full";

  const targets = Array.from(document.querySelectorAll("[data-reveal]"));
  if (targets.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        // Add staggered delay for child elements
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add("is-revealed");
        }, delay);
        io.unobserve(entry.target);
      }
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );

  for (const el of targets) io.observe(el);
}

// Apple-style smooth card hover with gradient follow
function setupCardHover() {
  const cards = document.querySelectorAll(".card, .hero-point");

  for (const card of cards) {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--cx", `${x}%`);
      card.style.setProperty("--cy", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--cx", "50%");
      card.style.setProperty("--cy", "50%");
    });
  }
}

// 3D Tilt effect for cards
function setupTilt() {
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;

  if (prefersReduced || !isFinePointer) return;

  const elements = Array.from(document.querySelectorAll(".card, .about-card, .kv--table"));
  if (elements.length === 0) return;

  for (const el of elements) {
    el.dataset.tilt = "true";

    let raf = 0;
    let last = null;

    function commit() {
      raf = 0;
      if (!last) return;

      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(last.clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(last.clientY - rect.top, 0), rect.height);

      const px = rect.width ? (x / rect.width) * 100 : 50;
      const py = rect.height ? (y / rect.height) * 100 : 50;

      const nx = px / 100 - 0.5;
      const ny = py / 100 - 0.5;

      const max = 8; // Subtle tilt angle
      const rx = (-ny * max).toFixed(2);
      const ry = (nx * max).toFixed(2);

      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--cx", `${px.toFixed(2)}%`);
      el.style.setProperty("--cy", `${py.toFixed(2)}%`);
    }

    el.addEventListener("pointerenter", () => {
      el.classList.add("is-tilting");
    });

    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.removeProperty("--rx");
      el.style.removeProperty("--ry");
      el.style.removeProperty("--cx");
      el.style.removeProperty("--cy");
      last = null;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    });

    el.addEventListener(
      "pointermove",
      (event) => {
        last = event;
        if (raf) return;
        raf = requestAnimationFrame(commit);
      },
      { passive: true }
    );
  }
}

// Stagger reveal for cards
function setupStaggeredReveal() {
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  const cardContainers = document.querySelectorAll(".cards, .hero-points");

  for (const container of cardContainers) {
    const cards = container.children;
    Array.from(cards).forEach((card, index) => {
      card.style.transitionDelay = `${index * 100}ms`;
    });
  }
}

// Header scroll effect
function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  function updateHeader() {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.08)";
    } else {
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

// Initialize all features
function init() {
  setupThemeToggle();
  setupSmoothScroll();
  setupYear();
  setupReveal();
  setupCardHover();
  setupTilt();
  setupStaggeredReveal();
  setupHeaderScroll();
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
