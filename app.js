const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const preferenceModal = document.getElementById("preference-modal");
const swipeCard = document.getElementById("swipe-card");
const swipeImage = document.getElementById("swipe-image");
const swipeName = document.getElementById("swipe-name");
const swipeTags = document.getElementById("swipe-tags");
const wardrobeGrid = document.getElementById("wardrobe-grid");
const uploadTrigger = document.getElementById("upload-trigger");
const uploadInput = document.getElementById("upload-input");
const uploadCategory = document.getElementById("upload-category");
const uploadColor = document.getElementById("upload-color");
const webSearchInput = document.getElementById("web-search");
const webSearchBtn = document.getElementById("web-search-btn");
const webResults = document.getElementById("web-results");
const addItemBtn = document.getElementById("add-item");
const skipItemBtn = document.getElementById("skip-item");
const boardSelect = document.getElementById("board-select");
const styleNotes = document.getElementById("style-notes");
const generatePinsBtn = document.getElementById("generate-pins");
const pinFrame = document.getElementById("pin-frame");
const pinPrev = document.getElementById("pin-prev");
const pinNext = document.getElementById("pin-next");
const calendarGrid = document.getElementById("calendar-grid");
const plannedGrid = document.getElementById("planned-grid");
const calendarModal = document.getElementById("calendar-modal");
const calendarTitle = document.getElementById("calendar-title");
const calendarBoard = document.getElementById("calendar-board");
const calendarRequest = document.getElementById("calendar-request");
const calendarCancel = document.getElementById("calendar-cancel");
const calendarGenerate = document.getElementById("calendar-generate");
const calendarPrev = document.getElementById("calendar-prev");
const calendarNext = document.getElementById("calendar-next");
const calendarPinFrame = document.getElementById("calendar-pin-frame");
const calendarSelect = document.getElementById("calendar-select");
const wardrobeSelect = document.getElementById("wardrobe-select");
const customTitle = document.getElementById("custom-title");
const customNotes = document.getElementById("custom-notes");
const createPinBtn = document.getElementById("create-pin");
const customPinGrid = document.getElementById("custom-pin-grid");

const wardrobeItems = [];
const generatedPins = [];
const customPins = [];
const plannedPins = {};
let preference = "feminine";
let swipeIndex = 0;
let pinIndex = 0;
let calendarPinIndex = 0;
let activeCalendarDay = null;
let calendarPins = [];
const selectedWardrobeIds = new Set();

