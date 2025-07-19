const API_URL =
  "https://687afd0dabb83744b7ee6f2e.mockapi.io/leaderboard/player";

selectedImage = localStorage.getItem("selectedImage") || "assets/mika.jpg";

const size = 3;
const tileSize = 100;
const gap = 2;
const total = size * size;
let tiles = [];
let initialTiles = [];
let emptyIndex = total - 1;
let isPlaying = false;
let isReady = false;
let timerInterval;
let seconds = 0;
let countdownTimeout;

function selectImg() {
  const menu = document.querySelector("#menu");
  menu.style.display = "flex";
  document.getElementById("menu-wrapper").style.display = "block";
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("icon").style.display = "none";
  document.getElementById("title").style.display = "none";
  document.getElementById("creator").style.display = "none";
  document.getElementById("menu-title").style.display = "block";
  document.getElementById("backBtn").style.display = "inline-block";
  document.querySelector("#leaderboard").style.display = "none";
  document.querySelector("#leaderboardBtn").style.display = "none";
}

function goBack() {
  document.querySelector("#menu-wrapper").style.display = "none";
  document.querySelector("#menu").style.display = "none";
  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("icon").style.display = "inline-block";
  document.getElementById("title").style.display = "inline-block";
  document.getElementById("creator").style.display = "inline-block";
  document.getElementById("leaderboardBtn").style.display = "inline-block";
  document.getElementById("menu-title").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
}

function startGame() {
  initTiles();
  renderTiles();
  isReady = false;
  isPlaying = false;
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("stopwatch").style.display = "none";
  document.getElementById("win-text").textContent = "";
  document.getElementById("title").style.display = "none";
  document.getElementById("icon").style.display = "none";
  document.getElementById("creator").style.display = "none";
  document.getElementById("menu-title").style.display = "none";
  document.getElementById("menu").style.display = "none";
  document.getElementById("backBtn").style.display = "none";
  document.getElementById("puzzle-container").style.display = "inline-block";

  document.getElementById("countdown").textContent = "Mulai dalam 3...";
  let countdown = 3;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      document.getElementById(
        "countdown"
      ).textContent = `Mulai dalam ${countdown}...`;
    } else {
      clearInterval(countdownInterval);
      document.getElementById("countdown").textContent = "";
      shuffleTiles();
      renderTiles();
      isReady = true;
      isPlaying = true;
      seconds = 0;
      updateStopwatch();
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        seconds++;
        updateStopwatch();
      }, 1000);
      document.getElementById("startBtn").style.display = "none";
      document.getElementById("title").style.display = "none";
      document.getElementById("stopwatch").style.display = "inline-block";
      document.getElementById("resetBtn").style.display = "inline-block";
    }
  }, 1000);
}

function resetToInitial() {
  initTiles();
  renderTiles();
  clearInterval(timerInterval);
  seconds = 0;
  updateStopwatch();
  isReady = false;
  isPlaying = false;

  document.getElementById("startBtn").style.display = "inline-block";
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("stopwatch").style.display = "none";
  document.getElementById("win-text").textContent = "";
  document.getElementById("countdown").textContent = "";
  document.getElementById("title").style.display = "inline-block";
  document.getElementById("icon").style.display = "inline-block";
  document.getElementById("creator").style.display = "inline-block";
  document.getElementById("puzzle-container").style.display = "none";
  document.getElementById("leaderboard").style.display = "none";
  document.getElementById("leaderboardBtn").style.display = "inline-block";
  document.getElementById("menu-wrapper").style.display = "none";
  document.getElementById("submit-score").style.display = "none";
}

function updateStopwatch() {
  document.getElementById("stopwatch").textContent = `Waktu: ${seconds} detik`;
}

function initTiles() {
  tiles = [];
  for (let i = 0; i < total - 1; i++) {
    tiles.push(i + 1);
  }
  tiles.push(null);
  emptyIndex = total - 1;
  initialTiles = [...tiles];
}

