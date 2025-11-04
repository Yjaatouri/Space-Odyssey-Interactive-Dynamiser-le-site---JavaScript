// ===============================
// Elements
// ===============================
const missionsContainer = document.getElementById("missions-container");
const searchInput = document.getElementById("searchInput");
const agencyFilter = document.getElementById("agencyFilter");
const yearFilter = document.getElementById("yearFilter");
const favoriteFilter = document.getElementById("favoriteFilter");
const missionNameInput = document.getElementById("missionName");
const missionAgencyInput = document.getElementById("missionAgency");
const missionObjectiveInput = document.getElementById("missionObjective");
const missionDateInput = document.getElementById("missionDate");
const missionImageInput = document.getElementById("missionImage");
const addBtn = document.querySelector(".add-mission button");
const cancelEditBtn = document.getElementById("cancelEditBtn");
// ===============================
// State
// ===============================
let missions = [];
let editingMissionId = null;
// Save 
function saveMissions() {
  localStorage.setItem("missions", JSON.stringify(missions));
}

// ===============================
// Load JSON
// ===============================
// Try to load missions from localStorage first
const savedMissions = JSON.parse(localStorage.getItem("missions"));

if (savedMissions && savedMissions.length > 0) {
  missions = savedMissions;
  renderMissions(missions);
} else {
  fetch("MSN.json")
    .then(res => res.json())
    .then(data => {
      missions = data.map(m => ({ ...m, favorite: m.favorite || false }));
      renderMissions(missions);
      saveMissions(); // save initial data to localStorage
    })
    .catch(err => console.error("Error loading missions:", err));
}

// ===============================
// Render Missions
// ===============================
function renderMissions(list) {
  missionsContainer.innerHTML = "";
  if (list.length === 0) {
    missionsContainer.innerHTML = "<p>Pas de missions.</p>";
    return;
  }
  list.forEach(mission => {
    const card = document.createElement("div");
    card.className = "mission-card";
    card.dataset.id = mission.id;
    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h3>${mission.name}</h3>
      <p>Agency: ${mission.agency}</p>
      <p>Objective: ${mission.objective}</p>
      <p>Launch Date: ${mission.launchDate}</p>
      <div class="card-buttons">
        <button class="btn edit-btn" onclick="editMission(${mission.id})">Modifier</button>
        <button class="btn delete-btn" onclick="deleteMission(${mission.id})">Supprimer</button>
        <button class="btn favorite-btn" style="background:${mission.favorite ? 'yellow' : 'white'}">★</button>
      </div>
    `;
    missionsContainer.appendChild(card);
  });
}
// ===============================
// Add / Update Mission
// ===============================
function addOrUpdateMission() {
  const name = missionNameInput.value.trim();
  const agency = missionAgencyInput.value.trim();
  const objective = missionObjectiveInput.value.trim();
  const date = missionDateInput.value;
  const image = missionImageInput.value.trim();
  if (!name || !agency || !objective || !date || !image) return;
  if (editingMissionId) {
    // Update existing mission
    const mission = missions.find(m => m.id === editingMissionId);
    mission.name = name;
    mission.agency = agency;
    mission.objective = objective;
    mission.launchDate = date;
    mission.image = image;
    editingMissionId = null;
    addBtn.textContent = "ajouter mission";
  } else {
    // Add new mission
    const newMission = {
      id: missions.length ? missions[missions.length - 1].id + 1 : 1,
      name,
      agency,
      objective,
      launchDate: date,
      image,
      favorite: false
    };
    missions.push(newMission);
  }
  clearForm();
  renderMissions(missions);
  saveMissions();
  cancelEditBtn.style.display = "none";
}
addBtn.addEventListener("click", addOrUpdateMission);
// ===============================
// Clear Form
// ===============================
function clearForm() {
  missionNameInput.value = "";
  missionAgencyInput.value = "";
  missionObjectiveInput.value = "";
  missionDateInput.value = "";
  missionImageInput.value = "";
}
// ===============================
// Edit Mission
// ===============================
function editMission(id) {
  const mission = missions.find(m => m.id === id);
  missionNameInput.value = mission.name;
  missionAgencyInput.value = mission.agency;
  missionObjectiveInput.value = mission.objective;
  missionDateInput.value = mission.launchDate;
  missionImageInput.value = mission.image;
  editingMissionId = id;
  addBtn.textContent = "Save Mission";
  cancelEditBtn.style.display = "inline-block";
}
// Cancel Edit
cancelEditBtn.addEventListener("click", () => {
  clearForm();
  editingMissionId = null;
  addBtn.textContent = "Add Mission";
  cancelEditBtn.style.display = "none";
});
// ===============================
// Delete Mission
// ===============================
function deleteMission(id) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) return;
  missions = missions.filter(m => m.id !== id);
  renderMissions(missions);
  saveMissions();

}
// ===============================
// Favorite Button
// ===============================
missionsContainer.addEventListener("click", e => {
  if (e.target.classList.contains("favorite-btn")) {
    const card = e.target.closest(".mission-card");
    const id = parseInt(card.dataset.id);
    const mission = missions.find(m => m.id === id);
    mission.favorite = !mission.favorite;
    e.target.style.background = mission.favorite ? "yellow" : "white";
    saveMissions(); // ✅ add this line
  }
});

// ===============================
// Filter / Search
// ===============================
function filterMissions() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedAgency = agencyFilter.value;
  const enteredYear = yearFilter.value.trim();
  const favoriteValue = favoriteFilter.value;
  const filtered = missions.filter(mission => {
    const missionYear = mission.launchDate.substring(0, 4);
    const matchSearch =
      mission.name.toLowerCase().includes(query) ||
      mission.agency.toLowerCase().includes(query) ||
      mission.objective.toLowerCase().includes(query);
    const matchAgency =
      selectedAgency === "all" ||
      mission.agency
        .split("/")
        .some(a => a.trim().toLowerCase() === selectedAgency.toLowerCase());
    const matchYear = !enteredYear || missionYear === enteredYear;
    const matchFavorite =
      favoriteValue === "all" || (favoriteValue === "favorite" && mission.favorite);

    return matchSearch && matchAgency && matchYear && matchFavorite;
  });
  renderMissions(filtered);
}
function resetMissions() {
  localStorage.removeItem("missions");
  location.reload();
}

// ===============================
// Event Listeners
// ===============================
searchInput.addEventListener("input", filterMissions);
agencyFilter.addEventListener("change", filterMissions);
yearFilter.addEventListener("input", filterMissions);
favoriteFilter.addEventListener("change", filterMissions);
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesPanelContainer = document.getElementById("favorites-panel-container");
let panelOpen = false;
showFavoritesBtn.addEventListener("click", () => {
  panelOpen = !panelOpen;
  if (panelOpen) {
    const favoriteMissions = missions.filter(m => m.favorite); // get only favorite missions
    renderFavorites(favoriteMissions);
    favoritesPanel.style.display = "block"; // show small page
  } else {
    favoritesPanel.style.display = "none"; // hide small page
  }
});
function renderFavorites(list) {
  favoritesPanelContainer.innerHTML = ""; // clear panel
  if (list.length === 0) {
    favoritesPanelContainer.innerHTML = "<p>Pas de missions.</p>";
    return;
  }
  list.forEach(mission => {
    const card = document.createElement("div");
    card.className = "mission-card";
    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h3>${mission.name}</h3>
      <p>Agency: ${mission.agency}</p>
      <p>Objective: ${mission.objective}</p>
      <p>Launch Date: ${mission.launchDate}</p>
    `;
    favoritesPanelContainer.appendChild(card);
  });
}
