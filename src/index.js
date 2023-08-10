/**
 * @typedef {string} KeyCombo - A `+` delimited key combination (e.g. `Ctrl+Home`)
 */

/**
 * @typedef {Object} VKMap - A map between virtual keys and key combinations
 * @property {KeyCombo[]} [TOP_LEFT] - The top left key combination
 * @property {KeyCombo[]} [TOP] - The top key combination
 * @property {KeyCombo[]} [TOP_RIGHT] - The top right key combination
 * @property {KeyCombo[]} [UP] - The up key combination
 * @property {KeyCombo[]} [DOWN] - The down key combination
 * @property {KeyCombo[]} [HOME] - The home key combination
 * @property {KeyCombo[]} [END] - The end key combination
 * @property {KeyCombo[]} [LEFT] - The left key combination
 * @property {KeyCombo[]} [RIGHT] - The right key combination
 * @property {KeyCombo[]} [BOTTOM_LEFT] - The bottom left key combination
 * @property {KeyCombo[]} [BOTTOM] - The bottom key combination
 * @property {KeyCombo[]} [BOTTOM_RIGHT] - The bottom right key combination
 *
 */

/**
 * @typedef {Object} KeyLookup - A map between key combinations and virtual keys
 */

const state = new Map();
const isRtl =
  window.getComputedStyle(document.documentElement).direction === "rtl";

/**
 * @type {VKMap}
 */
const DEFAULT_VK_MAP = {
  TOP_LEFT: [],
  TOP: ["Ctrl+Home", "Meta+ArrowUp"],
  TOP_RIGHT: [],
  UP: ["ArrowUp"],
  DOWN: ["ArrowDown"],
  HOME: ["Home", "Meta+ArrowLeft"],
  END: ["End", "Meta+ArrowRight"],
  LEFT: ["ArrowLeft"],
  RIGHT: ["ArrowRight"],
  BOTTOM_LEFT: [],
  BOTTOM: ["Ctrl+End", "Meta+ArrowDown"],
  BOTTOM_RIGHT: [],
};

/**
 * Returns a string for the pressed key combination, combining all modifiers
 * with '+' in order: Ctrl (^), Alt (⌥), Shift (⇧), Meta (⌘)
 *
 * @param {KeyboardEvent} e The keyboard event
 * @returns {KeyCombo} The key combination
 */
const keyCombo = (e) => {
  const modifiers = [
    e.ctrlKey ? "Ctrl" : null,
    e.altKey ? "Alt" : null,
    e.shiftKey ? "Shift" : null,
    e.metaKey ? "Meta" : null,
  ].filter(Boolean);
  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;

  return modifiers.length > 0 ? modifiers.join("+") + `+${key}` : key;
};

/**
 * Swaps a key combo with a key combo in a list of key combos.
 * Used to translate from Ltr to Rtl for HOME and END virtual keys
 * @param {KeyCombo[]} keys - The key combos to swap with
 * @param {KeyCombo} key - The key to swap
 * @returns {KeyCombo} The swapped key
 */
const swapKeys = (keys, key) => {
  if ((key.includes("ArrowLeft") || key.length == 1) && !key.includes("Home")) {
    const i = keys.findIndex((k) => k.includes("ArrowRight") || k.length == 1);
    return i !== -1 ? keys[i] : key;
  } else if (
    (key.includes("ArrowRight") || key.length == 1) &&
    !key.includes("End")
  ) {
    const i = keys.findIndex((k) => k.includes("ArrowLeft") || k.length == 1);
    return i !== -1 ? keys[i] : key;
  }
  return key;
};

/**
 * Returns a virtual key lookup for each key combination, handles Rtl
 * @param {VKMap} [VKMap] - The virtual key map
 * @returns {KeyLookup} The virtual key lookup map for each key combination
 */
