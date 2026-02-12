const bg = document.getElementById("bg");
const percentEl = document.getElementById("percent");
const hintEl = document.getElementById("hint");
const slider = document.getElementById("slider");

// Başlangıç değeri
let value = Number(slider.value) || 72;

// Kalp/ateş havuzu
const COUNT = 42;
const HEARTS = ["💗","💖","💘","💕","💞","❤️‍🔥"];
const FIRES  = ["🔥","🔥","🔥","💥","🌶️","✨"];

function rand(min, max){ return Math.random() * (max - min) + min; }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

function setMode(v){
  const mode = v >= 50 ? "hearts" : "fire";
  document.body.dataset.mode = mode;
  hintEl.textContent = mode === "hearts" ? "Kalp modu 💗" : "Ateş modu 🔥";
}

function renderValue(v){
  percentEl.textContent = v.toString();
  setMode(v);
}

function clearBg(){
  bg.innerHTML = "";
}

function spawnParticles(mode){
  clearBg();

  const pool = mode === "hearts" ? HEARTS : FIRES;

  for(let i=0;i<COUNT;i++){
    const el = document.createElement("div");
    el.className = "p";
    el.textContent = pick(pool);

    el.style.setProperty("--x", rand(3, 97).toFixed(2));
    el.style.setProperty("--y", rand(6, 96).toFixed(2));
    el.style.setProperty("--s", `${rand(18, 44).toFixed(0)}px`);
    el.style.setProperty("--r", `${rand(-20, 20).toFixed(1)}deg`);
    el.style.setProperty("--d", `${rand(0, 2.8).toFixed(2)}s`);

    bg.appendChild(el);
  }
}

// Slider ile kontrol (gizli)
slider.addEventListener("input", (e) => {
  value = Number(e.target.value);
  renderValue(value);
  spawnParticles(value >= 50 ? "hearts" : "fire");
});

// Klavyeden de ayarla: ↑↓ veya ←→
window.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 5 : 1;
  if (["ArrowUp","ArrowRight"].includes(e.key)) value = Math.min(100, value + step);
  if (["ArrowDown","ArrowLeft"].includes(e.key)) value = Math.max(0, value - step);
  slider.value = value;
  renderValue(value);
  spawnParticles(value >= 50 ? "hearts" : "fire");
});

// İlk yükleme
renderValue(value);
spawnParticles(value >= 50 ? "hearts" : "fire");

// Telefonda “gizli” ayar: ekrana basılı tutup sürükleyince değişsin
let dragging = false;
let startX = 0;
let startVal = value;

window.addEventListener("pointerdown", (e) => {
  dragging = true;
  startX = e.clientX;
  startVal = value;
});

window.addEventListener("pointermove", (e) => {
  if(!dragging) return;
  const dx = e.clientX - startX;
  const delta = Math.round(dx / 6); // hassasiyet
  value = Math.max(0, Math.min(100, startVal + delta));
  slider.value = value;
  renderValue(value);
  // mod değişince regen
  spawnParticles(value >= 50 ? "hearts" : "fire");
});

window.addEventListener("pointerup", () => dragging = false);
window.addEventListener("pointercancel", () => dragging = false);
