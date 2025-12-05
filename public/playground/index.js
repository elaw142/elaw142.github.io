let currentMode = "draw-start";
const gridSize = 25;
let gridCells = [];
let isMouseDown = false;

// Recipes data
const recipes = [
  // Example format: { name: "Recipe Name", url: "https://example.com" }
  {
    name: "One Pot Beef Stew",
    url: "https://www.taste.com.au/recipes/classic-one-pot-beef-stew/21b92285-3e73-43e6-938f-73a37c476de8?r=quickeasy/biccuul7",
  },
  {
    name: "Air Fryer Roast Pork",
    url: "https://www.taste.com.au/recipes/air-fryer-roast-pork-belly-recipe/s2bj5tyh?r=quickeasy/biccuul7",
  },
  {
    name: "Apple Fennel Cabbage Slaw",
    url: "https://www.recipetineats.com/best-no-mayo-coleslaw/",
  },
  {
    name: "Dumpling Laksa",
    url: "https://simplehomeedit.com/recipe/quick-dumpling-laksa/",
  },
];

let filteredRecipes = [...recipes];

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
function renderRecipes(recipesToRender) {
  const recipesList = document.getElementById("recipes-list");
  recipesList.innerHTML = "";

  if (recipesToRender.length === 0) {
    recipesList.innerHTML =
      '<div class="recipe-item" style="color: #808080;">No recipes found</div>';
    return;
  }

  recipesToRender.forEach((recipe) => {
    const recipeItem = document.createElement("div");
    recipeItem.className = "recipe-item";
    recipeItem.textContent = recipe.name;
    recipeItem.onclick = () => window.open(recipe.url, "_blank");
    recipesList.appendChild(recipeItem);
  });
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
