let currentMode = "draw-start";
const gridSize = 25;
let gridCells = [];
let isMouseDown = false;

// Navigation
function goHome() {
  window.location.href = "/";
}

// Recipes data
const recipes = [
  // Example format: { name: "Recipe Name", url: "https://example.com", rating: 4.5 }
  {
    name: "One Pot Beef Stew",
    url: "https://www.taste.com.au/recipes/classic-one-pot-beef-stew/21b92285-3e73-43e6-938f-73a37c476de8?r=quickeasy/biccuul7",
    rating: 4.5,
  },
  {
    name: "Air Fryer Roast Pork",
    url: "https://www.taste.com.au/recipes/air-fryer-roast-pork-belly-recipe/s2bj5tyh?r=quickeasy/biccuul7",
    rating: 5,
  },
  {
    name: "Apple Fennel Cabbage Slaw",
    url: "https://www.recipetineats.com/best-no-mayo-coleslaw/",
    rating: 4.5,
  },
  {
    name: "Dumpling Laksa",
    url: "https://simplehomeedit.com/recipe/quick-dumpling-laksa/",
    rating: 5,
  },
  {
    name: "French Union Chicken",
    url: "https://www.dessertfortwo.com/french-onion-chicken-recipe/",
    rating: 4.5,
  },
  {
    name: "Garlic & Parmesan Roasted Broccoli",
    url: "https://downshiftology.com/recipes/roasted-broccoli/",
    rating: 3,
  },
  {
    name: "Marry Me Gnocchi",
    url: "https://www.delish.com/cooking/recipe-ideas/a65655220/marry-me-gnocchi-recipe/",
    rating: 5,
  },
];

let filteredRecipes = [...recipes];
let currentSort = "default";

function initializeGrid() {
  const gridContainer = document.getElementById("pathfinder-grid");
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridCells = [];

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.dataset.index = i;
    cell.onmousedown = () => handleCellMouseDown(i);
    cell.onmouseenter = () => handleCellMouseEnter(i);
    cell.onmouseup = () => handleCellMouseUp();
    cell.onmouseleave = () => handleCellMouseLeave();
    gridContainer.appendChild(cell);
    gridCells.push({ element: cell, type: "empty" });
  }
}

function handleCellMouseDown(index) {
  isMouseDown = true;
  handleCellClick(index);
}

function handleCellMouseEnter(index) {
  if (isMouseDown && currentMode === "draw-wall") {
    handleCellClick(index);
  } else if (isMouseDown && currentMode === "erase") {
    handleCellClick(index);
  }
}

function handleCellMouseUp() {
  isMouseDown = false;
}

function handleCellMouseLeave() {
  // Continue dragging even if mouse leaves grid
}

function setMode(mode) {
  currentMode = mode;
  document
    .querySelectorAll(".mode-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");
}

function handleCellClick(index) {
  const cell = gridCells[index];

  if (currentMode === "draw-start") {
    // Remove previous start
    gridCells.forEach((c) => {
      if (c.type === "start") {
        c.type = "empty";
        c.element.className = "grid-cell";
      }
    });
    cell.type = "start";
    cell.element.className = "grid-cell start";
  } else if (currentMode === "draw-end") {
    // Remove previous end
    gridCells.forEach((c) => {
      if (c.type === "end") {
        c.type = "empty";
        c.element.className = "grid-cell";
      }
    });
    cell.type = "end";
    cell.element.className = "grid-cell end";
  } else if (currentMode === "draw-wall") {
    if (cell.type === "empty") {
      cell.type = "wall";
      cell.element.className = "grid-cell wall";
    }
  } else if (currentMode === "erase") {
    if (cell.type !== "empty") {
      cell.type = "empty";
      cell.element.className = "grid-cell";
    }
  }
}

function runPathfinding() {
  const algorithm = document.getElementById("algorithm-select").value;
  console.log(`Running ${algorithm} pathfinding algorithm`);
  // TODO: Implement pathfinding algorithms
  // Will be implemented by user
}

function clearGrid() {
  gridCells.forEach((cell) => {
    cell.type = "empty";
    cell.element.className = "grid-cell";
  });
}

function openWindow(type) {
  if (type === "pathfinder") {
    const pathfinderWindow = document.querySelector(".pathfinder-window");
    pathfinderWindow.classList.add("visible");
    if (gridCells.length === 0) {
      initializeGrid();
    }
  } else if (type === "easter-egg") {
    const easterEggWindow = document.querySelector(".easter-egg-window");
    easterEggWindow.classList.add("visible");
  } else if (type === "recipes") {
    const recipesWindow = document.querySelector(".recipes-window");
    recipesWindow.classList.add("visible");
    renderRecipes(recipes);
    setupRecipeSearch();
  }
}

function closeWindow(type) {
  if (type === "pathfinder") {
    const pathfinderWindow = document.querySelector(".pathfinder-window");
    pathfinderWindow.classList.remove("visible");
    isMouseDown = false;
  } else if (type === "construction") {
    const constructionWindow = document.querySelector(".construction-window");
    constructionWindow.classList.remove("visible");
  } else if (type === "easter-egg") {
    const easterEggWindow = document.querySelector(".easter-egg-window");
    easterEggWindow.classList.remove("visible");
  } else if (type === "recipes") {
    const recipesWindow = document.querySelector(".recipes-window");
    recipesWindow.classList.remove("visible");
  }
}