const keyLookup = (VKMap = {}) => {
  const keyMap = { ...DEFAULT_VK_MAP, ...VKMap };

  if (isRtl) {
    // Swap functionality of LEFT and RIGHT for Rtl
    [keyMap.LEFT, keyMap.RIGHT] = [keyMap.RIGHT, keyMap.LEFT];
    [keyMap.TOP_LEFT, keyMap.TOP_RIGHT] = [keyMap.TOP_RIGHT, keyMap.TOP_LEFT];
    [keyMap.BOTTOM_LEFT, keyMap.BOTTOM_RIGHT] = [
      keyMap.BOTTOM_RIGHT,
      keyMap.BOTTOM_LEFT,
    ];

    // Swap HOME and END
    const homeKeys = keyMap.HOME;
    const endKeys = keyMap.END;
    keyMap.HOME = homeKeys.map((key) => swapKeys(endKeys, key));
    keyMap.END = endKeys.map((key) => swapKeys(homeKeys, key));
  }

  // Convert single characters to uppercase
  for (const action in keyMap) {
    keyMap[action] = keyMap[action].map((keyCombo) => {
      const keys = keyCombo.split("+");
      const updatedKeys = keys.map((key) => {
        return key.length === 1 ? key.toUpperCase() : key;
      });
      return updatedKeys.join("+");
    });
  }

  // Convert the keymap into a lookup for faster access
  const keyLookup = {};
  for (const action in keyMap) {
    keyMap[action].forEach((keyCombo) => {
      keyLookup[keyCombo] = action;
    });
  }
  return keyLookup;
};

// When pointerdown, activate the target
const onPointerDown = (e) => {
  const { currentTarget: rover } = e;
  const rx = state.get(rover);
  const targetsArray = [...rx.targets];
  for (const [i, t] of targetsArray.entries()) {
    if (t.contains(e.target)) {
      e.preventDefault();
      rx.index = i;
      rx.focused = true;
      activate(rover, t);
      state.set("last_rover", rover);
      break;
    }
  }
};

// When focusin, activate the target if not active
const onFocusin = (e) => {
  const { currentTarget: rover, target } = e;
  if (state.has(rover)) {
    const rx = state.get(rover);
    const targetIndex = [...rx.targets].indexOf(target);
    if (targetIndex !== -1 && rx.index !== targetIndex) {
      rx.index = targetIndex;
      rx.focused = true;
      activate(rover, target);
      state.set("last_rover", rover);
    }
  }
};

const onFocusout = (e) => {
  const { currentTarget: rover } = e;
  const rx = state.get(rover);
  if (rx) rx.focused = false;
};

const onKeydown = (e) => {
  const { currentTarget: rover } = e;
  const key = keyCombo(e);
  const { keyBinds } = state.get(rover);
  switch (keyBinds[key]) {
    case "RIGHT":
      e.preventDefault();
      focusNextItem(rover);
      break;
    case "LEFT":
      e.preventDefault();
      focusPreviousItem(rover);
      break;
    case "DOWN":
      e.preventDefault();
      focusDownItem(rover);
      break;
    case "UP":
      e.preventDefault();
      focusUpItem(rover);
      break;
    case "HOME":
      e.preventDefault();
      focusHomeItem(rover);
      break;
    case "END":
      e.preventDefault();
      focusEndItem(rover);
      break;
    case "BOTTOM":
      e.preventDefault();
      focusBottomItem(rover);
      break;
    case "TOP":
      e.preventDefault();
      focusTopItem(rover);
      break;
    case "TOP_LEFT":
      e.preventDefault();
      focusTopLeadingItem(rover);
      break;
    case "TOP_RIGHT":
      e.preventDefault();
      focusTopTrailingItem(rover);
      break;
    case "BOTTOM_LEFT":
      e.preventDefault();
      focusBottomLeadingItem(rover);
      break;
    case "BOTTOM_RIGHT":
      e.preventDefault();
      focusBottomTrailingItem(rover);
      break;
  }
};

