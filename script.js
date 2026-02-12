const bg = document.getElementById("bg");
const fx = document.getElementById("fx");
const percentEl = document.getElementById("percent");
const slider = document.getElementById("slider");
const fill = document.getElementById("fill");
const head = document.getElementById("head");

let value = Number(slider.value) || 72;
let lastEgg = null;

const HEARTS = ["💗","💖","💘","💕","💞","❤️‍🔥","✨"];
const FIRES  = ["🔥","🔥","🔥","💥","🌶️","✨","💨"];

const BG_COUNT = 40;

function rand(min, max){ return Math.random() * (max - min) + min; }
function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

function setMode(v){
  document.body.dataset.mode = v >= 50 ? "hearts" : "fire";
}

function render(v){
  percentEl.textContent = String(v);

  // bar doluluğu
  fill.style.width = `${v}%`;

  // head (ok+avatar) barın ucunda kalsın
  // 0 ve 100 uçlarında taşmasın diye clamp
  const clamped = Math.max(2, Math.min(98, v));
  head.style.left = `${clamped}%`;

  setMode(v);
}

function clearBg(){ bg.innerHTML = ""; }

function spawnBackground(mode){
  clearBg();
  const pool = mode === "hearts" ? HEARTS : FIRES;

  for(let i=0;i<BG_COUNT;i++){
    const el = document.createElement("div");
    el.className = "p";
    el.textContent = pick(pool);

    el.style.setProperty("--x", rand(3, 97).toFixed(2));
    el.style.setProperty("--y", rand(6, 96).toFixed(2));
    el.style.setProperty("--s", `${rand(18, 44).toFixed(0)}px`);
    el.style.setProperty("--r", `${rand(-20, 20).toFixed(1)}deg`);
    el.style.setProperty("--d", `${rand(0, 2.6).toFixed(2)}s`);

    bg.appendChild(el);
  }
}

function burst(kind){
  // kind: "love" | "smoke"
  const pool = kind === "love"
    ? ["💖","💗","💘","💕","✨","💞","💝"]
    : ["💨","🔥","💥","🌶️","💨","🔥"];

  // merkez: barın ucu (head) civarı
  const rect = head.getBoundingClientRect();
  const cx = (rect.left + rect.right) / 2 / window.innerWidth * 100;
  const cy = (rect.top + rect.bottom) / 2 / window.innerHeight * 100;

  for(let i=0;i<26;i++){
    const el = document.createElement("div");
    el.className = "burst";
    el.textContent = pick(pool);

    el.style.setProperty("--bx", cx.toFixed(2));
    el.style.setProperty("--by", cy.toFixed(2));
    el.style.setProperty("--bs", `${rand(18, 36).toFixed(0)}px`);

    // patlama yönleri
    const dx = `${rand(-140, 140).toFixed(0)}px`;
    const dy = `${rand(-130, 130).toFixed(0)}px`;
    el.style.setProperty("--dx", dx);
    el.style.setProperty("--dy", dy);

    fx.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

function apply(v){
  render(v);
  spawnBackground(v >= 50 ? "hearts" : "fire");

  // Easter egg: sadece eşik değişince bir kere çaksın
  if (v === 100 && lastEgg !== "love"){
    burst("love");
    lastEgg = "love";
  } else if (v === 0 && lastEgg !== "smoke"){
    burst("smoke");
    lastEgg = "smoke";
  } else if (v !== 0 && v !== 100) {
    lastEgg = null;
  }
}

// Slider input (gizli ama işe yarıyor)
slider.addEventListener("input", (e) => {
  value = Number(e.target.value);
  apply(value);
});

// Klavye: ← → (Shift hızlı)
window.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 5 : 1;
  if (["ArrowRight","ArrowUp"].includes(e.key)) value = Math.min(100, value + step);
  if (["ArrowLeft","ArrowDown"].includes(e.key)) value = Math.max(0, value - step);
  slider.value = value;
  apply(value);
});

// Telefonda/desktop: basılı tutup sürükle
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