// Recipes functionality
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "★".repeat(fullStars);
  if (hasHalfStar) {
    stars += "⯪";
  }
  stars += "☆".repeat(5 - Math.ceil(rating));
  return stars;
}

function sortRecipes(recipesToSort) {
  const recipes = [...recipesToSort];
  if (currentSort === "alphabetical") {
    recipes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "rating") {
    recipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  return recipes;
}

function renderRecipes(recipesToRender) {
  const recipesList = document.getElementById("recipes-list");
  recipesList.innerHTML = "";

  const sortedRecipes = sortRecipes(recipesToRender);

  if (sortedRecipes.length === 0) {
    recipesList.innerHTML =
      '<div class="recipe-item" style="color: #808080;">No recipes found</div>';
    return;
  }

  sortedRecipes.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.className = "recipe-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "recipe-name";
    nameSpan.textContent = recipe.name;

    const ratingSpan = document.createElement("span");
    ratingSpan.className = "recipe-rating";
    ratingSpan.textContent = generateStarRating(recipe.rating || 0);

    recipeItem.appendChild(nameSpan);
    recipeItem.appendChild(ratingSpan);
    recipeItem.onclick = () => window.open(recipe.url, "_blank");
    recipesList.appendChild(recipeItem);
  });
}

function setSortMode(mode) {
  currentSort = mode;

  // Update button states
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-sort="${mode}"]`).classList.add("active");

  // Re-render with new sort
  renderRecipes(filteredRecipes);
}

function setupRecipeSearch() {
  const searchInput = document.getElementById("recipe-search");
  searchInput.value = "";
  searchInput.onkeyup = () => {
    const query = searchInput.value.toLowerCase();
    filteredRecipes = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(query)
    );
    renderRecipes(filteredRecipes);
  };
}

// Make window elements draggable by their header and bring clicked window to front
(function enableWindowDragging() {
  let dragState = {
    isDragging: false,
    el: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  };
  let zCounter = 1000;

  function clamp(v, a, b) {
    return Math.max(a, Math.min(v, b));
  }

  function onMouseMove(e) {
    if (!dragState.isDragging || !dragState.el) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    const dx = clientX - dragState.startX;
    const dy = clientY - dragState.startY;
    const newLeft = clamp(
      dragState.startLeft + dx,
      0,
      window.innerWidth - dragState.el.offsetWidth
    );
    const newTop = clamp(
      dragState.startTop + dy,
      0,
      window.innerHeight - dragState.el.offsetHeight
    );
    dragState.el.style.left = newLeft + "px";
    dragState.el.style.top = newTop + "px";
  }

  function onMouseUp() {
    if (!dragState.isDragging) return;
    dragState.isDragging = false;
    // restore transition if we modified it
    if (dragState.el) {
      dragState.el.style.transition = "";
    }
    dragState.el = null;
    document.body.style.userSelect = "";
  }

  function attach(winEl) {
    const header = winEl.querySelector(".window-header");
    if (!header) return;

    // pointer cursors handled in CSS, but ensure header is focusable for accessibility
    header.style.userSelect = "none";

    header.addEventListener("mousedown", (e) => {
      // Ignore clicks on the close button inside header
      if (e.target.closest(".window-close")) return;
      dragState.isDragging = true;
      dragState.el = winEl;
      dragState.startX = e.clientX;
      dragState.startY = e.clientY;
      const rect = winEl.getBoundingClientRect();
      dragState.startLeft = rect.left;
      dragState.startTop = rect.top;
      // Temporarily disable CSS transitions while dragging
      winEl.style.transition = "none";
      winEl.style.zIndex = ++zCounter;
      document.body.style.userSelect = "none";
      e.preventDefault();
    });

    // Touch support
    header.addEventListener("touchstart", (ev) => {
      const t = ev.touches[0];
      dragState.isDragging = true;
      dragState.el = winEl;
      dragState.startX = t.clientX;
      dragState.startY = t.clientY;
      const rect = winEl.getBoundingClientRect();
      dragState.startLeft = rect.left;
      dragState.startTop = rect.top;
      winEl.style.transition = "none";
      winEl.style.zIndex = ++zCounter;
      document.body.style.userSelect = "none";
      ev.preventDefault();
    });

    // Bring to front when clicking any part of the window
    winEl.addEventListener("mousedown", () => {
      winEl.style.zIndex = ++zCounter;
    });
  }

  // Attach to all playground windows
  const windows = document.querySelectorAll(
    ".pathfinder-window, .recipes-window, .easter-egg-window, .construction-window"
  );
  windows.forEach(attach);

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  // Touch move / end handlers
  document.addEventListener(
    "touchmove",
    (ev) => {
      if (!dragState.isDragging || !dragState.el) return;
      const t = ev.touches[0];
      const fauxEvent = { clientX: t.clientX, clientY: t.clientY };
      onMouseMove(fauxEvent);
      ev.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("touchend", () => {
    onMouseUp();
  });
})();