const updateState = (rover, targetSelector) => {
  const updatedTargets = rover.querySelectorAll(targetSelector);

  const columns = numColumns(rover, updatedTargets);
  const rows = Math.ceil(updatedTargets.length / columns);

  const rx = state.get(rover);
  const currentColumns = rx.columns;
  const currentIndex = rx.index;
  const currentRowIndex = Math.floor(currentIndex / currentColumns);
  const currentColumnIndex = currentIndex % currentColumns;

  const index =
    Math.min(currentRowIndex, rows - 1) * columns +
    Math.min(currentColumnIndex, columns - 1);
  const startingPoint = updatedTargets[index];

  updatedTargets.forEach((t) => (t.tabIndex = -1));
  startingPoint.tabIndex = 0;
  rx.focused && activate(rover, startingPoint);

  state.set(rover, {
    ...rx,
    targets: updatedTargets,
    columns,
    rows,
    active: startingPoint,
    index,
  });
};

const createRoverObserver = (rover, { observers = [] } = {}) => {
  const parent = rover.parentNode;
  const mo = new MutationObserver((mutationList, observer) => {
    mutationList
      .filter((x) => x.removedNodes.length > 0)
      .forEach((mutation) => {
        [...mutation.removedNodes]
          .filter((x) => x.nodeType === 1)
          .forEach((removedEl) => {
            state.forEach((val, key) => {
              if (key === "last_rover") return;
              if (removedEl.contains(key)) {
                key.removeEventListener("pointerdown", onPointerDown);
                key.removeEventListener("focusin", onFocusin);
                key.removeEventListener("focusout", onFocusout);
                key.removeEventListener("keydown", onKeydown);

                state.delete(key);
                val.targets.forEach((a) => (a.tabIndex = ""));

                if (
                  state.size === 0 ||
                  (state.size === 1 && state.has("last_rover"))
                ) {
                  state.clear();
                  mo.disconnect();
                  observers.forEach((o) => o.disconnect());
                }
              }
            });
          });
      });
  });

  mo.observe(parent, {
    childList: true,
    subtree: true,
  });

  return mo;
};

const createMutationObserver = (rover, targetSelector) => {
  const mo = new MutationObserver((mutationList, observer) => {
    mutationList.forEach((mutation) => {
      if (mutation.type === "childList" && rover.contains(mutation.target)) {
        updateState(rover, targetSelector);
      }
    });
  });

  mo.observe(rover, {
    childList: true,
    subtree: true,
  });

  return mo;
};

const createResizeObserver = (rover, targetSelector) => {
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateState(rover, targetSelector);
    }
  });

  ro.observe(rover);
  rover.querySelectorAll(targetSelector).forEach((t) => {
    ro.observe(t);
  });

  return ro;
};

/**
 * Calculates the number of columns in a grid layout
 * @param {HTMLElement} container - The container element
 * @param {HTMLElement[]} targets - The target elements in the container
 * @returns {number} The number of columns
 */
const numColumns = (container, targets) => {
  // If the container uses CSS grid, get the number of columns from the CSS
  const gridComputedStyle = window.getComputedStyle(container);
  const cssGrid = gridComputedStyle.getPropertyValue("grid-template-columns");
  if (cssGrid) {
    return gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ").length;
  }

  // Otherwise, calculate the number of columns with brute force using the
  // offset widths and gaps between cells
  const containerWidth = container.offsetWidth;
  const targetsArray = [...targets];
  let acc = 0;
  let n = 0;
  for (let i = 0, m = targetsArray.length; i < m; i++) {
    const cell = targetsArray[i];

    acc += Math.floor(cell.offsetWidth);

    const nextCell = targets[i + 1];

    if (nextCell) {
      const gap = nextCell.offsetLeft - (cell.offsetLeft + cell.offsetWidth);
      if (gap > 0) acc += Math.floor(gap);
    }

    if (acc > containerWidth) {
      break;
    }
    n++;
  }
  return n;
};

/**
 * Calculates the number of rows in a grid layout
 * @param {HTMLElement} container - The container element
 * @param {HTMLElement[]} targets - The target elements in the container
 * @returns {number} The number of rows
 */
