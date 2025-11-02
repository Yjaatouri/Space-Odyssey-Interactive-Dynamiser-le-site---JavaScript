// Fetch the JSON file
fetch('MSN.json')
  .then(response => {
    if (!response.ok) throw new Error('Network response was not OK');
    return response.json();
  })
  .then(missions => displayMissions(missions))
  .catch(error => console.error('Fetch error:', error));

// Function to display missions
function displayMissions(missions) {
  const container = document.getElementById('missions-container');
  container.innerHTML = ''; // Clear previous content if any

  missions.forEach(mission => {
    const card = document.createElement('div');
    card.className = 'mission-card';

    card.innerHTML = `
      <img src="${mission.image}" alt="${mission.name}">
      <div class="mission-content">
        <h3 class="mission-title">${mission.name}</h3>
        <div class="mission-org">🚀 ${mission.agency}</div>
        <p class="mission-desc">${mission.objective}</p>
        <div class="mission-date">📅 ${mission.launchDate}</div>
      </div>
    `;

    container.appendChild(card);
  });
}
