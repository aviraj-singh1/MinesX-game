// =========================
// Mines (Fun Mode) - Vanilla JS
// =========================

const $ = (sel) => document.querySelector(sel);

const gridEl = $("#grid");
const minesSelect = $("#minesSelect");
const nextValueEl = $("#nextValue");

const balancePill = $("#balancePill");
const betInput = $("#betInput");
const ctaBtn = $("#ctaBtn");
const statusText = $("#statusText");
const payoutText = $("#payoutText");

const randomBtn = $("#randomBtn");
const refreshBtn = $("#refreshBtn");
const autoGameToggle = $("#autoGameToggle");

const howToBtn = $("#howToBtn");
const howToOverlay = $("#howToOverlay");
const howToCloseBtn = $("#howToCloseBtn");

const menuBtn = $("#menuBtn");
const menuPanel = $("#menuPanel");
const soundToggle = $("#soundToggle");
const rulesBtn = $("#rulesBtn");
const fairBtn = $("#fairBtn");
const homeBtn = $("#homeBtn");

const infoOverlay = $("#infoOverlay");
const infoCloseBtn = $("#infoCloseBtn");
const infoTitle = $("#infoTitle");
const infoBody = $("#infoBody");

const chips = document.querySelectorAll(".betChip");


let resetTimer = null; // <--- ADD THIS
// --- AUDIO OBJECTS ---
const sounds = {
  click: new Audio("sounds/click.wav"),
  bomb: new Audio("sounds/bomb.wav"),
  cashout: new Audio("sounds/cashout.mp3"),
  lose: new Audio("sounds/lose.wav"),
  coin: new Audio("sounds/coin.wav")
};

// Helper to play sound if toggle is ON
function playSound(name) {
  if (soundToggle.checked && sounds[name]) {
    // Reset time so rapid clicks play correctly
    sounds[name].currentTime = 0;
    sounds[name].play().catch(e => console.warn("Audio play blocked", e));
  }
}

function starSVG(){
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.2l2.9 6.1 6.7.6-5 4.3 1.5 6.5L12 16.9 5.9 19.7l1.5-6.5-5-4.3 6.7-.6L12 2.2z"/>
    </svg>
  `;
}

function bombSVG(){
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.6 2.8c.3 1.1 0 2.2-.7 3.1l1 .9c.5-.3 1.2-.4 1.8-.2l.9-1 1 1-.8.9c.5.8.4 1.9-.3 2.6l-1.1-1.1c-.2.2-.4.4-.7.5l.6.6-1 1-1.2-1.2c-.3 0-.6 0-.9-.1l-.5.5-.9-.9.3-.3c-.6-.6-1-1.4-1-2.3 0-1.6 1.1-3 2.5-3.4l-.5-.5 1-1 .6.6c.2-.3.3-.6.3-1L14.6 2.8zM12 9.2c3.5 0 6.3 2.8 6.3 6.3S15.5 21.8 12 21.8 5.7 19 5.7 15.5 8.5 9.2 12 9.2z"/>
    </svg>
  `;
}

function explosionSVG(){
  return `
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l1.5 5 4.8-1.8-2.1 4.7 5 1.4-4.6 2.4 2.7 4.4-5.1-1-1.2 5-2.3-4.6-4.4 2.7 1-5.1-5-1.2 4.6-2.3-2.7-4.4 5.1 1 1.2-5z"/>
    </svg>
  `;
}


function setCtaMode(mode){
  if(mode === "bet"){
    ctaBtn.textContent = "BET";
    ctaBtn.classList.remove("cashoutMode");
    ctaBtn.classList.add("betMode");
  } else {
    ctaBtn.textContent = "CASH OUT";
    ctaBtn.classList.remove("betMode");
    ctaBtn.classList.add("cashoutMode");
  }
}


// -------------------------
// Game State
// -------------------------
const SIZE = 5;
const TOTAL = SIZE * SIZE;

// Check if user has a stored balance. 
// We use !== null to ensure that if the balance is 0, it loads 0 instead of resetting to 100.
let storedBalance = localStorage.getItem("mines_balance");
let balance = storedBalance !== null ? Number(storedBalance) : 100;

