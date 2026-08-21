# FREE SOUNDS H1 — IMPLEMENTATION SPEC

Source of truth: `FREE SOUNDS H1 / HORIZONTAL RAIL` in `AKA_SOUNDS_V2_MASTER.pen`.

This is a measurement record only. It does not introduce responsive behavior, interaction, animation, or redesign.

## Frame and section geometry

- Pen frame: `FREE SOUNDS H1 / HORIZONTAL RAIL` (`j0t7o3`)
- Frame bounds: x `20000`, y `0`, width `1440`, height `2570`
- Production section: `FREE SOUNDS H1 production section` (`OVCMA`)
- Production section bounds within frame: x `0`, y `1450`, width `1440`, height `860`
- Background: `#070707`
- Frozen Tutorials context begins at y `2310`, height `260`; not implemented in this gate.
- Desktop target: `1440px`; no responsive work in this gate.

## Section introduction

- Index: x `72`, y `46`; `03 / FREE SOUNDS`; Inter `11px`, weight `700`, letter spacing `1.8px`, color `#9C9C98`.
- Heading: x `72`, y `75`; `FREE SOUNDS`; Space Grotesk `60px`, weight `700`, letter spacing `-1.5px`, color `#F1F1ED`.
- Description: x `72`, y `150`; `Free sounds for download and testing.`; Inter `15px`, normal weight, color `#9C9C98`.
- Explore action: x `1090`, y `104`; `EXPLORE ALL SOUNDS →`; Inter `11px`, weight `700`, letter spacing `1.2px`, color `#F1F1ED`.

## Horizontal rail

- Top rule: x `72`, y `198`, width `1228`, height `1`, color `#3B3B3B`.
- Product artwork size: `260 × 260px`.
- Product artwork y: `220`.
- Module x positions: `72`, `384`, `696`, `1008`.
- Module width: `260px`.
- Horizontal gap: `52px`.
- Module rule y: `496`, width `260`, height `1`, color `#5E5E5B`.
- Label y: `512`; Inter `10px`, weight `700`, letter spacing `1.2px`, color `#9C9C98`.
- Product title y: `540`; Space Grotesk `18px`, weight `700`, line height `0.95`, color `#F1F1ED`.
- Product action y: `600`; Inter `11px`, weight `700`, letter spacing `1.1px`, color `#F1F1ED`.

### Product modules

1. x `72`; artwork `Cover_FREE_SCREECH_Cyan.png`; title `SERUM 2 HARD DANCE / SCREECHES`.
2. x `384`; artwork `AkasoundsProductCover-Hardtechno.jpeg`; title `SERUM 2 HARDTECHNO / KICK`.
3. x `696`; artwork `AkasoundsProductCover-ZaagKick.jpeg`; title `SERUM 2 ZAAG KICK`.
4. x `1008`; artwork `AkasoundsProductCover.jpeg`; title `SERUM 2 REVERSE / BASS KICK`.

All four modules use the label `FREE SOUND` and action `GET FREE SOUND →`. No additional product metadata is present in the approved frame.

## Rail indicator

- Progress track: x `72`, y `674`, width `1228`, height `1`, color `#2B2B2B`.
- Progress position: x `72`, y `674`, width `352`, height `2`, color `#9C9C98`.
- Directional cue: x `1260`, y `648`; `→`; Inter `18px`, weight `700`, color `#F1F1ED`.
- End rule: x `72`, y `730`, width `1228`, height `1`, color `#3B3B3B`.
- Rail meta: x `72`, y `748`; `HORIZONTAL RAIL  /  4 FREE SOUNDS  /  DRAG TO EXPLORE`; Inter `10px`, weight `700`, letter spacing `1.35px`, color `#6F6F6A`.

## M2B static kinetic type layers

The type is graphic architecture, not a readable headline. All layers are positioned in the negative space and remain behind content.

- `HARD`: x `1110`, y `26`; Space Grotesk `230px`, weight `700`, letter spacing `-8px`, fill `#FFFFFF0A`.
- `FREE`: x `-90`, y `548`; Space Grotesk `240px`, weight `700`, letter spacing `-8px`, fill `#FFFFFF08`.
- `SOUND`: x `720`, y `628`; Space Grotesk `170px`, weight `700`, letter spacing `-6px`, fill `#FFFFFF07`.
- `AKA`: x `1260`, y `370`, rotation `90°`; Space Grotesk `210px`, weight `700`, letter spacing `-8px`, fill `#FFFFFF06`.
- No complete readable `FREE SOUNDS` background phrase.
- Static in this gate; no drift, marquee, glow, bounce, or rotation animation.

## Reduced Shape Grid

- Five outline-only triangles; transparent fill `#00000000`; stroke `#8A8A8A12`; stroke width `1px`.
- Each triangle: polygon, `polygonCount=3`, size `30 × 30px`.
- Positions within the production section: `(520,185)`, `(848,210)`, `(1210,250)`, `(540,560)`, `(910,610)`.
- Rotations: triangle 1 `0°`, triangle 2 `180°`, triangle 3 `0°`, triangle 4 `180°`, triangle 5 `0°`.
- Static and visibly lower density than Hero; no filled triangles and no React Bits implementation yet.

## Future behavior note

The Pen note specifies future desktop drag/trackpad horizontal scroll, restrained controls, scroll snap, mobile swipe, keyboard navigation, and reduced-motion compatibility. Those behaviors are not implemented in this gate.
