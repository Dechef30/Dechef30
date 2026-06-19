const root = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const year = document.querySelector("#year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const PRIVATE_BLOB = {
  salt: "O8Njz4vXGJSj67XloKI90w==",
  iv: "3UV7yanb1Oyq7tcc",
  data: "8eMOe2Qp81JfCkYjzB/5GIllh8P+nUaEC35r1J3fKkoWbULz21rQqWSr5zZr+7x55e0+dDG2Y6vQ",
  iterations: 120000
};
const LOCATION_PASSWORD_HASH = "345f3a8d4c8e56eb88d13eac13b30dabeec7c5748765374f00e1f998fe09847c";

const imagePaths = (...numbers) => numbers.map((number) => `./assets/travel/p${String(number).padStart(2, "0")}.jpg`);
const travelPlaces = {
  shanghai: { kicker: "HOME · SHANGHAI", title: "上海", description: "我的家，也是所有航线反复回到的原点。", images: [] },
  nantong: { kicker: "ROOTS · JIANGSU", title: "南通", description: "老家坐标之一，和徐州一起用粉色标记在地图上。", images: [] },
  xuzhou: { kicker: "ROOTS · JIANGSU", title: "徐州", description: "老家坐标之一。这里先留出位置，等待下一批照片。", images: [] },
  yangzhou: { kicker: "CHINA · JIANGSU", title: "扬州", description: "走过的江南城市，照片将在后续旅途档案中补充。", images: [] },
  suzhou: { kicker: "CHINA · JIANGSU", title: "苏州", description: "园林与水巷的城市坐标，照片待补充。", images: [] },
  taishan: { kicker: "CHINA · SHANDONG", title: "泰山", description: "从夜色中的山门走向日出，山顶的一刻值得被单独留下。", images: imagePaths(18, 19, 20) },
  shaanxi: { kicker: "CHINA · SHAANXI", title: "陕西", description: "从骊山兵谏亭到秦始皇雕像，再到城市夜色，是一段历史感很强的旅程。", images: imagePaths(42, 43, 44, 46) },
  huashan: { kicker: "CHINA · SHAANXI", title: "华山", description: "在华山论剑石前留下合影，陡峭山势和蓝天构成了最鲜明的背景。", images: imagePaths(45) },
  sichuan: { kicker: "CHINA · SICHUAN", title: "四川", description: "杜甫草堂、三星堆与九寨沟，从人文到自然的跨度都很大。", images: imagePaths(48, 49, 50, 51, 52, 53, 54, 55) },
  xiamen: { kicker: "CHINA · FUJIAN", title: "厦门", description: "夜晚街区、鼓浪屿与海岛岩石，是这组三张照片里的城市记忆。", images: imagePaths(21, 22, 23) },
  shaoxing: { kicker: "CHINA · ZHEJIANG", title: "绍兴", description: "鲁迅故里的一次停留，也给地图补上了一枚江南坐标。", images: imagePaths(47) },
  hongkong: { kicker: "CHINA · HONG KONG", title: "香港", description: "已经点亮的特别行政区坐标，照片待补充。", images: [] },
  macau: { kicker: "CHINA · MACAU", title: "澳门", description: "已经点亮的特别行政区坐标，照片待补充。", images: [] },
  nara: { kicker: "JAPAN · NARA", title: "奈良", description: "鹿群、古寺与晴朗天空，是日本旅程温柔的开场。", images: imagePaths(1, 2) },
  kyoto: { kicker: "JAPAN · KYOTO", title: "京都", description: "伏见稻荷的千本鸟居与山间参道，橙红色一路延伸。", images: imagePaths(4, 7, 8, 9, 10) },
  osaka: { kicker: "JAPAN · OSAKA", title: "大阪", description: "大阪城、道顿堀与海贼王主题装置，让城市显得热闹又熟悉。", images: imagePaths(3, 5, 6, 11) },
  tokyo: { kicker: "JAPAN · TOKYO", title: "东京", description: "东京塔、城市高空、雨夜街道与银座的一顿烤肉，构成了不同的城市节奏。", images: imagePaths(12, 13, 14, 15, 16, 17) },
  singapore: { kicker: "SINGAPORE · CITY", title: "新加坡", description: "鱼尾狮、滨海湾与金沙酒店，蓝天把城市轮廓衬得很清楚。", images: imagePaths(24, 25, 26) },
  belgium: { kicker: "BELGIUM · BRUSSELS", title: "比利时", description: "布鲁塞尔的历史建筑、机构参访与城市广场，组成了欧洲旅途的第一章。", images: imagePaths(27, 28, 29, 30) },
  paris: { kicker: "FRANCE · PARIS", title: "巴黎", description: "从欧洲之星抵达，走过卢浮宫、凯旋门与埃菲尔铁塔。", images: imagePaths(31, 32, 33, 34, 35, 36, 37) },
  helsinki: { kicker: "FINLAND · HELSINKI", title: "赫尔辛基", description: "北欧的日落、城市雕塑、航班与中央火车站，画面安静而明亮。", images: imagePaths(38, 39, 40, 41) }
};

