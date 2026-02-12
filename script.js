const bg = document.getElementById("bg");
const percentEl = document.getElementById("percent");
const statusEl = document.getElementById("status");
const slider = document.getElementById("slider");
const fill = document.getElementById("fill");

let value = Number(slider.value) || 72;

const COUNT = 44;
const HEARTS = ["💗","💖","💘","💕","💞","❤️‍🔥","✨"];
const FIRES  = ["🔥","🔥","🔥","💥","🌶️","✨"];

function rand(min, max){ return Math.random() * (max - min) + min; }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

function setMode(v){
  const mode = v >= 50 ? "hearts" : "fire";
  document.body.dataset.mode = mode;

  // ufak “benzer site” dokunuşu: durum etiketi
  if (mode === "hearts"){
    statusEl.textContent = v >= 85 ? "Evlilik moduna girildi 💍💗" :
                          v >= 65 ? "Kalp modu 💗" :
                          "Isınma var 💞";
  } else {
    statusEl.textContent = v <= 15 ? "Buz gibi 🧊" :
                          v <= 35 ? "Kıvılcım var 🔥" :
                          "Ateş modu 🔥";
  }
}

function renderValue(v){
  percentEl.textContent = String(v);
  fill.style.width = `${v}%`;
  setMode(v);
}

function clearBg(){ bg.innerHTML = ""; }

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

function apply(v){
  renderValue(v);
  spawnParticles(v >= 50 ? "hearts" : "fire");
}

slider.addEventListener("input", (e) => {
  value = Number(e.target.value);
  apply(value);
});

// Klavye kontrol: ← → (Shift ile hızlı)
window.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 5 : 1;
  if (["ArrowUp","ArrowRight"].includes(e.key)) value = Math.min(100, value + step);
  if (["ArrowDown","ArrowLeft"].includes(e.key)) value = Math.max(0, value - step);
  slider.value = value;
  apply(value);
});

// Telefonda “gizli ayar”: basılı sürükle
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
  const delta = Math.round(dx / 6);
  value = Math.max(0, Math.min(100, startVal + delta));
  slider.value = value;
  apply(value);
});

window.addEventListener("pointerup", () => dragging = false);
window.addEventListener("pointercancel", () => dragging = false);

// ilk yükleme
apply(value);
