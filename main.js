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

function setupSmoothScroll() {
  document.documentElement.style.scrollBehavior = "smooth";
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ block: "start" });
      history.pushState(null, "", href);
    });
  });
}

function setupYear() {
  const el = document.querySelector("[data-year]");
  if (!el) return;
  el.textContent = String(new Date().getFullYear());
}

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
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }
    },
    { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
  );

  for (const el of targets) io.observe(el);
}

function setupSpotlight() {
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;

  if (prefersReduced || !isFinePointer) return;

  let raf = 0;
  let lastX = 0;
  let lastY = 0;

  function commit() {
    raf = 0;
    const x = `${Math.round(lastX)}px`;
    const y = `${Math.round(lastY)}px`;
    document.documentElement.style.setProperty("--mx", x);
    document.documentElement.style.setProperty("--my", y);
  }

  window.addEventListener(
    "pointermove",
    (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (raf) return;
      raf = requestAnimationFrame(commit);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      document.documentElement.style.removeProperty("--mx");
      document.documentElement.style.removeProperty("--my");
    },
    { passive: true }
  );
}

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

      const max = 15; // degrees
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

setupThemeToggle();
setupSmoothScroll();
setupYear();
setupReveal();
setupSpotlight();
setupTilt();
