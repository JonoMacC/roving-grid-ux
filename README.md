# roving-grid-ux

![npm downloads](https://img.shields.io/npm/dt/roving-grid-ux)
![npm latest](https://img.shields.io/npm/v/roving-grid-ux)
![npm license](https://img.shields.io/npm/l/roving-grid-ux)
![npm bundle size](https://img.shields.io/bundlephobia/min/roving-grid-ux)

Adds keyboard grid-based navigation to a DOM node

**Based on** the work done by [Adam Argyle on roving ux](https://github.com/argyleink/roving-ux)  
**Try it** at [Roving Grid Playground](https://roving-grid.netlify.app/grid-playground) and [Glyph Browser](https://roving-grid.netlify.app/glyph-browser)

## Features

- Rtl support
- Customizable key-bindings (W, A, S, D ? 👀)
- Configurable wrapping behavior between rows
- Keeps focus when DOM changes (add or remove nodes)
- Updates when children are programmatically focused by an external component
- Children are focused by `pointerdown`

## Use Cases

- Add keyboard navigation to custom components
- Prototype a game or custom interaction pattern

## Installation

```bash
npm i roving-grid-ux
```

CDN: <https://cdn.skypack.dev/roving-grid-ux>

## Importing

```javascript
// import from CDN
import { rovingGrid } from "https://cdn.skypack.dev/roving-grid-ux'

// import roving grid from npm
import { rovingGrid } from "roving-grid-ux";

// import roving grid and updater from npm
import { rovingGrid, updateRover } from "roving-grid-ux";
```

## API

```javascript
rovingGrid({
  element: node,    // container that manages focus
  target: ".cell",  // query selector for focusable children
  wrap: false,      // ? whether focus wraps from row to row
  VKMap: {}         // ? custom keybindings for navigating the grid
})

updateRover(
  element: node,    // roving container to be updated
  {
    wrap: true      // ? updated wrap property
    VKMap: {}       // ? updated keybindings
  }
)
```

### Custom key bindings interface

```javascript
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
```

- Directional keys for horizontal movements are swapped for Rtl (Home and End keys excepted)
- Multiple keys can be bound to a virtual key. Use JavaScript `Event.key` names.
- Key combinations should be in order: Ctrl (^), Alt (⌥), Shift (⇧), Meta (⌘).

## Virtual Key Positions

Any of the below positions in a grid can be mapped to a virtual key.  
![7x7 grid denoting virtual key positions Top Left, Top, Top Right, Up, Home, Left, Right, End, Down, Bottom Left, Bottom, Bottom Right, relative to the current position](/assets/grid-positions.svg)

If no custom keybindings are provided, the following defaults are used:

| Virtual Key | Key Combinations         |
| ----------- | ------------------------ |
| TOP         | Ctrl+Home, Meta+ArrowUp  |
| BOTTOM      | Ctrl+End, Meta+ArrowDown |
| UP          | ArrowUp                  |
| DOWN        | ArrowDown                |
| HOME        | Home, Meta+ArrowLeft     |
| END         | End, Meta+ArrowRight     |
| LEFT        | ArrowLeft                |
| RIGHT       | ArrowRight               |

## Programmatic Focus

A custom location can be focused by calling its `focus` method. The grid will update its internal representation of the focused element.

## Example Usage

```javascript
import { rovingGrid } from "roving-grid-ux";

rovingGrid({
  element: document.querySelector("#grid"),
  target: ".cell",
});
```

```javascript
import { rovingGrid, updateRover } from "roving-grid-ux";

document.querySelectorAll(".glyph-grid").forEach((grid) => {
  rovingGrid({
    element: grid,
    target: ".glyph",
  });
});
```

## Limitations

Does not support virtual focus (e.g. `aria-activedescendant`), so not suitable
for composite widgets where focus must remain on one element while keeping the
grid navigable via keyboard (a ComboBox with a grid popup... 🤔).

Does not handle selection, you will have to bring your own selection logic.

`Tab` moves focus out of the container; this is intentional so that keyboard
navigation is efficient. However, spreadsheets generally mix tabbed navigation
with ←, →, ↑, ↓ navigation, so this may not be good for prototyping that type
of component.

`PageUp` and `PageDown` do not have a default virtual key. If you need these to move focus you will need to implement it yourself.

Grid items must be sequential in the DOM (i.e. no voids). For inaccessible items, use `disabled` or `inert` items.

## Caution

Keyboard grid navigation is not common outside of default controls or data
tables. Consider your use case, users, and authoring practices when setting up
a keyboard navigable grid.

## Learn

[ARIA grid interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