const mapPositions = {
  guangzhou: { label: "广州", x: 64, y: 79 }, shanghai: { label: "上海", x: 78, y: 47 },
  nantong: { label: "南通", x: 75, y: 44 }, xuzhou: { label: "徐州", x: 69, y: 42 },
  xiamen: { label: "厦门", x: 73, y: 71 }, hongkong: { label: "香港", x: 69, y: 82 },
  macau: { label: "澳门", x: 66, y: 84 }, tokyo: { label: "东京", x: 92, y: 34 },
  osaka: { label: "大阪", x: 90, y: 42 }, singapore: { label: "新加坡", x: 84, y: 94 },
  paris: { label: "巴黎", x: 10, y: 26 }, helsinki: { label: "赫尔辛基", x: 17, y: 13 }
};

year.textContent = new Date().getFullYear();

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function decryptPrivateInfo(passphrase) {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: base64ToBytes(PRIVATE_BLOB.salt), iterations: PRIVATE_BLOB.iterations, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(PRIVATE_BLOB.iv) }, key, base64ToBytes(PRIVATE_BLOB.data));
  return JSON.parse(new TextDecoder().decode(decrypted));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function populateDateSelectors() {
  const yearSelect = document.querySelector("#birthYear");
  const monthSelect = document.querySelector("#birthMonth");
  const daySelect = document.querySelector("#birthDay");
  const thisYear = new Date().getFullYear();

  for (let value = thisYear; value >= 1980; value -= 1) yearSelect.add(new Option(`${value} 年`, value));
  for (let value = 1; value <= 12; value += 1) monthSelect.add(new Option(`${value} 月`, value));

  function refreshDays() {
    const previous = daySelect.value;
    const days = new Date(Number(yearSelect.value) || 2000, Number(monthSelect.value) || 1, 0).getDate();
    daySelect.length = 1;
    for (let value = 1; value <= days; value += 1) daySelect.add(new Option(`${value} 日`, value));
    if (Number(previous) <= days) daySelect.value = previous;
  }
  yearSelect.addEventListener("change", refreshDays);
  monthSelect.addEventListener("change", refreshDays);
  refreshDays();
}

function revealPrivateInfo(info) {
  document.querySelector("#profilePhone").textContent = info.phone;
  document.querySelector("#profileQQ").textContent = info.qq;
  document.querySelector("#phoneValue").textContent = info.phone;
  document.querySelector("#qqValue").textContent = info.qq;
  document.querySelector("#phoneLink").href = `tel:+86${info.phone}`;
}

function unlockSite(info) {
  revealPrivateInfo(info);
  const gate = document.querySelector("#entryGate");
  document.querySelectorAll(".protected-content").forEach((node) => { node.inert = false; });
  body.classList.remove("is-locked");
  body.classList.add("is-unlocked");
  gate.classList.add("is-leaving");
  setTimeout(() => { gate.hidden = true; document.querySelector("#main").focus({ preventScroll: true }); }, 650);
}

populateDateSelectors();
document.querySelectorAll(".protected-content").forEach((node) => { node.inert = true; });
document.querySelector("#birthdayForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#gateStatus");
  const form = event.currentTarget;
  const values = ["birthYear", "birthMonth", "birthDay"].map((id) => document.querySelector(`#${id}`).value);
  if (values.some((value) => !value)) {
    status.textContent = "请完整选择年、月、日。";
    status.classList.add("is-error");
    return;
  }
  const passphrase = `${values[0]}${values[1].padStart(2, "0")}${values[2].padStart(2, "0")}`;
  form.querySelector("button").disabled = true;
  status.textContent = "正在核对航海日志…";
  try {
    const info = await decryptPrivateInfo(passphrase);
    status.classList.remove("is-error");
    status.textContent = "验证成功，欢迎登船。";
    unlockSite(info);
  } catch {
    status.textContent = "日期不对，再想想。";
    status.classList.add("is-error");
    const card = document.querySelector(".gate-card");
    card.classList.remove("shake");
    requestAnimationFrame(() => card.classList.add("shake"));
    form.querySelector("button").disabled = false;
  }
});

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
window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

function updateHeader() { header.classList.toggle("is-scrolled", window.scrollY > 24); }
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
      navAnchors.forEach((anchor) => anchor.classList.toggle("is-current", anchor.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-25% 0px -65%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));
}

