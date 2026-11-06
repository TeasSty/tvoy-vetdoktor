(() => {
  const BRANCHES = {
    pryad: {
      label: "Прядильщиков, 2",
      phone: "+7 (929) 123-96-75",
      tel: "tel:+79291239675",
      hours: "Пн–Пт 09:00–20:00 · Сб–Вс 10:00–17:00",
    },
    sever: {
      label: "Северная, 34",
      phone: "+7 (8172) 70-06-45",
      tel: "tel:+78172700645",
      hours: "Пн–Пт 09:00–20:00 · Сб–Вс 10:00–17:00",
    },
  };

  const desk = document.querySelector(".desk");
  const branchButtons = [...document.querySelectorAll(".branch-switch__btn")];
  const phoneLinks = [...document.querySelectorAll("[data-phone]")];
  const hoursNode = document.querySelector("[data-hours]");
  const activeBranchNode = document.querySelector("[data-active-branch]");
  const formBranch = document.querySelector("#form-branch");
  const formDoctor = document.querySelector("#form-doctor");
  const doors = [...document.querySelectorAll(".door")];

  function setBranch(key) {
    const branch = BRANCHES[key];
    if (!branch) return;

    desk?.setAttribute("data-branch", key);

    branchButtons.forEach((btn) => {
      const active = btn.dataset.branch === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    phoneLinks.forEach((link) => {
      link.href = branch.tel;
      if (!link.querySelector("*")) {
        link.textContent = branch.phone;
      }
    });

    if (hoursNode) hoursNode.textContent = branch.hours;
    if (activeBranchNode) activeBranchNode.textContent = branch.label;
    if (formBranch) formBranch.value = key;

    doors.forEach((door) => {
      door.classList.toggle("is-active", door.dataset.door === key);
    });

    try {
      localStorage.setItem("vetdoktor-branch", key);
    } catch (_) {
      /* ignore */
    }
  }

  branchButtons.forEach((btn) => {
    btn.addEventListener("click", () => setBranch(btn.dataset.branch));
  });

  document.querySelectorAll("[data-set-branch]").forEach((btn) => {
    btn.addEventListener("click", () => setBranch(btn.dataset.setBranch));
  });

  let saved = "pryad";
  try {
    saved = localStorage.getItem("vetdoktor-branch") || "pryad";
  } catch (_) {
    /* ignore */
  }
  setBranch(saved);

  document.querySelectorAll("[data-doctor]").forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.dataset.doctor;
      window.setTimeout(() => {
        document.querySelectorAll(".doc").forEach((doc) => {
          doc.classList.toggle("is-focus", doc.id === id);
        });
      }, 50);
    });
  });

  document.querySelectorAll("[data-prefill]").forEach((link) => {
    link.addEventListener("click", () => {
      if (formDoctor) formDoctor.value = link.dataset.prefill || "";
    });
  });

  document.querySelectorAll(".case").forEach((caseEl) => {
    const toggle = caseEl.querySelector(".case__toggle");
    toggle?.addEventListener("click", () => {
      const open = !caseEl.classList.contains("is-open");
      document.querySelectorAll(".case").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".case__toggle")?.setAttribute("aria-expanded", "false");
      });
      caseEl.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  const form = document.querySelector("#booking-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const prev = JSON.parse(localStorage.getItem("vetdoktor-requests") || "[]");
      prev.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem("vetdoktor-requests", JSON.stringify(prev));
    } catch (_) {
      /* ignore */
    }
    const ok = form.querySelector(".form__ok");
    if (ok) ok.hidden = false;
    form.reset();
    if (formBranch) formBranch.value = desk?.getAttribute("data-branch") || "pryad";
  });
})();
