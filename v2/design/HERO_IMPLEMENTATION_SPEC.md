# AKA SOUNDS V2 — HERO IMPLEMENTATION SPEC

Source of truth: `C:\antigravity\aka-sounds\v2\design\AKA_SOUNDS_V2_MASTER.pen`
Approved frame: `HERO B2.3 / APPROVED / FROZEN — NAVBAR + HERO`
Desktop implementation gate: **1440 × 900**

This is a measured implementation document. It is not a redesign.

## Frame

- Frame: 1440 × 900
- Background: `#070707`
- Navigation surface: `#050505`
- Navigation height: 86px
- Navigation divider: x=0, y=85, width=1440, height=1, `#262626`

## Navbar

- Official lockup: x=48, y=18, width=190, height=52
- Source asset in Pen: `v2/design/assets/aka-logo-horizontal-white.png`
- Runtime asset: `/assets/aka-logo-horizontal-white-official.png`
- SAMPLE PACKS: x=360, y=34, width=128, Inter 12px / 600 / line-height 1 / letter-spacing 1.5, `#B2B2B2`
- FREE SOUNDS: x=520, y=34, width=112, Inter 12px / 600 / line-height 1 / letter-spacing 1.5, `#B2B2B2`
- TUTORIALS: x=660, y=34, width=94, Inter 12px / 600 / line-height 1 / letter-spacing 1.5, `#B2B2B2`
- ABOUT: x=782, y=34, width=62, Inter 12px / 600 / line-height 1 / letter-spacing 1.5, `#B2B2B2`
- BROWSE PACKS →: x=1232, y=34, width=160, Inter 12px / 700 / line-height 1 / letter-spacing 1.25, `#F1F1ED`

## Hero geometry

- Shape Grid frame: x=0, y=86, width=1440, height=814
- Artwork image: x=64, y=120, width=700, height=700, image mode `fill`
- Artwork source: `v2/design/assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`
- Artwork frame: x=64, y=120, width=700, height=700, 1px `#3E3E3E`
- Artwork veil: x=64, y=120, width=700, height=700, `#00000012`
- Artwork caption field: x=64, y=768, width=700, height=52, `#070707B8`
- Artwork caption: x=92, y=787, width=620, Inter 11px / 700 / line-height 1 / letter-spacing 1.5, `#D0D0D0`
- Caption content: `THE WEIGHT OF SOUND  /  HARDTECHNO ESSENTIALS`
- Vertical divider: x=828, y=120, width=1, height=700, `#383838`
- Right column starts: x=880

## Hero typography and controls

- FEATURED SAMPLE PACK: x=880, y=196, width=360, Inter 12px / 700 / line-height 1 / letter-spacing 1.9, `#C2C2C2`
- Title: x=880, y=250, width=386, Space Grotesk 62px / 800 / line-height 0.85 / letter-spacing -3.1px, `#FFFFFF`
- Title line break: `HARDTECHNO` / `ESSENTIALS`
- Volume: x=884, y=402, width=220, Space Grotesk 26px / 700 / line-height 1 / letter-spacing 1.4, `#D6D6D6`
- Supporting line: x=884, y=474, width=330, Inter 18px / normal / line-height 1.4, `#9A9A9A`
- Supporting copy: `Hard techno samples for modern production.`
- CTA field: x=880, y=590, width=236, height=52, radius 3, fill `#F1F1ED`
- CTA label: x=904, y=609, width=188, Inter 12px / 700 / line-height 1 / letter-spacing 1.3, `#080808`
- CTA content: `EXPLORE THE PACK  →`
- Metadata: x=880, y=698, width=300, Inter 11px / 700 / line-height 1 / letter-spacing 1.7, `#767676`
- Metadata content: `HARD TECHNO  /  SAMPLE PACK`

## Shape Grid

- Static only for this gate; no React Bits and no motion.
- Triangle geometry: 30×30px polygon.
- Fill: transparent (`#07070700`).
- Stroke: `#8A8A8A24`, 1px.
- Hero Shape Grid region: x=0, y=86, width=1440, height=814.
- Measured columns alternate between x=720, 876, 1032, 1188, 1344 and x=824, 980, 1136, 1292.
- Measured row positions: y=40, 92, 144, 196, 248, 300, 352, 404, 456, 508, 560, 612, 664 relative to the Shape Grid frame.

## Scope boundary

This spec covers only Navbar + Hero B2.3 at 1440×900. Sample Packs, Free Sounds, Tutorials, Brand, Newsletter, Footer, mobile, motion, backend and Production are out of scope for this gate.
