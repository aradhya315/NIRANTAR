
const defaultTasks = [
  {
    id: "water",
    title: "Check drinking water supplies",
    description: "Confirm that safe drinking water is available for your household."
  },
  {
    id: "first-aid",
    title: "Prepare a first-aid kit",
    description: "Check basic supplies and the expiry dates of stored items."
  },
  {
    id: "contacts",
    title: "Record important contacts",
    description: "Keep essential contact numbers available offline."
  },
  {
    id: "documents",
    title: "Identify essential documents",
    description: "Know where important identification and insurance records are kept."
  },
  {
    id: "power",
    title: "Check backup lighting and power",
    description: "Check a flashlight, batteries, or a charged power bank."
  },
  {
    id: "plan",
    title: "Discuss a household emergency plan",
    description: "Agree on how household members will communicate and reunite."
  }
];

const STORAGE_KEY = "nirantar-checklist-v1";

const checklistElement = document.getElementById("checklist");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");
const completedCountElement = document.getElementById("completed-count");
const taskSummaryElement = document.getElementById("task-summary");
const itemCountElement = document.getElementById("item-count");

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return defaultTasks.map(task => ({ ...task, completed: false }));
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid saved checklist");
    }

    return defaultTasks.map(task => {
      const previous = parsed.find(item => item.id === task.id);

      return {
        ...task,
        completed: previous?.completed === true
      };
    });
  } catch (error) {
    console.warn("Could not load the saved checklist:", error);
    return defaultTasks.map(task => ({ ...task, completed: false }));
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Could not save checklist:", error);
    return false;
  }
}