const suggestedItems = {
  feminine: [
    {
      name: "Silk camisole",
      color: "cream",
      category: "top",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Slip skirt",
      color: "brown",
      category: "bottom",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Leather boots",
      color: "black",
      category: "shoe",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Brown leather jacket",
      color: "brown",
      category: "outerwear",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    },
  ],
  masculine: [
    {
      name: "Oversized blazer",
      color: "brown",
      category: "outerwear",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Relaxed denim",
      color: "blue",
      category: "bottom",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Ribbed tee",
      color: "white",
      category: "top",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

const boardStyles = {
  london: "London girl",
  minimal: "Minimal city",
  maximalist: "Maximalist glam",
  coastal: "Coastal linen",
};

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const webSearchFallback = [
  "black top",
  "brown boots",
  "cream knit",
  "leather bag",
  "denim skirt",
  "gold jewelry",
];

const assetForQuery = (query) =>
  `https://source.unsplash.com/featured/600x600?${encodeURIComponent(query)}`;

const formatTags = (item) => `${item.color} · ${item.category}`;

const renderWardrobe = () => {
  wardrobeGrid.innerHTML = "";
  wardrobeItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "wardrobe-item";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <strong>${item.name}</strong>
      <span class="pill">${formatTags(item)}</span>
    `;
    wardrobeGrid.appendChild(card);
  });
  renderWardrobeSelect();
};

const renderWardrobeSelect = () => {
  wardrobeSelect.innerHTML = "";
  wardrobeItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = selectedWardrobeIds.has(item.id) ? "selected" : "";
    button.innerHTML = `<img src="${item.image}" alt="${item.name}" />`;
    button.addEventListener("click", () => {
      if (selectedWardrobeIds.has(item.id)) {
        selectedWardrobeIds.delete(item.id);
      } else {
        selectedWardrobeIds.add(item.id);
      }
      renderWardrobeSelect();
    });
    wardrobeSelect.appendChild(button);
  });
};

const showSwipeItem = () => {
  const items = suggestedItems[preference];
  if (!items.length) return;
  const item = items[swipeIndex % items.length];
  swipeImage.src = item.image;
  swipeName.textContent = item.name;
  swipeTags.textContent = formatTags(item);
};

const addItemToWardrobe = (item) => {
  const id = `${Date.now()}-${Math.random()}`;
  wardrobeItems.push({ ...item, id });
  renderWardrobe();
};

const nextSwipe = (shouldAdd) => {
  const items = suggestedItems[preference];
  if (items.length === 0) return;
  const item = items[swipeIndex % items.length];
  if (shouldAdd) {
    addItemToWardrobe(item);
  }
  swipeIndex += 1;
  showSwipeItem();
};

const renderWebResults = (query) => {
  webResults.innerHTML = "";
  const tokens = query ? [query] : webSearchFallback;
  tokens.slice(0, 6).forEach((term, index) => {
    const item = {
      name: term,
      color: uploadColor.value,
      category: uploadCategory.value,
      image: assetForQuery(term),
    };
    const card = document.createElement("div");
    card.className = "wardrobe-item";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <strong>${item.name}</strong>
      <span class="pill">${formatTags(item)}</span>
      <button class="secondary">Add to wardrobe</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      addItemToWardrobe(item);
    });
    webResults.appendChild(card);
    if (index === 0 && !query) {
      webSearchInput.value = "";
    }
  });
};

const generatePin = (source, notes = "", boardKey) => {
  const items = wardrobeItems.length
    ? wardrobeItems
    : suggestedItems[preference];
  const shuffled = items.slice().sort(() => 0.5 - Math.random());
  const collage = shuffled.slice(0, 6);
  return {
    id: `${Date.now()}-${Math.random()}`,
    title: source,
    board: boardStyles[boardKey] || boardStyles.london,
    notes,
    collage,
  };
};

const renderPin = (pin) => `
  <div class="pin">
    <div class="pin-header">
      <span>${pin.title}</span>
      <span class="pin-board">${pin.board}</span>
    </div>
    <div class="pin-collage">
      ${pin.collage
        .map(
          (item) =>
            `<img src="${item.image}" alt="${item.name}" loading="lazy" />`
        )
        .join("")}
    </div>
    <div class="pin-footer">
      <span>${pin.notes || "Wardrobe remixed pin"}</span>
      <span>${pin.collage.map((item) => item.name).join(" · ")}</span>
    </div>
  </div>
`;

const renderPinFrame = () => {
  if (generatedPins.length === 0) {
    pinFrame.innerHTML =
      "<p>Add wardrobe items to generate Pinterest-style outfit pins.</p>";
    return;
  }
  pinFrame.innerHTML = renderPin(generatedPins[pinIndex]);
};

const renderCalendarPins = () => {
  if (!calendarPins.length) {
    calendarPinFrame.innerHTML =
      "<p>Generate outfits to preview options for this day.</p>";
    return;
  }
  calendarPinFrame.innerHTML = renderPin(calendarPins[calendarPinIndex]);
};

const renderPlannedPins = () => {
  plannedGrid.innerHTML = "";
  Object.entries(plannedPins).forEach(([day, pin]) => {
    const card = document.createElement("div");
    card.className = "pin";
    card.innerHTML = renderPin(pin);
    card.querySelector(".pin-header span").textContent = day;
    plannedGrid.appendChild(card);
  });
};

const renderCalendar = () => {
  calendarGrid.innerHTML = "";
  weekdays.forEach((day) => {
    const tile = document.createElement("div");
    tile.className = "calendar-day";
    tile.innerHTML = `
      <strong>${day}</strong>
      <span>${plannedPins[day] ? "Outfit planned" : "Plan outfit"}</span>
    `;
    tile.addEventListener("click", () => {
      activeCalendarDay = day;
      calendarTitle.textContent = `Plan for ${day}`;
      calendarModal.classList.remove("hidden");
      calendarPins = [];
      calendarPinIndex = 0;
      renderCalendarPins();
    });
    calendarGrid.appendChild(tile);
  });
};

const renderCustomPins = () => {
  customPinGrid.innerHTML = "";
  customPins.forEach((pin) => {
    const card = document.createElement("div");
    card.innerHTML = renderPin(pin);
    customPinGrid.appendChild(card);
  });
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((btn) => btn.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

document.querySelectorAll("[data-preference]").forEach((button) => {
  button.addEventListener("click", () => {
    preference = button.dataset.preference;
    preferenceModal.classList.add("hidden");
    swipeIndex = 0;
    showSwipeItem();
  });
});

uploadTrigger.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      addItemToWardrobe({
        name: file.name.replace(/\.[^/.]+$/, ""),
        color: uploadColor.value,
        category: uploadCategory.value,
        image: uploadEvent.target.result,
      });
    };
    reader.readAsDataURL(file);
  });
  uploadInput.value = "";
});

webSearchBtn.addEventListener("click", () =>
  renderWebResults(webSearchInput.value.trim())
);

addItemBtn.addEventListener("click", () => nextSwipe(true));
skipItemBtn.addEventListener("click", () => nextSwipe(false));

generatePinsBtn.addEventListener("click", () => {
  const boardKey = boardSelect.value;
  generatedPins.length = 0;
  for (let i = 0; i < 5; i += 1) {
    generatedPins.push(
      generatePin(
        `Outfit Pin ${i + 1}`,
        styleNotes.value.trim(),
        boardKey
      )
    );
  }
  pinIndex = 0;
  renderPinFrame();
});

pinPrev.addEventListener("click", () => {
  if (!generatedPins.length) return;
  pinIndex = (pinIndex - 1 + generatedPins.length) % generatedPins.length;
  renderPinFrame();
});

pinNext.addEventListener("click", () => {
  if (!generatedPins.length) return;
  pinIndex = (pinIndex + 1) % generatedPins.length;
  renderPinFrame();
});

calendarCancel.addEventListener("click", () => {
  calendarModal.classList.add("hidden");
});

calendarGenerate.addEventListener("click", () => {
  if (!activeCalendarDay) return;
  calendarPins = [];
  for (let i = 0; i < 4; i += 1) {
    calendarPins.push(
      generatePin(
        `${activeCalendarDay} look ${i + 1}`,
        calendarRequest.value.trim(),
        calendarBoard.value
      )
    );
  }
  calendarPinIndex = 0;
  renderCalendarPins();
});

calendarPrev.addEventListener("click", () => {
  if (!calendarPins.length) return;
  calendarPinIndex =
    (calendarPinIndex - 1 + calendarPins.length) % calendarPins.length;
  renderCalendarPins();
});

calendarNext.addEventListener("click", () => {
  if (!calendarPins.length) return;
  calendarPinIndex = (calendarPinIndex + 1) % calendarPins.length;
  renderCalendarPins();
});

calendarSelect.addEventListener("click", () => {
  if (!activeCalendarDay || !calendarPins.length) return;
  plannedPins[activeCalendarDay] = calendarPins[calendarPinIndex];
  calendarModal.classList.add("hidden");
  renderPlannedPins();
  renderCalendar();
});

createPinBtn.addEventListener("click", () => {
  const selected = wardrobeItems.filter((item) =>
    selectedWardrobeIds.has(item.id)
  );
  if (!selected.length) return;
  const pin = {
    id: `${Date.now()}-${Math.random()}`,
    title: customTitle.value.trim() || "Custom outfit",
    board: "Custom pin",
    notes: customNotes.value.trim(),
    collage: selected,
  };
  customPins.push(pin);
  selectedWardrobeIds.clear();
  renderWardrobeSelect();
  renderCustomPins();
});

renderWebResults("");
renderCalendar();
showSwipeItem();