let gameActive = false;
let bet = 0;
let minesCount = 3;

let mines = new Set();
let revealedSafe = 0;

let multiplier = 1.0;
let stepFactor = 1.10; // changes with mines
let autoTimer = null;


function updateBalanceUI(){
  // FIXED: Save the current balance to storage every time the UI updates
  localStorage.setItem("mines_balance", balance); 
  
  balancePill.textContent = formatINR(balance);
}

// ... inside existing event listeners ...

const topupBtn = $("#topupBtn");
if(topupBtn){
  topupBtn.addEventListener("click", () => {
    window.location.href = "topup.html"; // Redirects to new page
  });
}

function formatINR(n){
  const value = Math.max(0, Math.floor(n));
  return "₹ " + value.toLocaleString("en-IN");
}

function clampBet(v){
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(1, Math.floor(n));
}

function setStatus(msg){
  statusText.textContent = msg;
}



function updatePayoutUI(){
  const payout = gameActive ? Math.floor(bet * multiplier) : 0;
  payoutText.textContent = "Payout: ₹" + payout.toLocaleString("en-IN");
}

function updateNextUI() {
  if (!gameActive) {
    nextValueEl.textContent = "1.00x";
    return;
  }

  const nextMult = +(multiplier * stepFactor).toFixed(2);
  nextValueEl.textContent = `${nextMult}x`;
  
  updatePayoutUI();
}



function computeStepFactor(m){
  // simple fun formula: more mines => faster multiplier
  const min = 1.05;
  const max = 1.20;
  const t = (m - 1) / 9; // 1..10
  return +(min + (max - min) * t).toFixed(3);
}

// -------------------------
// Board Rendering
// -------------------------
function tileTemplate(index){
  const tile = document.createElement("div");
  tile.className = "tile disabled";
  tile.dataset.index = String(index);

  const inner = document.createElement("div");
  inner.className = "tileInner";

  const front = document.createElement("div");
  front.className = "tileFace tileFront";

  const back = document.createElement("div");
  back.className = "tileFace tileBack";
  back.textContent = ""; // filled on reveal

  inner.appendChild(front);
  inner.appendChild(back);
  tile.appendChild(inner);

  return tile;
}

function renderBoard(){
  gridEl.innerHTML = "";
  for(let i=0;i<TOTAL;i++){
    gridEl.appendChild(tileTemplate(i));
  }
}

function resetRoundUI(){
  const tiles = gridEl.querySelectorAll(".tile");
  tiles.forEach(t => {
    t.classList.remove("revealed","safe","mine","selectedGlow");
    t.classList.add("disabled");
    const back = t.querySelector(".tileBack");
    if (back) back.textContent = "";
    setCtaMode("bet");

  });

  randomBtn.disabled = true;
  setStatus("Place a bet and press START.");
  multiplier = 1.0;
  revealedSafe = 0;
  updateNextUI();
  updatePayoutUI();
}

// -------------------------
// Mine placement
// -------------------------
function randomInt(maxExclusive){
  return Math.floor(Math.random() * maxExclusive);
}

function placeMines(){
  mines.clear();
  while(mines.size < minesCount){
    mines.add(randomInt(TOTAL));
  }
}

function isMine(idx){
  return mines.has(idx);
}

function enableTiles(enable){
  const tiles = gridEl.querySelectorAll(".tile");
  tiles.forEach(t => {
    if (enable) t.classList.remove("disabled");
    else t.classList.add("disabled");
  });
}

