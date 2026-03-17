import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerFonts() {
  if (registered) return;
  registered = true;

  // ── Cairo – Modern Arabic font (supports Arabic + Latin) ────────────────────
  // Using jsDelivr CDN with TTF format (reliable for @react-pdf/renderer)
  Font.register({
    family: "NotoArabic",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/cairo@latest/arabic-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        // Use normal as italic fallback (Arabic has no italic form)
        src: "https://cdn.jsdelivr.net/fontsource/fonts/cairo@latest/arabic-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/cairo@latest/arabic-700-normal.ttf",
        fontWeight: 700,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/cairo@latest/arabic-700-normal.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  // ── Roboto – Clean Latin font ────────────────────────────────────────────────
  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf",
        fontWeight: 400,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-italic.ttf",
        fontWeight: 400,
        fontStyle: "italic",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.ttf",
        fontWeight: 700,
        fontStyle: "normal",
      },
      {
        src: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-italic.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  // Prevent hyphenation across all words
  Font.registerHyphenationCallback((word) => [word]);
}