const numRows = (container, targets) => {
  // If the container uses CSS grid, get the number of rows from the CSS
  const gridComputedStyle = window.getComputedStyle(container);
  const cssGrid = gridComputedStyle.getPropertyValue("grid-template-rows");
  if (cssGrid) {
    return gridComputedStyle.getPropertyValue("grid-template-rows").split(" ")
      .length;
  }

  // Otherwise, calculate the number of rows as the number of targets divided
  // by the number of columns
  return Math.ceil(targets.length / numColumns(container, targets));
};

/**
 * @param {Object} props - The props object
 * @param {HTMLElement} props.element - The target container element
 * @param {string} [props.target] - The selector for focus targets (e.g. cells)
 * @param {boolean} [props.wrap=true] - Whether focus wraps around lines
 * @param {VKMap} [props.VKMap={}] - The virtual key map for key combos
 */
export const rovingGrid = ({
  element: rover,
  target: targetSelector = ":scope *",
  wrap = true,
  VKMap = {},
}) => {
  const targets = rover.querySelectorAll(targetSelector);
  const startingPoint = targets[0];
  const columns = numColumns(rover, targets);
  const rows = numRows(rover, targets);
  const keyBinds = keyLookup(VKMap);

  rover.tabIndex = -1;
  targets.forEach((t) => (t.tabIndex = -1));
  startingPoint.tabIndex = 0;

  // with the roving container as the key
  // save some state and handy references
  state.set(rover, {
    targets,
    wrap,
    active: startingPoint,
    index: 0,
    rows,
    columns,
    focused: false,
    keyBinds,
  });

  rover.addEventListener("pointerdown", onPointerDown);
  rover.addEventListener("focusin", onFocusin);
  rover.addEventListener("focusout", onFocusout);
  rover.addEventListener("keydown", onKeydown);

  const mo = createMutationObserver(rover, targetSelector);
  const ro = createResizeObserver(rover, targetSelector);
  createRoverObserver(rover, { observers: [mo, ro] });
};

/**
 * @typedef {Object} RoverOptions - Options for roving grid
 * @param {boolean} [options.wrap=true] - Whether focus wraps around lines
 * @param {VKMap} [options.VKMap={}] - The virtual key map for key combos
 */

/**
 * Updates the rover for on-the-fly customization of `wrap` and `VKMap`
 * @param {HTMLElement} rover - The element with roving focus
 * @param {RoverOptions} options - The roving grid options
 */
export const updateRover = (rover, options) => {
  const currentState = state.get(rover);

  if (!currentState) {
    throw new Error("Rover not found");
  }

  const updatedState = {
    ...currentState,
    ...options,
  };

  if (options.VKMap) {
    updatedState.keyBinds = keyLookup(options.VKMap);
  }

  state.set(rover, updatedState);
};

const focusNextItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  const maxIndex = rx.wrap
    ? rx.targets.length - 1
    : (rowIndex + 1) * rx.columns - 1;
  let nextIndex = rx.index;

  while (nextIndex < maxIndex) {
    nextIndex++;
    const next = rx.targets[nextIndex];
    if (next && !(next.inert || next.disabled)) {
      rx.index = nextIndex;
      activate(rover, next);
      break;
    }
  }
};

const focusPreviousItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  const minIndex = rx.wrap ? 0 : rowIndex * rx.columns;
  let previousIndex = rx.index;

  while (previousIndex > minIndex) {
    previousIndex--;
    const prev = rx.targets[previousIndex];
    if (prev && !(prev.inert || prev.disabled)) {
      rx.index = previousIndex;
      activate(rover, prev);
      break;
    }
  }
};

const focusDownItem = (rover) => {
  const rx = state.get(rover);
  const maxIndex = rx.rows * rx.columns + (rx.index % rx.columns);
  let downIndex = rx.index;

  while (downIndex < maxIndex) {
    downIndex += rx.columns;
    const down = rx.targets[downIndex];
    if (down && !(down.inert || down.disabled)) {
      rx.index = downIndex;
      activate(rover, down);
      break;
    }
  }
};