function shuffleTiles(times = 100) {
  for (let i = 0; i < times; i++) {
    const movable = getMovableIndexes();
    const rand = movable[Math.floor(Math.random() * movable.length)];
    moveTile(rand, true);
  }
}

function renderTiles() {
  const container = document.getElementById("puzzle-container");
  container.innerHTML = "";

  for (let i = 0; i < tiles.length; i++) {
    const value = tiles[i];
    if (value === null) continue;

    const tile = document.createElement("div");
    tile.style.backgroundImage = `url('${selectedImage}')`;
    tile.className = "tile";
    tile.textContent = "";
    const bgRow = Math.floor((value - 1) / size);
    const bgCol = (value - 1) % size;
    tile.style.backgroundPosition = `${-bgCol * tileSize}px ${
      -bgRow * tileSize
    }px`;

    tile.dataset.index = i;
    tile.dataset.value = value;

    tile.addEventListener("click", () => {
      const currentIndex = parseInt(tile.dataset.index);
      moveTile(currentIndex);
    });

    document.getElementById("puzzle-container").appendChild(tile);
  }

  updatePositions();
  isPlaying = true;
}

function updatePositions() {
  const tilesDom = document.querySelectorAll(".tile");
  tilesDom.forEach((tile) => {
    const index = tiles.indexOf(parseInt(tile.dataset.value));
    tile.dataset.index = index;
    const row = Math.floor(index / size);
    const col = index % size;
    const x = col * (tileSize + gap);
    const y = row * (tileSize + gap);
    tile.style.transform = `translate(${x}px, ${y}px)`;
  });
}

function getMovableIndexes() {
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const directions = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  const indexes = [];

  directions.forEach((d) => {
    const newRow = emptyRow + d.r;
    const newCol = emptyCol + d.c;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      indexes.push(newRow * size + newCol);
    }
  });

  return indexes;
}

function moveTile(index, isShuffling = false) {
  if (!isReady && !isShuffling) return;
  if (!getMovableIndexes().includes(index)) return;

  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  emptyIndex = index;
  updatePositions();

  if (!isShuffling && isPlaying) {
    checkSolved();
  }
}

function checkSolved() {
  const correct = Array.from({ length: total - 1 }, (_, i) => i + 1).concat(
    null
  );
  const isSolved = tiles.every((val, i) => val === correct[i]);
  if (isSolved) {
    clearInterval(timerInterval);
    isPlaying = false;
    document.getElementById("win-text").textContent =
      "🎉 Puzzle selesai dalam " + seconds + " detik!";
    document.getElementById("win-text").style.display = "block";
    document.getElementById("submit-score").style.display = "block";
  }
}

function submitScore() {
  const name = document.getElementById("playerName").value;
  if (!name) {
    alert("Isi nama dulu ya!");
    return;
  }

  fetch("https://687afd0dabb83744b7ee6f2e.mockapi.io/leaderboard/player", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name, time: seconds, image: selectedImage }),
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("submit-score").style.display = "none";
      fetchLeaderboard(); // panggil leaderboard setelah submit
    })
    .catch((err) => {
      alert("Gagal submit skor :(");
      console.error(err);
    });
}

function fetchLeaderboard() {
  fetch(API_URL + "?sortBy=time&order=asc")
    .then((res) => res.json())
    .then((data) => {
      const list = data
        .map(
          (p, i) =>
            `<tr><td>${i + 1}</td><td>${p.name}</td><td><img src="${p.image}" alt="${p.name}" class="leaderboard-image" /></td><td><span>${p.time} detik</span></td></tr>`
        )
        .join("");
      document.getElementById("leaderboard-list").innerHTML = list;
      document.getElementById("leaderboard").style.display = "block";
    });
}

function showLeaderboard() {
  document.getElementById("leaderboard").style.display = "block";
  document.getElementById("leaderboard-title").style.display = "block";
  fetchLeaderboard();
}

document.querySelectorAll("#menu a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const imgSrc = link.getAttribute("data-image");
    selectedImage = imgSrc;
    localStorage.setItem("selectedImage", selectedImage);
    startGame();
  });
});

initTiles();
renderTiles();
