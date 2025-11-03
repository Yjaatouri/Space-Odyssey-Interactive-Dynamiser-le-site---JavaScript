// Elements
const missionsContainer = document.getElementById("missions-container");
const searchInput = document.getElementById("searchInput");
const agencyFilter = document.getElementById("agencyFilter");
const yearFilter = document.getElementById("yearFilter");

const missionNameInput = document.getElementById("missionName");
const missionAgencyInput = document.getElementById("missionAgency");
const missionObjectiveInput = document.getElementById("missionObjective");
const missionDateInput = document.getElementById("missionDate");
const missionImageInput = document.getElementById("missionImage");
const addBtn = document.querySelector(".add-mission button");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let missions = []; // all missions
let editingMissionId = null; // track edit

// Load JSON
fetch("MSN.json")
  .then((res) => res.json())
  .then((data) => {
    missions = data;
    renderMissions(missions);
  });

// Render missions (all or filtered)
function renderMissions(list) {
  missionsContainer.innerHTML = "";
  if (list.length === 0) {
    missionsContainer.innerHTML = "<p>No missions found.</p>";
    return;
  }
  list.forEach((mission) => {
    const card = document.createElement("div");
    card.className = "mission-card";
    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <h3>${mission.name}</h3>
      <p>Agency: ${mission.agency}</p>
      <p>Objective: ${mission.objective}</p>
      <p>Launch Date: ${mission.launchDate}</p>
      <button class="btn edit-btn" onclick="editMission(${mission.id})">Edit</button>
      <button class="btn delete-btn" onclick="deleteMission(${mission.id})">Delete</button>
    `;
    missionsContainer.appendChild(card);
  });
}

// Add / Update mission
function addOrUpdateMission() {
  const name = missionNameInput.value.trim();
  const agency = missionAgencyInput.value.trim();
  const objective = missionObjectiveInput.value.trim();
  const date = missionDateInput.value;
  const image = missionImageInput.value.trim();

  if (!name || !agency || !objective || !date || !image) return;

  if (editingMissionId) {
    const mission = missions.find((m) => m.id === editingMissionId);
    mission.name = name;
    mission.agency = agency;
    mission.objective = objective;
    mission.launchDate = date;
    mission.image = image;
    editingMissionId = null;
    addBtn.textContent = "Add Mission";
  } else {
    const newMission = {
      id: missions.length ? missions[missions.length - 1].id + 1 : 1,
      name,
      agency,
      objective,
      launchDate: date,
      image,
    };
    missions.push(newMission);
  }

  clearForm();
  renderMissions(missions);
  cancelEditBtn.style.display = "none"; // hide cancel button after add/update
}

addBtn.addEventListener("click", addOrUpdateMission);

// Clear form
function clearForm() {
  missionNameInput.value = "";
  missionAgencyInput.value = "";
  missionObjectiveInput.value = "";
  missionDateInput.value = "";
  missionImageInput.value = "";
}

// Edit mission
function editMission(id) {
  const mission = missions.find((m) => m.id === id);
  missionNameInput.value = mission.name;
  missionAgencyInput.value = mission.agency;
  missionObjectiveInput.value = mission.objective;
  missionDateInput.value = mission.launchDate;
  missionImageInput.value = mission.image;

  editingMissionId = id;
  addBtn.textContent = "Save Mission";
  cancelEditBtn.style.display = "inline-block"; // show cancel button
}

// Cancel edit
cancelEditBtn.addEventListener("click", () => {
  clearForm();
  editingMissionId = null;
  addBtn.textContent = "Add Mission";
  cancelEditBtn.style.display = "none";
});

// Delete mission
function deleteMission(id) {
  const confirmDelete = confirm(
    "Êtes-vous sûr de vouloir supprimer cette mission ?"
  );
  if (!confirmDelete) return;

  missions = missions.filter((m) => m.id !== id);
  renderMissions(missions);
}

// Filter / Search
function filterMissions() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedAgency = agencyFilter.value;
  const enteredYear = yearFilter.value.trim();

  const filtered = missions.filter((mission) => {
    const missionYear = mission.launchDate.substring(0, 4);
    const matchSearch =
      mission.name.toLowerCase().includes(query) ||
      mission.agency.toLowerCase().includes(query) ||
      mission.objective.toLowerCase().includes(query);
    const matchAgency =
      selectedAgency === "all" ||
      mission.agency
        .split("/")
        .some((a) => a.trim().toLowerCase() === selectedAgency.toLowerCase());
    const matchYear = !enteredYear || missionYear === enteredYear;
    return matchSearch && matchAgency && matchYear;
  });

  renderMissions(filtered);
}

searchInput.addEventListener("input", filterMissions);
agencyFilter.addEventListener("change", filterMissions);
yearFilter.addEventListener("input", filterMissions);

