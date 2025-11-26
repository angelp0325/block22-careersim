// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2508-ANGEL";
const API = BASE + COHORT;

// === State ===
const state = {
  players: [],
  selectedPlayer: null,
};

// === DOM Elements ===
const rosterContainer = document.querySelector("#roster");
const detailsContainer = document.querySelector("#details");
const form = document.querySelector("#new-puppy-form");

// === Fetch All Players ===
async function fetchAllPlayers() {
  try {
    const response = await fetch(`${API}/players`);
    const data = await response.json();
    state.players = data.data.players;
    renderRoster();
  } catch (err) {
    console.error("Error fetching players:", err);
  }
}

// === Fetch Single Player ===
async function fetchPlayerById(id) {
  try {
    const response = await fetch(`${API}/players/${id}`);
    const data = await response.json();
    state.selectedPlayer = data.data.player;
    renderDetails();
  } catch (err) {
    console.error("Error fetching player:", err);
  }
}

// === Remove Player ===
async function removePlayer(id) {
  try {
    await fetch(`${API}/players/${id}`, { method: "DELETE" });
    state.players = state.players.filter((p) => p.id !== id);
    state.selectedPlayer = null;
    renderRoster();
    renderDetails();
  } catch (err) {
    console.error("Error removing player:", err);
  }
}

// === Add New Player ===
async function addNewPuppy(event) {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const breed = document.querySelector("#breed").value.trim();
  const status = document.querySelector("#status").value;
  const imageUrl = document.querySelector("#imageUrl").value.trim();

  if (!name || !breed) {
    alert("Please provide a name and breed.");
    return;
  }

  const newPuppy = {
    name,
    breed,
    status,
    imageUrl:
      imageUrl || "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  };

  try {
    await fetch(`${API}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPuppy),
    });
    form.reset();
    fetchAllPlayers();
  } catch (err) {
    console.error("Error adding puppy:", err);
  }
}

// === Render Roster ===
function renderRoster() {
  rosterContainer.innerHTML = "";
  state.players.forEach((puppy) => {
    const card = document.createElement("div");
    card.classList.add("puppy-card");
    card.innerHTML = `
      <img src="${puppy.imageUrl}" alt="${puppy.name}">
      <p>${puppy.name}</p>
    `;
    card.addEventListener("click", () => fetchPlayerById(puppy.id));
    rosterContainer.appendChild(card);
  });
}

// === Render Details ===
function renderDetails() {
  if (!state.selectedPlayer) {
    detailsContainer.innerHTML = `<p>Select a puppy to view details.</p>`;
    return;
  }

  const { name, id, breed, status, team, imageUrl } = state.selectedPlayer;
  detailsContainer.innerHTML = `
    <img src="${imageUrl}" alt="${name}">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>ID:</strong> ${id}</p>
    <p><strong>Breed:</strong> ${breed}</p>
    <p><strong>Team:</strong> ${team?.name || "Unassigned"}</p>
    <p><strong>Status:</strong> ${status}</p>
    <button id="remove-btn">Remove from roster</button>
  `;

  document
    .querySelector("#remove-btn")
    .addEventListener("click", () => removePlayer(id));
}

// === Init ===
function init() {
  fetchAllPlayers();
  renderDetails();
  form.addEventListener("submit", addNewPuppy);
}

init();
