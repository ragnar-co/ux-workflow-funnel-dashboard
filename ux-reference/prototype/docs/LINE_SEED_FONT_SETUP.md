# LINE Seed Sans Thai Font Setup

Use LINE Seed Sans Thai as the primary font for the NPS webapp.

## Required Files

Place the font files here:

```text
assets/fonts/
  LINESeedSansTH_W_Rg.woff2
  LINESeedSansTH_W_Bd.woff2
```

Optional fallback if `woff2` is unavailable:

```text
assets/fonts/
  LINESeedSansTH_W_Rg.woff
  LINESeedSansTH_W_Bd.woff
```

## CSS Usage

Import the font setup before the main stylesheet:

```html
<link rel="stylesheet" href="./src/fonts.css" />
<link rel="stylesheet" href="./src/styles.css" />
```

Set the app font through a CSS variable:

```css
body {
  font-family: var(--font-sans);
}
```

## UX Note

The visual mock generated in this workspace uses a local fallback font because the real LINE Seed Sans Thai font file is not installed here. The implementation should use the `@font-face` rules above once the licensed/company font files are added.