let activePlace = "tokyo";
let activePhotoIndex = 0;
let photoTimer;
const photoStage = document.querySelector("#photoStage");

function updatePhoto() {
  const photos = [...photoStage.querySelectorAll(".travel-photo")];
  photos.forEach((photo, index) => photo.classList.toggle("is-active", index === activePhotoIndex));
  const total = photos.length;
  document.querySelector("#photoIndex").textContent = String(total ? activePhotoIndex + 1 : 0).padStart(2, "0");
  document.querySelector("#photoTotal").textContent = String(total).padStart(2, "0");
  document.querySelector("#photoProgressBar").style.width = total ? `${((activePhotoIndex + 1) / total) * 100}%` : "0%";
}

function restartPhotoTimer() {
  clearInterval(photoTimer);
  const count = travelPlaces[activePlace].images.length;
  if (reduceMotion.matches || count < 2) return;
  photoTimer = setInterval(() => { activePhotoIndex = (activePhotoIndex + 1) % count; updatePhoto(); }, 4800);
}

function selectPlace(key, shouldScroll = false) {
  const place = travelPlaces[key];
  if (!place) return;
  activePlace = key;
  activePhotoIndex = 0;
  document.querySelectorAll("[data-place]").forEach((button) => button.classList.toggle("is-active", button.dataset.place === key));
  document.querySelector("#travelKicker").textContent = place.kicker;
  document.querySelector("#travelTitle").textContent = place.title;
  document.querySelector("#travelDescription").textContent = place.description;
  document.querySelector("#travelCount").textContent = `${place.images.length} PHOTOS`;
  photoStage.replaceChildren();
  if (place.images.length) {
    place.images.forEach((source, index) => {
      const image = document.createElement("img");
      image.className = "travel-photo";
      image.loading = index === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.src = source;
      image.alt = `${place.title}旅途照片 ${index + 1}`;
      photoStage.append(image);
    });
  } else {
    const empty = document.createElement("div");
    empty.className = "photo-empty";
    empty.textContent = "这个坐标已经点亮，照片将在下一次更新中补上。";
    photoStage.append(empty);
  }
  const hasMultiple = place.images.length > 1;
  document.querySelector("#photoPrev").hidden = !hasMultiple;
  document.querySelector("#photoNext").hidden = !hasMultiple;
  updatePhoto();
  restartPhotoTimer();
  if (shouldScroll && window.innerWidth < 980) document.querySelector("#travelStory").scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
}

document.querySelectorAll("[data-place]").forEach((button) => button.addEventListener("click", () => selectPlace(button.dataset.place, true)));
document.querySelector("#photoPrev").addEventListener("click", () => {
  const count = travelPlaces[activePlace].images.length;
  activePhotoIndex = (activePhotoIndex - 1 + count) % count;
  updatePhoto(); restartPhotoTimer();
});
document.querySelector("#photoNext").addEventListener("click", () => {
  const count = travelPlaces[activePlace].images.length;
  activePhotoIndex = (activePhotoIndex + 1) % count;
  updatePhoto(); restartPhotoTimer();
});
photoStage.addEventListener("pointerenter", () => clearInterval(photoTimer));
photoStage.addEventListener("pointerleave", restartPhotoTimer);
selectPlace("tokyo");

const locationDialog = document.querySelector("#locationDialog");
const currentAvatar = document.querySelector("#currentAvatar");

function openLocationDialog() {
  document.querySelector("#locationPasswordStep").hidden = false;
  document.querySelector("#locationEditStep").hidden = true;
  document.querySelector("#locationPassword").value = "";
  document.querySelector("#locationPasswordStatus").textContent = "";
  if (typeof locationDialog.showModal === "function") locationDialog.showModal();
  else locationDialog.setAttribute("open", "");
  setTimeout(() => document.querySelector("#locationPassword").focus(), 50);
}

function closeLocationDialog() {
  if (typeof locationDialog.close === "function") locationDialog.close();
  else locationDialog.removeAttribute("open");
}

currentAvatar.addEventListener("contextmenu", (event) => { event.preventDefault(); openLocationDialog(); });
let longPressTimer;
currentAvatar.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") return;
  longPressTimer = setTimeout(openLocationDialog, 700);
});
["pointerup", "pointercancel", "pointermove"].forEach((name) => currentAvatar.addEventListener(name, () => clearTimeout(longPressTimer)));
document.querySelector("#locationClose").addEventListener("click", closeLocationDialog);
locationDialog.addEventListener("click", (event) => { if (event.target === locationDialog) closeLocationDialog(); });

