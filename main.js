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

setupThemeToggle();
setupSmoothScroll();
setupYear();
setupReveal();
setupSpotlight();
