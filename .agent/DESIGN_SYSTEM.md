# Design System: Hand-Drawn Sketchbook

## 1. Visual Identity
**HAND-DRAWN + SKETCHBOOK + PAPER + HUMAN + PLAYFUL**
Rejecting generic corporate SaaS and purple/blue AI gradients. The interface feels like an architect's or creative founder's physical sketchbook, featuring paper textures, wobbly ink strokes, hard drop-shadows, washi tape, and hand-written annotations.

## 2. Color Tokens
| Token | Hex | Role / Metaphor |
|---|---|---|
| `bg-paper` | `#fdfbf7` | Warm, creamy sketchbook paper |
| `ink` / `foreground` | `#2d2d2d` | Charcoal pencil / dark fountain pen ink |
| `muted-paper` | `#e5e0d8` | Draft pencil lines / dot grid / subtle borders |
| `accent-red` | `#ff4d4d` | Red pen stamp / alert highlighter / circle mark |
| `secondary-blue` | `#2d5da1` | Classic ballpoint pen blue |
| `postit-yellow` | `#fff9c4` | Classic 3M canary yellow sticky note |
| `postit-pink` | `#ffd1dc` | Pastel pink sticky note |
| `postit-green` | `#d4edda` | Pastel mint sticky note |
| `washi-tape` | `rgba(229, 224, 216, 0.7)` | Semi-transparent textured masking tape |

## 3. Typography
- **Headings**: Google Font `Kalam` (700 weight). Expressive, organic handwriting.
- **Body / Data**: Google Font `Patrick Hand` (400 weight). Highly legible, clean handwritten print.
- **Monospace / Numbers**: Clean monospaced font with handwriting accents.

## 4. Irregular Wobbly Borders
Major containers, cards, buttons, and inputs must use wobbly border radius rather than standard rounded corners:
```css
/* Wobbly border radius utilities */
.wobbly {
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
}
.wobbly-sm {
  border-radius: 180px 10px 160px 12px / 12px 170px 10px 180px;
}
.wobbly-md {
  border-radius: 240px 18px 230px 14px / 14px 230px 18px 240px;
}
.wobbly-badge {
  border-radius: 90px 12px 80px 10px / 10px 85px 12px 90px;
}
```

## 5. Hard Ink Drop Shadows
No soft blurry shadows! Hard ink outlines create physical depth:
```css
.shadow-hard-sm {
  box-shadow: 2px 2px 0px 0px #2d2d2d;
}
.shadow-hard {
  box-shadow: 4px 4px 0px 0px #2d2d2d;
}
.shadow-hard-lg {
  box-shadow: 8px 8px 0px 0px #2d2d2d;
}

/* Tactile button press interaction */
.btn-wobbly:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0px 0px #2d2d2d;
}
.btn-wobbly:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0px 0px #2d2d2d;
}
```

## 6. Paper Texture & Dot Grid
```css
.bg-notebook-grid {
  background-color: #fdfbf7;
  background-image: radial-gradient(#d3cdc4 1.2px, transparent 1.2px);
  background-size: 24px 24px;
}
```

## 7. Tactile Visual Signatures
- **Washi Tape Strip**: A small rectangular band across the top of cards with slightly jagged edges.
- **Thumbtack / Pin**: A circular pin graphic with a hard shadow at the top center of sticky notes.
- **Scribble Underline**: SVG hand-drawn wave/squiggle beneath important headings.
- **Sticky Note Tilt**: Subtle CSS rotations (`rotate-[-1deg]`, `rotate-[1.5deg]`, `rotate-[-2deg]`).

## 8. Aceternity UI Component Adaptations
- **Bento Grid**: Styled with `bg-paper`, 2px solid `ink` border, `shadow-hard`, wobbly corners.
- **Card Spotlight**: Replaced neon laser glow with soft warm graphite highlighter reflection.
- **Animated Tabs**: Styled as physical sketchbook divider tabs with ink borders.
