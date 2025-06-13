const API_URL = 'https://choretracker-api.onrender.com';

async function fetchChores() {
  const response = await fetch(`${API_URL}/chores`);
  const chores = await response.json();
  renderChores(chores);
}

function calculateStatus(chore) {
  const lastDone = new Date(chore.last_done);
  const today = new Date();
  const nextDue = new Date(lastDone);
  nextDue.setDate(lastDone.getDate() + chore.frequency_days);

  const timeDiff = nextDue - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { status: 'overdue', days: Math.abs(daysLeft) };
  if (daysLeft === 0) return { status: 'due', days: 0 };
  return { status: 'upcoming', days: daysLeft };
}

function renderChores(chores) {
  const todayList = document.getElementById("today-list");
  const upcomingList = document.getElementById("upcoming-list");
  const allList = document.getElementById("all-list");

  todayList.innerHTML = '';
  upcomingList.innerHTML = '';
  allList.innerHTML = '';

  chores.forEach(chore => {
    const { status, days } = calculateStatus(chore);

    const li = document.createElement("li");
    li.className = `list-group-item ${status}`;
    let statusText = '';

    if (status === 'overdue') statusText = `Overdue by ${days} day${days !== 1 ? 's' : ''}`;
    else if (status === 'due') statusText = `Due today`;
    else statusText = `Due in ${days} day${days !== 1 ? 's' : ''}`;

    li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <strong>${chore.name}</strong><br/>
          <small class="text-muted">${statusText}</small>
        </div>
        <button class="btn btn-sm btn-outline-success" onclick="markDone(${chore.id})">Mark Done</button>
      </div>
    `;

    allList.appendChild(li.cloneNode(true));
    if (status === 'overdue' || status === 'due') {
      todayList.appendChild(li.cloneNode(true));
    } else {
      upcomingList.appendChild(li.cloneNode(true));
    }
  });
}

async function markDone(id) {
  await fetch(`${API_URL}/chores/${id}/mark-done`, { method: 'POST' });
  fetchChores(); // refresh display
}

fetchChores();