const focusUpItem = (rover) => {
  const rx = state.get(rover);
  const minIndex = rx.index % rx.columns;
  let upIndex = rx.index;

  while (upIndex > minIndex) {
    upIndex -= rx.columns;
    const up = rx.targets[upIndex];
    if (up && !(up.inert || up.disabled)) {
      rx.index = upIndex;
      activate(rover, up);
      break;
    }
  }
};

const focusHomeItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  let targetColumnIndex = 0;

  // Find smallest column index that has a target
  while (targetColumnIndex < rx.columns) {
    const homeTarget = rx.targets[rowIndex * rx.columns + targetColumnIndex];
    if (homeTarget && !(homeTarget.inert || homeTarget.disabled)) {
      break;
    }
    targetColumnIndex++;
  }

  rx.index = rowIndex * rx.columns + targetColumnIndex;
  const home = rx.targets[rx.index];

  home && activate(rover, home);
};

const focusEndItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  let targetColumnIndex = rx.columns - 1;

  // Find largest column index that has a target
  while (targetColumnIndex >= 0) {
    const endTarget = rx.targets[rowIndex * rx.columns + targetColumnIndex];
    if (endTarget && !(endTarget.inert || endTarget.disabled)) {
      break;
    }
    targetColumnIndex--;
  }

  rx.index = rowIndex * rx.columns + targetColumnIndex;
  const end = rx.targets[rx.index];

  end && activate(rover, end);
};

const focusTopItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  let targetRowIndex = 0;

  // Find smallest row index that has a target
  while (targetRowIndex < rowIndex) {
    const topTarget =
      rx.targets[rx.index + (targetRowIndex - rowIndex) * rx.columns];
    if (topTarget && !(topTarget.inert || topTarget.disabled)) {
      break;
    }
    targetRowIndex++;
  }

  rx.index += rx.columns * (targetRowIndex - rowIndex);
  const top = rx.targets[rx.index];

  top && activate(rover, top);
};

const focusBottomItem = (rover) => {
  const rx = state.get(rover);
  const rowIndex = Math.floor(rx.index / rx.columns);
  let targetRowIndex = rx.rows - 1;

  // Find largest row index that has a target
  while (targetRowIndex > rowIndex) {
    const bottomTarget =
      rx.targets[rx.index + (targetRowIndex - rowIndex) * rx.columns];
    if (bottomTarget && !(bottomTarget.inert || bottomTarget.disabled)) {
      break;
    }
    targetRowIndex--;
  }

  rx.index += rx.columns * (targetRowIndex - rowIndex);
  const bottom = rx.targets[rx.index];

  bottom && activate(rover, bottom);
};

const focusTopLeadingItem = (rover) => {
  const rx = state.get(rover);
  const topLeading = rx.targets[0];

  if (topLeading && !(topLeading.inert || topLeading.disabled)) {
    rx.index = 0;
    activate(rover, topLeading);
  }
};

const focusTopTrailingItem = (rover) => {
  const rx = state.get(rover);
  const topTrailing = rx.targets[rx.columns - 1];

  if (topTrailing && !(topTrailing.inert || topTrailing.disabled)) {
    rx.index = rx.columns - 1;
    activate(rover, topTrailing);
  }
};

const focusBottomLeadingItem = (rover) => {
  const rx = state.get(rover);
  const bottomLeading = rx.targets[rx.columns * (rx.rows - 1)];

  if (bottomLeading && !(bottomLeading.inert || bottomLeading.disabled)) {
    rx.index = rx.columns * (rx.rows - 1);
    activate(rover, bottomLeading);
  }
};

const focusBottomTrailingItem = (rover) => {
  const rx = state.get(rover);
  const bottomTrailing = rx.targets[rx.columns * rx.rows - 1];

  if (bottomTrailing && !(bottomTrailing.inert || bottomTrailing.disabled)) {
    rx.index = rx.columns * rx.rows - 1;
    activate(rover, bottomTrailing);
  }
};

const activate = (rover, item) => {
  const rx = state.get(rover);

  rx.active.tabIndex = -1;
  rx.active = item;
  rx.active.tabIndex = 0;
  rx.active.focus();
  rx.focused = true;
};
