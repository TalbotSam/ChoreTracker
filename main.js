// Dummy chores for now
const chores = [
    {
        id: 1,
        name: "Change cat litter",
        frequencyDays: 5,
        lastDone: "2025-06-08"
    },
    {
        id: 2,
        name: "Change bed sheets",
        frequencyDays: 14,
        lastDone: "2025-06-01"
    },
    ];

    function daysSince(dateStr) {
        const last = new Date(dateStr);
        const now = new Date();
        return Math.floor((now - last) / (1000 * 60 * 60 * 24));
    }

    function getNextDue(chore) {
        return new Date(new Date(chore.lastDone).getTime() + chore.frequencyDays * 86400000);
    }

    function render() {
        const todayList = document.getElementById("today-list");
        const upcomingList = document.getElementById("upcoming-list");
        const allList = document.getElementById("all-list");

    chores.forEach(chore => {
        const nextDue = getNextDue(chore);
        const daysLeft = daysSince(chore.lastDone) - chore.frequencyDays;

        const li = document.createElement("li");
    li.innerHTML = `
        <span>${chore.name} (Due: ${nextDue.toDateString()})</span>
        <button onclick="markDone(${chore.id})">Mark Done</button>
    `;

        allList.appendChild(li);

        if (daysLeft >= 0) {
            todayList.appendChild(li.cloneNode(true));
    } else if (daysLeft >= -2) {
        upcomingList.appendChild(li.cloneNode(true));
    }
    });
    }

    function markDone(id) {
        const chore = chores.find(c => c.id === id);
        chore.lastDone = new Date().toISOString().split("T")[0];
    location.reload(); // quick hack for demo
    }

render();
