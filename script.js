const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const year = document.querySelector("#year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

year.textContent = new Date().getFullYear();

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  navLinks.classList.remove("is-open");
  body.style.overflow = "";
}

menuToggle.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  navLinks.classList.toggle("is-open", willOpen);
  body.style.overflow = willOpen ? "hidden" : "";
});

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealItems = document.querySelectorAll("[data-reveal]");
if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8%", threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navAnchors = [...navLinks.querySelectorAll("a[href^='#']")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("is-current", anchor.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-25% 0px -65%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

const finePointer = window.matchMedia("(pointer: fine)").matches;
const paw = document.querySelector("#pawCursor");
const halo = document.querySelector("#cursorHalo");

if (finePointer && !reduceMotion.matches) {
  body.classList.add("has-custom-cursor");
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
  let haloX = pointerX;
  let haloY = pointerY;

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    paw.style.transform = `translate(${pointerX - 13}px, ${pointerY - 14}px) rotate(-16deg)`;
    resetIdle();
  }, { passive: true });

  function followPointer() {
    haloX += (pointerX - haloX) * 0.15;
    haloY += (pointerY - haloY) * 0.15;
    halo.style.transform = `translate(${haloX - 22}px, ${haloY - 22}px)`;
    requestAnimationFrame(followPointer);
  }
  followPointer();

  document.querySelectorAll("a, button, .signal-card, .work-card").forEach((target) => {
    target.addEventListener("pointerenter", () => halo.classList.add("is-active"));
    target.addEventListener("pointerleave", () => halo.classList.remove("is-active"));
  });

  document.querySelectorAll(".magnetic").forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      target.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
    });
    target.addEventListener("pointerleave", () => { target.style.transform = ""; });
  });
}

let idleTimer;
function resetIdle() {
  body.classList.remove("is-idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => body.classList.add("is-idle"), 3200);
}
["scroll", "keydown", "touchstart"].forEach((eventName) => {
  window.addEventListener(eventName, resetIdle, { passive: true });
});
resetIdle();

const canvas = document.querySelector("#ambientCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let canvasWidth = 0;
let canvasHeight = 0;
let frameId;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = Math.round(canvasWidth * ratio);
  canvas.height = Math.round(canvasHeight * ratio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(46, Math.max(22, Math.round(canvasWidth / 34)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    radius: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    alpha: Math.random() * 0.3 + 0.08
  }));
}

function drawAmbient() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.x < -5) particle.x = canvasWidth + 5;
    if (particle.x > canvasWidth + 5) particle.x = -5;
    if (particle.y < -5) particle.y = canvasHeight + 5;
    if (particle.y > canvasHeight + 5) particle.y = -5;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(121, 80, 242, ${body.classList.contains("is-idle") ? particle.alpha * 1.8 : particle.alpha})`;
    ctx.fill();
  });
  frameId = requestAnimationFrame(drawAmbient);
}

function startAmbient() {
  cancelAnimationFrame(frameId);
  if (reduceMotion.matches) return;
  drawAmbient();
}

resizeCanvas();
startAmbient();
window.addEventListener("resize", () => { resizeCanvas(); startAmbient(); }, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) cancelAnimationFrame(frameId);
  else startAmbient();
});
