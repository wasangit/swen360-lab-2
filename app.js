// Utility: days between (UTC, day granularity)
function daysUntil(futureDate) {
  const today = new Date();
  const d1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const d2 = Date.UTC(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((d2 - d1) / msPerDay);
}

document.addEventListener("DOMContentLoaded", () => {
  const missionNameEl = document.getElementById("missionName");
  const launchDateEl  = document.getElementById("launchDate");
  const form          = document.getElementById("countdownForm");
  const output        = document.getElementById("output");
  const errorEl       = document.getElementById("error");
  const clearBtn      = document.getElementById("clearSaved");

  // Set min date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  launchDateEl.min = `${yyyy}-${mm}-${dd}`;

  // Load saved (if present)
  const saved = JSON.parse(localStorage.getItem("missionCountdown") || "null");
  if (saved?.name && saved?.date) {
    missionNameEl.value = saved.name;
    launchDateEl.value = saved.date;
    clearBtn.hidden = false;
    renderResult();
  }
  //for the purpose of a commit... 
// app.js
function showError(msg) {
  document.getElementById("error").textContent = msg;
}

  function showError(msg) {
    errorEl.textContent = msg || "";
  }

  function renderResult() {
    showError("");
    const name = missionNameEl.value.trim();
    const dateStr = launchDateEl.value;

    // Basic validation
    if (!name) {
      missionNameEl.classList.add("invalid");
      showError("Please enter a mission name.");
      output.textContent = "";
      return;
    } else {
      missionNameEl.classList.remove("invalid");
    }

    if (!dateStr) {
      launchDateEl.classList.add("invalid");
      showError("Please pick a launch date.");
      output.textContent = "";
      return;
    } else {
      launchDateEl.classList.remove("invalid");
    }

    const target = new Date(dateStr);
    const diff = daysUntil(target);

    if (diff < 0) {
      launchDateEl.classList.add("invalid");
      showError("Launch date must be today or in the future.");
      output.textContent = "";
      return;
    }

    launchDateEl.classList.remove("invalid");
    if (diff === 0) {
      output.textContent = `Today is launch day for ${name}!`;
    } else {
      output.textContent = `${diff} day${diff !== 1 ? "s" : ""} left until ${name}.`;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderResult();

    // Save if valid
    if (!errorEl.textContent) {
      const payload = {
        name: missionNameEl.value.trim(),
        date: launchDateEl.value
      };
      localStorage.setItem("missionCountdown", JSON.stringify(payload));
      clearBtn.hidden = false;
    }
  });

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("missionCountdown");
    clearBtn.hidden = true;
  });
});