// -------------------------
// Reveal logic
// -------------------------
function revealTile(tileEl){
  if (!tileEl || tileEl.classList.contains("revealed")) return;
  if (!gameActive) return;

  const idx = Number(tileEl.dataset.index);
  if (!Number.isFinite(idx)) return;
  
  // SOUND: Click feedback immediately
  playSound("click");

  tileEl.classList.add("selectedGlow");

  const back = tileEl.querySelector(".tileBack");
  const mine = isMine(idx);

  if (mine){
    tileEl.classList.add("mine","revealed","clickedMine");
    if (back) back.innerHTML = explosionSVG();   // clicked mine = explosion
    
    // SOUND: Hit a mine
    playSound("bomb");
    
    loseRound(idx);
    return;
  }

  // Safe tile found
  tileEl.classList.add("safe","revealed");
  if (back) back.innerHTML = starSVG();          // safe = white star

  // SOUND: Safe tile coin sound
  playSound("coin");

  revealedSafe += 1;
  multiplier = +(multiplier * stepFactor).toFixed(4);

  setStatus(`Safe! Picks: ${revealedSafe}`);
  updateNextUI();
  updatePayoutUI();
}

function revealAllMines(){
  const tiles = gridEl.querySelectorAll(".tile");
  tiles.forEach(t => {
    const idx = Number(t.dataset.index);
    if (isMine(idx)){
      const back = t.querySelector(".tileBack");
      t.classList.add("mine","revealed");
      if (!t.classList.contains("clickedMine")) {
        if (back) back.innerHTML = bombSVG();        // other mines = bomb on blue tile
      }
    }
  });
}

function endRound(){
  gameActive = false;
  enableTiles(false);
  randomBtn.disabled = true;
  stopAuto();
  updateNextUI();
  updatePayoutUI();
  setCtaMode("bet");

  // 2. Auto-reset the board after 2 seconds
  resetTimer = setTimeout(() => {
    resetRoundUI();
  }, 2000);
}

function loseRound(){
  revealAllMines();
  setStatus("Boom! You lost the bet.");
  
  // SOUND: Lose sad sound
  setTimeout(() => playSound("lose"), 300); // small delay after explosion
  
  endRound();
}

function winCashout(){
  const payout = Math.floor(bet * multiplier);
  balance += payout;
  updateBalanceUI();
  
  // SOUND: Cashout success
  playSound("cashout");
  
  setStatus(`Cashed out: ₹${payout.toLocaleString("en-IN")}`);
  endRound();
}

// -------------------------
// Controls
// -------------------------
function startRound(){
  // 1. Clear any pending reset timer from the previous round
  if (resetTimer) clearTimeout(resetTimer);

  minesCount = Number(minesSelect.value);
  stepFactor = computeStepFactor(minesCount);

  bet = clampBet(betInput.value);

  if (bet <= 0){
    setStatus("Enter a valid bet.");
    return;
  }
  if (bet > balance){
    setStatus("Not enough balance.");
    return;
  }
  
  // SOUND: Start/Click
  playSound("click");

  // take bet
  balance -= bet;
  updateBalanceUI();

  // start game
  gameActive = true;
  multiplier = 1.0;
  revealedSafe = 0;

  placeMines();

  // reset tiles visuals
  const tiles = gridEl.querySelectorAll(".tile");
  tiles.forEach(t => {
    t.classList.remove("revealed","safe","mine","selectedGlow");
    const back = t.querySelector(".tileBack");
    if (back) back.textContent = "";
  });

  enableTiles(true);
  randomBtn.disabled = false;

  setStatus("Game started. Pick a tile.");
  updateNextUI();
  updatePayoutUI();
  setCtaMode("cashout");
}

function resetBoardHard(){
  stopAuto();
  gameActive = false;
  bet = 0;
  mines.clear();
  playSound("click"); // Sound on refresh
  resetRoundUI();
}

function getUnrevealedTiles(){
  return Array.from(gridEl.querySelectorAll(".tile")).filter(t => !t.classList.contains("revealed"));
}

function pickRandomTile(){
  if (!gameActive) return;
  const candidates = getUnrevealedTiles();
  if (candidates.length === 0) return;
  const t = candidates[randomInt(candidates.length)];
  revealTile(t);
}

function startAuto(){
  if (autoTimer) return;
  autoTimer = setInterval(() => {
    if (!gameActive){
      stopAuto();
      return;
    }
    pickRandomTile();
  }, 600);
}

function stopAuto(){
  if (autoTimer){
    clearInterval(autoTimer);
    autoTimer = null;
  }
  autoGameToggle.checked = false;
}

