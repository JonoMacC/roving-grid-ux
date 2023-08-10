import { rovingGrid } from "../dist/index.modern.js";

const toKebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

const basic =
  "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬®¯°±²³´¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ";
const latinExtendedA =
  "ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĮįİıĲĳĴĵĶķĹĺĻļĽľŁłŃńŅņŇňŊŋŌōŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽž";
const latinExtendedB = "ȘșȚțȷ";
const spacingModifiers = "ˆˇ˘˙˚˛˜˝";
const latinExtendedAdditional = "ḠḡẀẁẂẃẄẅẞẼẽỲỳỸỹ";
const generalPunctuation = "​–—‘’‚“”„†‡•… ‰″‹›⁄";
const superscriptsSubscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹₀₁₂₃₄₅₆₇₈₉";
const symbols = "€™⅛⅜⅝⅞←↑→↓↔↕↖↗↘↙⇧∂∅∏∑−√∞∫≈≠≤≥⌗⌘⌥";
const shapes = "■□▲△▶▷▼▽◀◁◆◇◊○●";
const glyphCollection = new Map();
glyphCollection.set("Basic", basic);
glyphCollection.set("Latin Extended A", latinExtendedA);
glyphCollection.set("Latin Extended B", latinExtendedB);
glyphCollection.set("Spacing Modifiers", spacingModifiers);
glyphCollection.set("Latin Extended Additional", latinExtendedAdditional);
glyphCollection.set("General Punctuation", generalPunctuation);
glyphCollection.set("Superscripts and Subscripts", superscriptsSubscripts);
glyphCollection.set("Symbols", symbols);
glyphCollection.set("Shapes", shapes);

function createGlyphCells(charSet) {
  const cells = [];
  for (let i = 0, n = Math.ceil(charSet.length / 10); i < n; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = document.createElement("div");
      const char = charSet[i * 10 + j];
      cell.textContent = char;
      if (char) {
        cell.classList.add("glyph");
      }
      cells.push(cell);
    }
  }
  return cells;
}

// Get document elements
const main = document.querySelector("main");
for (const [name, charSet] of glyphCollection) {
  const container = document.createElement("section");
  container.setAttribute("aria-labelledby", toKebabCase(name));
  const header = document.createElement("h2");
  header.textContent = name;
  header.classList.add("charset-heading");

  const grid = document.createElement("section");
  grid.classList.add("grid");
  grid.replaceChildren(...createGlyphCells(charSet));

  container.append(header, grid);
  main.append(container);
}
const display = document.querySelector("#display");
const displayGlyph = document.querySelector("#display-glyph");

// Create roving grids
document.querySelectorAll(".grid").forEach((grid) => {
  rovingGrid({ element: grid, target: ".glyph", wrap: true });

  grid.addEventListener(
    "pointermove",
    (e) => {
      const { target } = e;
      if (target.classList.contains("glyph")) {
        target.tabIndex = 0;
        target.focus();
      }
    },
    { passive: false }
  );

  grid.addEventListener("focusin", (e) => {
    const { target } = e;
    if (target.classList.contains("glyph")) {
      displayGlyph.textContent = target.textContent;
    }
  });
});

display.addEventListener("pointerenter", (e) => {
  const { offsetX, offsetY } = e;
  const x = offsetX - e.currentTarget.offsetWidth / 2;
  const y = offsetY - e.currentTarget.offsetHeight / 2;
  const angle = Math.atan2(y, x) / 4;
  displayGlyph.style.transform = `rotate(${angle}rad)`;
});

display.addEventListener("pointerleave", () => {
  displayGlyph.style.transform = "";
});
