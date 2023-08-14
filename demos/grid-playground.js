import { rovingGrid, updateRover } from "../dist/index.modern.js";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const grid = document.querySelector(".grid");
const output = document.querySelector("output");
const MAX_ROWS = 32;
const MAX_COLUMNS = 32;
let rows = parseInt(grid.style.getPropertyValue("--rows"), 10) || 9;
let columns = parseInt(grid.style.getPropertyValue("--columns"), 10) || 9;
let gap = parseFloat(grid.style.getPropertyValue("--gap"), 10) || 0.125;
let partialFill = false;
let rowsDOM = false;
let checkered = false;

function delegateGrid() {
  if (rowsDOM) {
    createGridWithRows(rows, columns, partialFill);
  } else {
    createGrid(rows, columns, partialFill);
  }
}

function createGrid(rows, columns, partialFill = false) {
  const cells = [];

  const centerRow = Math.floor(rows / 2);
  const centerColumn = Math.floor(columns / 2);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.textContent = `${i + 1}, ${j + 1}`;

      if (
        partialFill &&
        Math.abs(i - centerRow) + Math.abs(j - centerColumn) >
          Math.max(centerRow, centerColumn)
      ) {
        cell.inert = true;
      }

      if (checkered && !cell.inert) {
        cell.inert = ((i + 1) * columns + j + 1) % 2 === 0;
      }

      cell.classList.add("cell");
      cell.dataset.id = `${i + 1}_${j + 1}`;
      cells.push(cell);
    }
  }
  const fragment = document.createDocumentFragment();
  fragment.append(...cells);
  grid.replaceChildren(fragment);
}

function createGridWithRows(rows, columns, partialFill = false) {
  const rowElements = [];
  const centerRow = Math.floor(rows / 2);
  const centerColumn = Math.floor(columns / 2);

  for (let i = 0; i < rows; i++) {
    const cells = [];

    for (let j = 0; j < columns; j++) {
      const cell = document.createElement("div");
      cell.textContent = `${i + 1}, ${j + 1}`;

      if (
        partialFill &&
        Math.abs(i - centerRow) + Math.abs(j - centerColumn) >
          Math.max(centerRow, centerColumn)
      ) {
        cell.inert = true;
      }

      if (checkered && !cell.inert) {
        cell.inert = ((i + 1) * columns + j + 1) % 2 === 0;
      }

      cell.classList.add("cell");
      cell.dataset.id = `${i + 1}_${j + 1}`;
      cells.push(cell);
    }
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");
    rowElement.append(...cells);
    rowElements.push(rowElement);
  }
  const fragment = document.createDocumentFragment();
  fragment.append(...rowElements);
  grid.replaceChildren(fragment);
}

createGrid(9, 9);

// Add roving grid
rovingGrid({
  element: grid,
  target: ".cell",
  wrap: false,
});

const roverInputs = {
  wrap: false,
};

const keyBinds = {
  TOP_LEFT: "",
  TOP: "",
  TOP_RIGHT: "",
  UP: "",
  DOWN: "",
  HOME: "",
  END: "",
  LEFT: "",
  RIGHT: "",
  BOTTOM_LEFT: "",
  BOTTOM: "",
  BOTTOM_RIGHT: "",
};

const demoInputs = {
  rows: 9,
  columns: 9,
  gap: 0.125,
  rowsEnabled: false,
  isometric: false,
  partialFill: false,
  checkered: false,
};

const VKMap = {};

const gui = new dat.GUI();
const roverOptions = gui.addFolder("Roving Grid");
const demo = gui.addFolder("Demo");
roverOptions
  .add(roverInputs, "wrap")
  .name("Wrap")
  .onChange(() => updateRover(grid, { wrap: roverInputs.wrap }));

Object.keys(keyBinds).forEach((key) => {
  roverOptions
    .add(keyBinds, key)
    .name(`${key}`)
    .onChange((value) => {
      keyBinds[key] = value;
      VKMap[key] = [value];
      if (value !== "") {
        updateRover(grid, { VKMap: { ...VKMap } });
      }
    });
});

demo
  .add(demoInputs, "rows", 1, MAX_ROWS)
  .step(1)
  .name("Rows")
  .onChange(() => rowsChanged());
demo
  .add(demoInputs, "columns", 1, MAX_COLUMNS)
  .step(1)
  .name("Columns")
  .onChange(() => columnsChanged());
demo
  .add(demoInputs, "gap", 0, 4)
  .step(0.125)
  .name("Gap")
  .onChange(() => gapChanged());
demo
  .add(demoInputs, "rowsEnabled")
  .name("Rows in DOM")
  .onChange(() => rowsEnabledChanged());
demo
  .add(demoInputs, "isometric")
  .name("Isometric")
  .onChange(() => isoChanged());
demo
  .add(demoInputs, "partialFill")
  .name("Partial Fill")
  .onChange(() => fillChanged());
demo
  .add(demoInputs, "checkered")
  .name("Checkered")
  .onChange(() => checkeredChanged());

function rowsChanged() {
  if (rows === demoInputs.rows) {
    return;
  }
  rows = demoInputs.rows;
  grid.style.setProperty("--rows", rows);
  delegateGrid();
}

function columnsChanged() {
  if (columns === demoInputs.columns) {
    return;
  }
  columns = demoInputs.columns;
  grid.style.setProperty("--columns", columns);
  delegateGrid();
}

function gapChanged() {
  if (gap === demoInputs.gap) {
    return;
  }
  gap = demoInputs.gap;
  grid.style.setProperty("--gap", gap + "em");
}

function rowsEnabledChanged() {
  rowsDOM = demoInputs.rowsEnabled;
  delegateGrid();
}

function isoChanged() {
  if (demoInputs.isometric) {
    grid.classList.add("iso");
  } else {
    grid.classList.remove("iso");
  }
}

function fillChanged() {
  partialFill = demoInputs.partialFill;
  delegateGrid();
}

function checkeredChanged() {
  checkered = demoInputs.checkered;
  delegateGrid();
}

grid.addEventListener("wheel", (e) => {
  rows = clamp(1, Math.floor(rows + e.deltaY / 10), MAX_ROWS);
  columns = clamp(1, Math.floor(columns + e.deltaX / 10), MAX_COLUMNS);
  if (rows === demoInputs.rows && columns === demoInputs.columns) {
    return;
  }

  grid.style.setProperty("--rows", rows);
  grid.style.setProperty("--columns", columns);
  delegateGrid();
  demo.__controllers.forEach((c) => {
    if (c.property === "rows") {
      c.setValue(rows);
    }
    if (c.property === "columns") {
      c.setValue(columns);
    }
  });
});

const calculateCenterIndex = (rows, columns) => {
  const centerRow = Math.floor(rows / 2);
  const centerColumn = Math.floor(columns / 2);
  return centerRow * columns + centerColumn;
};

document.addEventListener("keydown", (e) => {
  if (e.key.toUpperCase() === "C") {
    // Get the center cell
    const cells = grid.querySelectorAll(".cell");
    const centerIndex = calculateCenterIndex(rows, columns);
    const cell = cells[centerIndex];
    cell.tabIndex = 0;
    cell.focus();
  }
});

grid.addEventListener("focusin", (e) => {
  const { target } = e;
  output.textContent = target.matches(".cell") ? target.textContent : "";
});