// -------------------------
// Menu + Modals
// -------------------------
function openHowTo(open){
  howToOverlay.classList.toggle("hidden", !open);
  playSound("click");
}

function openInfo(title, body){
  infoTitle.textContent = title;
  infoBody.textContent = body;
  infoOverlay.classList.remove("hidden");
  playSound("click");
}

function closeInfo(){
  infoOverlay.classList.add("hidden");
  playSound("click");
}

function toggleMenu(open){
  menuPanel.classList.toggle("hidden", !open);
  playSound("click");
}

function isMenuOpen(){
  return !menuPanel.classList.contains("hidden");
}

// -------------------------
// Events
// -------------------------
gridEl.addEventListener("click", (e) => {
  const tile = e.target.closest(".tile");
  if (!tile) return;
  if (tile.classList.contains("disabled")) return;
  revealTile(tile);
});

ctaBtn.addEventListener("click", () => {
  if(!gameActive){
    startRound();
  } else {
    if (revealedSafe <= 0){
      setStatus("Pick at least 1 safe tile to cash out.");
      return;
    }
    winCashout();
  }
});


randomBtn.addEventListener("click", () => {
    playSound("click");
    pickRandomTile();
});

refreshBtn.addEventListener("click", () => {
  // Reset board (does not refund active bet)
  resetBoardHard();
});

autoGameToggle.addEventListener("change", () => {
  playSound("click");
  if (autoGameToggle.checked){
    if (!gameActive){
      autoGameToggle.checked = false;
      setStatus("Start a game first to use Auto Game.");
      return;
    }
    startAuto();
  } else {
    stopAuto();
  }
});

minesSelect.addEventListener("change", () => {
  if (gameActive){
    setStatus("Mines can't be changed during an active game.");
    minesSelect.value = String(minesCount);
    return;
  }
  minesCount = Number(minesSelect.value);
  stepFactor = computeStepFactor(minesCount);
  updateNextUI();
});

betInput.addEventListener("input", () => {
  betInput.value = String(clampBet(betInput.value || 1));
});

chips.forEach(btn => {
  btn.addEventListener("click", () => {
    playSound("click");
    const add = Number(btn.dataset.chip || 0);
    const cur = clampBet(betInput.value || 1);
    betInput.value = String(cur + add);
  });
});

// how to play
howToBtn.addEventListener("click", () => openHowTo(true));
howToCloseBtn.addEventListener("click", () => openHowTo(false));
howToOverlay.addEventListener("click", (e) => {
  if (e.target === howToOverlay) openHowTo(false);
});

// menu
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu(!isMenuOpen());
});

document.addEventListener("click", (e) => {
  // close menu when clicking outside
  if (isMenuOpen() && !menuPanel.contains(e.target) && e.target !== menuBtn){
    toggleMenu(false);
  }
});

soundToggle.addEventListener("change", () => {
  localStorage.setItem("mines_sound", soundToggle.checked ? "1" : "0");
  if(soundToggle.checked) playSound("click");
});

rulesBtn.addEventListener("click", () => {
  toggleMenu(false);
  openInfo("Game Rules", "Pick tiles to reveal stars. Each safe pick increases your multiplier. Cash out anytime after at least one safe pick. If you hit a mine, you lose the bet.");
});

fairBtn.addEventListener("click", () => {
  toggleMenu(false);
  openInfo("Provably Fair Settings", "Fun mode demo. You can later add client seed / server seed / nonce here.");
});

homeBtn.addEventListener("click", () => {
  toggleMenu(false);
  openInfo("Back to Home", "Demo button. Hook this to your home page later.");
});

infoCloseBtn.addEventListener("click", closeInfo);
infoOverlay.addEventListener("click", (e) => {
  if (e.target === infoOverlay) closeInfo();
});

// -------------------------
// Init
// -------------------------
function init(){
  renderBoard();
  updateBalanceUI();

  const storedSound = localStorage.getItem("mines_sound");
  // Default sound to ON if not set
  soundToggle.checked = storedSound === null ? true : (storedSound === "1");

  minesCount = Number(minesSelect.value);
  stepFactor = computeStepFactor(minesCount);

  resetRoundUI();
}

init();