function renderChecklist() {
  checklistElement.replaceChildren();

  tasks.forEach(task => {
    const label = document.createElement("label");
    label.className = `task${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", task.title);

    const content = document.createElement("span");
    const title = document.createElement("strong");
    const description = document.createElement("small");

    title.textContent = task.title;
    description.textContent = task.description;

    content.append(title, description);
    label.append(checkbox, content);
    checklistElement.append(label);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;

      const saved = saveTasks();
      renderChecklist();

      if (!saved) {
        console.warn("Your latest change may not persist after closing the browser.");
      }
    });
  });

  updateStats();
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  const score = total ? Math.round((completed / total) * 100) : 0;

  scoreElement.textContent = score;
  progressElement.style.width = `${score}%`;
  completedCountElement.textContent = completed;
  itemCountElement.textContent = `${total} items`;

  taskSummaryElement.textContent =
    completed === total
      ? "All checklist items completed"
      : `${total - completed} items remaining`;
}

document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("checklist-section").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


const overviewElements = [
  document.querySelector(".welcome"),
  document.querySelector(".stats"),
  document.querySelector(".content-grid"),
  document.querySelector(".backup-panel")
];

const personalPlanView = document.getElementById("personal-plan-view");


document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const view = button.dataset.view;
    const title = document.getElementById("page-title");

    const emergencyModeView = document.getElementById("emergency-mode-view");

    if (emergencyModeView) {
    emergencyModeView.hidden = true;
    }
    const isEmergencyView = view === "emergency";

    overviewElements.forEach(element => {
      if (element) element.hidden = isEmergencyView;
    });

    personalPlanView.hidden = !isEmergencyView;

    if (view === "checklist") {
      title.textContent = "Your readiness checklist";

      document.getElementById("checklist-section").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else if (isEmergencyView) {
      title.textContent = "Your emergency plan";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      title.textContent = "Your readiness overview";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});


renderChecklist();


if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");

      console.log(
        "NIRANTAR offline engine registered:",
        registration.scope
      );
    } catch (error) {
      console.error(
        "NIRANTAR offline engine registration failed:",
        error
      );
    }
  });
}

/* NIRANTAR: Checklist Backup and Restore */

const backupStorageKey = "nirantar-checklist-v1";

const expectedTaskIds = [
  "water",
  "first-aid",
  "contacts",
  "documents",
  "power",
  "plan"
];

const exportBackupButton = document.getElementById("export-backup");
const importBackupButton = document.getElementById("import-backup");
const backupFileInput = document.getElementById("backup-file");
const backupStatusMessage = document.getElementById("backup-status");

function showBackupStatus(message) {
  backupStatusMessage.textContent = message;
}

function validateBackupTasks(tasks) {
  if (!Array.isArray(tasks) || tasks.length !== expectedTaskIds.length) {
    throw new Error("The backup must contain all six checklist items.");
  }

  const seenIds = new Set();

  for (const task of tasks) {
    if (
      !task ||
      !expectedTaskIds.includes(task.id) ||
      typeof task.completed !== "boolean" ||
      seenIds.has(task.id)
    ) {
      throw new Error("The checklist data is invalid.");
    }

    seenIds.add(task.id);
  }

  if (seenIds.size !== expectedTaskIds.length) {
    throw new Error("One or more checklist items are missing.");
  }

  return tasks;
}

exportBackupButton.addEventListener("click", () => {
  try {
    const savedData = localStorage.getItem(backupStorageKey);

    if (!savedData) {
      throw new Error("No saved checklist data was found.");
    }

    const tasks = validateBackupTasks(JSON.parse(savedData));

   
    const savedPlan = localStorage.getItem("nirantar-personal-plan-v1");

    const backup = {
    app: "NIRANTAR",
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    checklist: tasks,
    personalPlan: savedPlan ? JSON.parse(savedPlan) : null
    };


    const file = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "nirantar-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    showBackupStatus("Backup downloaded successfully.");
  } catch (error) {
    showBackupStatus(error.message || "Backup export failed.");
  }
});

importBackupButton.addEventListener("click", () => {
  backupFileInput.click();
});


  

/* NIRANTAR: Safe Backup Restoration */
backupFileInput.addEventListener("change", async () => {
  const file = backupFileInput.files?.[0];
  if (!file) return;

  const planKey = "nirantar-personal-plan-v1";
  const allowedSupplies = [
    "water", "first-aid", "flashlight",
    "power-bank", "documents", "medicines"
  ];

  try {
    if (file.size > 1024 * 1024) {
      throw new Error("Backup file exceeds the 1 MB limit.");
    }

    const backup = JSON.parse(await file.text());

    if (
      !backup ||
      typeof backup !== "object" ||
      Array.isArray(backup) ||
      backup.app !== "NIRANTAR" ||
      ![1, 2].includes(backup.schemaVersion)
    ) {
      throw new Error("Unsupported or invalid NIRANTAR backup.");
    }

    // Validate all checklist items first.
    const tasks = validateBackupTasks(backup.checklist);

    for (const task of tasks) {
      if (
        typeof task.title !== "string" ||
        typeof task.description !== "string"
      ) {
        throw new Error("Checklist details are invalid.");
      }
    }

    // Validate the personal plan before changing saved data.
    let restoredPlan = null;

    if (backup.schemaVersion === 2) {
      const plan = backup.personalPlan;

      if (plan !== null) {
        if (
          !plan ||
          typeof plan !== "object" ||
          Array.isArray(plan) ||
          typeof plan.contactName !== "string" ||
          typeof plan.relationship !== "string" ||
          typeof plan.phone !== "string" ||
          typeof plan.notes !== "string" ||
          !Array.isArray(plan.supplies) ||
          !plan.supplies.every(item => allowedSupplies.includes(item)) ||
          new Set(plan.supplies).size !== plan.supplies.length ||
          (
            plan.updatedAt !== undefined &&
            typeof plan.updatedAt !== "string"
          )
        ) {
          throw new Error("The personal plan in this backup is invalid.");
        }

        restoredPlan = plan;
      }
    }

    const confirmed = window.confirm(
      "Restore this backup? Your checklist will be replaced." +
      (backup.schemaVersion === 2
        ? " Your personal emergency plan will also be updated."
        : " Your existing personal plan will be kept.") +
      "\n\nContinue?"
    );

    if (!confirmed) {
      showBackupStatus("Restore cancelled. Your data was not changed.");
      return;
    }

    // Capture existing values before making changes.
    const oldChecklist = localStorage.getItem(backupStorageKey);
    const oldPlan = localStorage.getItem(planKey);

    try {
      localStorage.setItem(backupStorageKey, JSON.stringify(tasks));

      if (backup.schemaVersion === 2) {
        if (restoredPlan === null) {
          localStorage.removeItem(planKey);
        } else {
          localStorage.setItem(planKey, JSON.stringify(restoredPlan));
        }
      }
    } catch (saveError) {
      // Attempt to restore the original values if saving fails.
      try {
        if (oldChecklist === null) {
          localStorage.removeItem(backupStorageKey);
        } else {
          localStorage.setItem(backupStorageKey, oldChecklist);
        }

        if (oldPlan === null) {
          localStorage.removeItem(planKey);
        } else {
          localStorage.setItem(planKey, oldPlan);
        }
      } catch (rollbackError) {
        console.error("NIRANTAR rollback failed:", rollbackError);
        throw new Error(
          "Restore and rollback both failed. Check your saved data."
        );
      }

      throw new Error(
        "Restore failed. The app attempted to recover your previous data."
      );
    }

    showBackupStatus("Backup restored successfully. Reloading...");
    window.location.reload();

  } catch (error) {
    console.error("NIRANTAR restore error:", error);
    showBackupStatus(error.message || "Backup restoration failed.");
  } finally {
    backupFileInput.value = "";
  }
});



/* NIRANTAR: Personal Emergency Plan storage */

const PERSONAL_PLAN_KEY = "nirantar-personal-plan-v1";

const personalPlanForm = document.getElementById("personal-plan-form");
const planStatus = document.getElementById("plan-status");

function loadPersonalPlan() {
  try {
    const saved = localStorage.getItem(PERSONAL_PLAN_KEY);
    if (!saved) return;

    const plan = JSON.parse(saved);

    document.getElementById("contact-name").value =
      typeof plan.contactName === "string" ? plan.contactName : "";

    document.getElementById("contact-relationship").value =
      typeof plan.relationship === "string" ? plan.relationship : "";

    document.getElementById("contact-phone").value =
      typeof plan.phone === "string" ? plan.phone : "";

    document.getElementById("plan-notes").value =
      typeof plan.notes === "string" ? plan.notes : "";

    const supplies = Array.isArray(plan.supplies) ? plan.supplies : [];

    document.querySelectorAll('input[name="supply"]').forEach(input => {
      input.checked = supplies.includes(input.value);
    });
  } catch (error) {
    console.error("Could not load the personal plan:", error);
    planStatus.textContent = "Saved plan could not be loaded.";
  }
}

personalPlanForm.addEventListener("submit", event => {
  event.preventDefault();

  const plan = {
    contactName: document.getElementById("contact-name").value.trim(),
    relationship: document.getElementById("contact-relationship").value.trim(),
    phone: document.getElementById("contact-phone").value.trim(),
    supplies: [...document.querySelectorAll('input[name="supply"]:checked')]
      .map(input => input.value),
    notes: document.getElementById("plan-notes").value,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(PERSONAL_PLAN_KEY, JSON.stringify(plan));
    planStatus.textContent = "Emergency plan saved on this device.";
  } catch (error) {
    console.error("Could not save the personal plan:", error);
    planStatus.textContent =
      "Could not save. Browser storage may be unavailable or full.";
  }
});

loadPersonalPlan();



/* NIRANTAR: Print Emergency Plan */
const printPlanButton = document.getElementById("print-plan");

printPlanButton.addEventListener("click", () => {
  loadPersonalPlan();
  window.print();
});


/* NIRANTAR: Emergency Mode */
const openEmergencyButton = document.getElementById("open-emergency-mode");
const exitEmergencyButton = document.getElementById("exit-emergency-mode");
const emergencyModeScreen = document.getElementById("emergency-mode-view");

function refreshEmergencyMode() {
  const contactName = document.getElementById("emergency-contact-name");
  const relationship = document.getElementById("emergency-contact-relationship");
  const phoneLink = document.getElementById("emergency-contact-phone");
  const missingContact = document.getElementById("emergency-contact-missing");
  const suppliesList = document.getElementById("emergency-supplies");
  const notes = document.getElementById("emergency-notes");

  let plan = null;

  try {
    const saved = localStorage.getItem("nirantar-personal-plan-v1");
    plan = saved ? JSON.parse(saved) : null;

    if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
      plan = null;
    }
  } catch (error) {
    console.error("Could not read the saved emergency plan:", error);
  }

  const name = typeof plan?.contactName === "string"
    ? plan.contactName.trim()
    : "";

  const relation = typeof plan?.relationship === "string"
    ? plan.relationship.trim()
    : "";

  const phone = typeof plan?.phone === "string"
    ? plan.phone.trim()
    : "";

  contactName.textContent = name || "No contact saved yet.";
  relationship.textContent = relation ? `Relationship: ${relation}` : "";

  const safePhone = phone.replace(/[^\d+*#,;]/g, "");

  if (safePhone && /[0-9]/.test(safePhone)) {
    phoneLink.href = `tel:${safePhone}`;
    phoneLink.hidden = false;
    phoneLink.textContent = `Call ${name || "saved contact"} · ${phone}`;
  } else {
    phoneLink.removeAttribute("href");
    phoneLink.hidden = true;
  }

  missingContact.hidden = Boolean(name && safePhone);

  const supplyNames = {
    water: "Drinking water",
    "first-aid": "First-aid kit",
    flashlight: "Flashlight and batteries",
    "power-bank": "Charged power bank",
    documents: "Essential documents identified",
    medicines: "Necessary medicines"
  };

  suppliesList.replaceChildren();

  const preparedSupplies = Array.isArray(plan?.supplies)
    ? [...new Set(plan.supplies)].filter(item =>
        Object.prototype.hasOwnProperty.call(supplyNames, item)
      )
    : [];

  if (preparedSupplies.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No supplies marked as prepared yet.";
    suppliesList.appendChild(item);
  } else {
    preparedSupplies.forEach(supply => {
      const item = document.createElement("li");
      item.textContent = `✓ ${supplyNames[supply]}`;
      suppliesList.appendChild(item);
    });
  }

  notes.textContent =
    typeof plan?.notes === "string" && plan.notes.trim()
      ? plan.notes
      : "No instructions saved yet.";
}

function showEmergencyMode() {
  document.querySelectorAll(".welcome, .stats, .content-grid, .backup-panel")
    .forEach(section => {
      section.hidden = true;
    });

  const personalPlan = document.getElementById("personal-plan-view");
  if (personalPlan) personalPlan.hidden = true;

  emergencyModeScreen.hidden = false;
  refreshEmergencyMode();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function closeEmergencyMode() {
  emergencyModeScreen.hidden = true;

  document.querySelectorAll(".welcome, .stats, .content-grid, .backup-panel")
    .forEach(section => {
      section.hidden = false;
    });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

openEmergencyButton.addEventListener("click", showEmergencyMode);
exitEmergencyButton.addEventListener("click", closeEmergencyMode);


/* NIRANTAR: Offline Emergency Guides */
const guideData = [
  {
    id: "fire",
    category: "Fire safety",
    title: "Fire and evacuation",
    summary: "What to do if a fire starts nearby or inside a building.",
    intro: "Prioritise getting people to safety over saving belongings.",
    steps: [
      "Warn people nearby and activate the building alarm if it is safe to do so.",
      "Leave by a safe exit. Do not use elevators during a fire.",
      "If there is smoke, stay low while moving toward a safe exit.",
      "If a door feels hot or smoke blocks the route, do not open or enter that route. Seek another safe exit or follow emergency responders' instructions.",
      "Once outside, move away from the building and call local emergency services.",
      "Do not re-enter until authorities say it is safe."
    ]
  },
  {
    id: "power",
    category: "Power outage",
    title: "Power outage",
    summary: "Stay safer when electricity is unavailable.",
    intro: "Use lighting and backup power carefully, and prepare for an extended outage.",
    steps: [
      "Use a flashlight or battery-powered lamp where possible. Avoid using candles.",
      "Unplug sensitive electronics if appropriate, and keep refrigerator and freezer doors closed.",
      "Use generators only outdoors, well away from doors, windows, and vents. Never run one indoors, in a garage, or in an enclosed space.",
      "Never use a gas stove, charcoal burner, or outdoor grill to heat an indoor space.",
      "Keep phones and power banks available for essential communication.",
      "If you see fallen power lines, stay far away and report them to the utility or authorities."
    ]
  },
  {
    id: "weather",
    category: "Severe weather and flooding",
    title: "Severe weather and flooding",
    summary: "Prepare for dangerous rain, strong winds, and rising water.",
    intro: "Monitor official warnings and move early when authorities advise evacuation.",
    steps: [
      "Follow official weather alerts and evacuation instructions.",
      "Bring people, essential medicines, and important items to a safer place before conditions worsen, if it is safe to do so.",
      "Move to higher ground if flooding threatens. Do not enter floodwater.",
      "Never walk, swim, or drive through floodwater. It can hide hazards and move people or vehicles.",
      "Stay away from damaged buildings, unstable trees, and fallen power lines.",
      "If trapped by rising water, contact emergency services and communicate your location if possible."
    ]
  },
  {
    id: "first-aid",
    category: "First-aid basics",
    title: "First-aid basics",
    summary: "Initial steps while getting appropriate medical help.",
    intro: "Check that the scene is safe before approaching anyone who is injured.",
    steps: [
      "Make sure you are not exposed to fire, traffic, electricity, smoke, or other immediate hazards.",
      "Call local emergency medical services for serious injuries, severe bleeding, breathing problems, unconsciousness, or other life-threatening conditions.",
      "For severe external bleeding, apply firm, continuous direct pressure with clean cloth or gauze if available. Follow emergency dispatcher instructions.",
      "If someone is unresponsive and not breathing normally, call for emergency help and follow the dispatcher's CPR instructions. Use an automated external defibrillator if available and follow its prompts.",
      "Do not move someone with a possible serious head, neck, or spine injury unless remaining there poses immediate danger.",
      "Do not give food, drink, or medication to an unconscious person. Seek professional guidance."
    ]
  },
  {
    id: "emergency-call",
    category: "Getting help",
    title: "Contacting emergency services",
    summary: "Prepare useful information before and during an emergency call.",
    intro: "Use your local emergency number. Keep the line available for the dispatcher.",
    steps: [
      "State the location or address as clearly as possible, including nearby landmarks if helpful.",
      "Explain what happened, what danger remains, and whether anyone is injured or needs urgent assistance.",
      "Give the number of people affected and any known immediate hazards.",
      "Answer the dispatcher's questions, follow instructions, and do not hang up until told to do so.",
      "If you cannot call, ask someone nearby to call or use another available official emergency communication method.",
      "Keep emergency contacts written down in case your phone battery runs low."
    ]
  }
];

const openGuidesButton = document.getElementById("open-emergency-guides");
const closeGuidesButton = document.getElementById("close-emergency-guides");
const guideSearchInput = document.getElementById("guide-search");
const guideListElement = document.getElementById("guide-list");
const guideDetailElement = document.getElementById("guide-detail");
const backToGuidesButton = document.getElementById("back-to-guides");

function renderGuideList() {
  const query = guideSearchInput.value.trim().toLowerCase();

  const matchingGuides = guideData.filter(guide =>
    [guide.title, guide.category, guide.summary, guide.intro, ...guide.steps]
      .join(" ")
      .toLowerCase()
      .includes(query)
  );

  guideListElement.replaceChildren();
  guideDetailElement.hidden = true;
  guideListElement.hidden = false;

  if (matchingGuides.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No matching guides. Try a different search.";
    guideListElement.appendChild(message);
    return;
  }

  matchingGuides.forEach(guide => {
    const card = document.createElement("article");
    card.className = "guide-card";

    const category = document.createElement("p");
    category.className = "eyebrow";
    category.textContent = guide.category;

    const heading = document.createElement("h3");
    heading.textContent = guide.title;

    const summary = document.createElement("p");
    summary.textContent = guide.summary;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Read guide";
    button.addEventListener("click", () => openGuideDetail(guide.id));

    card.append(category, heading, summary, button);
    guideListElement.appendChild(card);
  });
}

function openGuideDetail(guideId) {
  const guide = guideData.find(item => item.id === guideId);
  if (!guide) return;

  document.getElementById("guide-category").textContent = guide.category;
  document.getElementById("guide-title").textContent = guide.title;
  document.getElementById("guide-intro").textContent = guide.intro;

  const stepsContainer = document.getElementById("guide-steps");
  stepsContainer.replaceChildren();

  const list = document.createElement("ol");

  guide.steps.forEach(step => {
    const item = document.createElement("li");
    item.textContent = step;
    list.appendChild(item);
  });

  stepsContainer.appendChild(list);
  guideListElement.hidden = true;
  guideDetailElement.hidden = false;
  guideDetailElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showEmergencyGuides() {
  document.querySelectorAll(".welcome, .stats, .content-grid, .backup-panel")
    .forEach(section => {
      section.hidden = true;
    });

  const personalPlan = document.getElementById("personal-plan-view");
  const emergencyMode = document.getElementById("emergency-mode-view");

  if (personalPlan) personalPlan.hidden = true;
  if (emergencyMode) emergencyMode.hidden = true;

  document.getElementById("emergency-guides-view").hidden = false;
  guideSearchInput.value = "";
  renderGuideList();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function closeEmergencyGuides() {
  document.getElementById("emergency-guides-view").hidden = true;

  document.querySelectorAll(".welcome, .stats, .content-grid, .backup-panel")
    .forEach(section => {
      section.hidden = false;
    });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

openGuidesButton.addEventListener("click", showEmergencyGuides);
closeGuidesButton.addEventListener("click", closeEmergencyGuides);
backToGuidesButton.addEventListener("click", renderGuideList);
guideSearchInput.addEventListener("input", renderGuideList);