document.querySelector("#locationPasswordForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const enteredHash = await sha256(document.querySelector("#locationPassword").value);
  if (enteredHash !== LOCATION_PASSWORD_HASH) {
    document.querySelector("#locationPasswordStatus").textContent = "密码不正确。";
    return;
  }
  document.querySelector("#locationPasswordStep").hidden = true;
  document.querySelector("#locationEditStep").hidden = false;
  document.querySelector("#locationSelect").focus();
});

function applyCurrentLocation(key, persist = true) {
  const location = mapPositions[key] || mapPositions.guangzhou;
  currentAvatar.style.setProperty("--x", `${location.x}%`);
  currentAvatar.style.setProperty("--y", `${location.y}%`);
  currentAvatar.setAttribute("aria-label", `李圣鑫当前在${location.label}，右键可更新位置`);
  document.querySelector("#avatarLocationLabel").textContent = `${location.label} · NOW`;
  document.querySelector("#currentLocationText").textContent = location.label;
  document.querySelector("#locationSelect").value = key in mapPositions ? key : "guangzhou";
  if (persist) localStorage.setItem("dechef30-current-location", key);
}

document.querySelector("#locationEditForm").addEventListener("submit", (event) => {
  event.preventDefault();
  applyCurrentLocation(document.querySelector("#locationSelect").value);
  closeLocationDialog();
});
applyCurrentLocation(localStorage.getItem("dechef30-current-location") || "guangzhou", false);

const finePointer = window.matchMedia("(pointer: fine)").matches;
const paw = document.querySelector("#pawCursor");
const halo = document.querySelector("#cursorHalo");
if (finePointer && !reduceMotion.matches) {
  body.classList.add("has-custom-cursor");
  let pointerX = innerWidth / 2, pointerY = innerHeight / 2, haloX = pointerX, haloY = pointerY;
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX; pointerY = event.clientY;
    paw.style.transform = `translate3d(${pointerX - 13}px, ${pointerY - 14}px, 0) rotate(-16deg)`;
    resetIdle();
  }, { passive: true });
  function followPointer() {
    haloX += (pointerX - haloX) * 0.34;
    haloY += (pointerY - haloY) * 0.34;
    halo.style.transform = `translate3d(${haloX - 22}px, ${haloY - 22}px, 0)`;
    requestAnimationFrame(followPointer);
  }
  followPointer();
  document.querySelectorAll("a, button, select, input, .signal-card, .work-card").forEach((target) => {
    target.addEventListener("pointerenter", () => halo.classList.add("is-active"));
    target.addEventListener("pointerleave", () => halo.classList.remove("is-active"));
  });
  document.querySelectorAll(".magnetic").forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      target.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.07}px, ${(event.clientY - rect.top - rect.height / 2) * 0.08}px)`;
    });
    target.addEventListener("pointerleave", () => { target.style.transform = ""; });
  });
}

let idleTimer;
function resetIdle() { body.classList.remove("is-idle"); clearTimeout(idleTimer); idleTimer = setTimeout(() => body.classList.add("is-idle"), 3200); }
["scroll", "keydown", "touchstart"].forEach((eventName) => window.addEventListener(eventName, resetIdle, { passive: true }));
resetIdle();

const canvas = document.querySelector("#ambientCanvas");
const ctx = canvas.getContext("2d");
let particles = [], canvasWidth = 0, canvasHeight = 0, frameId;
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth; canvasHeight = window.innerHeight;
  canvas.width = Math.round(canvasWidth * ratio); canvas.height = Math.round(canvasHeight * ratio);
  canvas.style.width = `${canvasWidth}px`; canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.min(46, Math.max(22, Math.round(canvasWidth / 34)));
  particles = Array.from({ length: count }, () => ({ x: Math.random() * canvasWidth, y: Math.random() * canvasHeight, radius: Math.random() * 1.5 + .5, vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12, alpha: Math.random() * .3 + .08 }));
}
function drawAmbient() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  particles.forEach((particle) => {
    particle.x += particle.vx; particle.y += particle.vy;
    if (particle.x < -5) particle.x = canvasWidth + 5; if (particle.x > canvasWidth + 5) particle.x = -5;
    if (particle.y < -5) particle.y = canvasHeight + 5; if (particle.y > canvasHeight + 5) particle.y = -5;
    ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(121, 80, 242, ${body.classList.contains("is-idle") ? particle.alpha * 1.8 : particle.alpha})`; ctx.fill();
  });
  frameId = requestAnimationFrame(drawAmbient);
}
function startAmbient() { cancelAnimationFrame(frameId); if (!reduceMotion.matches) drawAmbient(); }
resizeCanvas(); startAmbient();
window.addEventListener("resize", () => { resizeCanvas(); startAmbient(); }, { passive: true });
document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(frameId); else startAmbient(); });
