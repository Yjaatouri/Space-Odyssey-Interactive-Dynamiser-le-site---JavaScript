const missionsSection = document.querySelector(".missions-section");
const searchInput = document.getElementById("searchInput");
const agencyFilter = document.getElementById("agencyFilter");
const yearFilter = document.getElementById("yearFilter");

let allMissions = [];

// 🛰️ Fetch missions
fetch("MSN.json")
  .then((response) => response.json())
  .then((data) => {
    allMissions = data;
    displayMissions(allMissions);
  })
  .catch((error) => console.error("Error loading missions:", error));

// 💡 Display missions
function displayMissions(missions) {
  missionsSection.innerHTML = "";

  if (missions.length === 0) {
    missionsSection.innerHTML = "<p>No missions found.</p>";
    return;
  }

  missions.forEach((mission) => {
    const card = document.createElement("div");
    card.classList.add("mission-card");
    card.innerHTML = `
    <img src="${mission.image}" alt="${mission.name}">
      <h3>${mission.name}</h3>
      <p><strong>Agency:</strong> ${mission.agency}</p>
      <p><strong>Objective:</strong> ${mission.objective}</p>
      <p><strong>Launch:</strong> ${mission.launchDate}</p>
    `;
    missionsSection.appendChild(card);
  });
}

// 🧠 Filter + Search Logic
function filterMissions() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedAgency = agencyFilter.value;
  const enteredYear = yearFilter.value.trim();

  const filtered = allMissions.filter((mission) => {
    const missionYear = parseInt(mission.launchDate.substring(0, 4));
    const matchSearch =
      mission.name.toLowerCase().includes(query) ||
      mission.agency.toLowerCase().includes(query) ||
      mission.objective.toLowerCase().includes(query);
    const matchAgency =
      selectedAgency === "all" ||
      mission.agency.toLowerCase().includes(selectedAgency.toLowerCase());

const matchYear =
  enteredYear === "" || missionYear === parseInt(enteredYear);


    return matchSearch && matchAgency && matchYear;
  });

  displayMissions(filtered);
}

// Event Listeners
searchInput.addEventListener("input", filterMissions);
agencyFilter.addEventListener("change", filterMissions);
yearFilter.addEventListener("input", filterMissions);
const missionsContainer = document.getElementById("missions-container");
missionsContainer.innerHTML = ""; // not missionsSection

missions.forEach((mission) => {
  const card = document.createElement("div");
  card.classList.add("mission-card");
  card.innerHTML = `
    <h3>${mission.name}</h3>
    <p><strong>Agency:</strong> ${mission.agency}</p>
    <p><strong>Objective:</strong> ${mission.objective}</p>
    <p><strong>Launch:</strong> ${mission.launchDate}</p>
  `;
  missionsContainer.appendChild(card);
});

