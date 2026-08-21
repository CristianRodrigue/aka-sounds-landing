# SAMPLE PACKS — IMPLEMENTATION SPEC

Measurements extracted from the approved Pen frame only. No redesign.

## Source

- Pen file: `v2/design/AKA_SOUNDS_V2_MASTER.pen`
- Approved frame: `APPROVED / FROZEN — SAMPLE PACKS`
- Frame id: `qujDP`
- Frame bounds: `x=9360, y=5660, width=1440, height=1450`
- Browser placement: immediately after the locked 900px Hero; section starts at page `y=900`.

## Section geometry

- Nested surface: `A3 section surface`
- Surface bounds inside approved frame: `x=0, y=900, width=1440, height=550`
- Browser section bounds: `x=0, y=900, width=1440, height=550`
- Background: `#F1F1ED`
- End rule: `x=72, y=1335, width=1228, height=1`, fill `#B7B7B1`

## Shape Grid

- Node: `SAMPLE PACKS Shape Grid — inverted background` (`fzOV0`)
- Bounds: `x=0, y=900, width=1440, height=550`
- Polygon count: `3`
- Polygon bounds: `30×30`
- Fill: transparent `#00000000`
- Stroke: `#20202012`
- Stroke width: `1`
- X positions: `720, 876, 1032, 1188, 1344`
- Y positions: `30, 82, 134, 186, 238, 290, 342, 394, 446, 498` relative to the section surface
- Rotation pattern by row: even rows `0, 180, 0, 180, 0`; odd rows `180, 0, 180, 0, 180`
- Motion: none

## Section text

| Element | Position | Content | Font | Size | Weight | Line height | Letter spacing | Color |
| --- | ---: | --- | --- | ---: | ---: | --- | --- | --- |
| Section index | `x=72, y=938` | `02 / PRODUCTS` | Inter | 11 | 700 | Pen default; not explicit | Pen default; not explicit | `#60605C` |
| Heading | `x=72, y=965` | `SAMPLE PACKS` | Space Grotesk | 52 | 700 | Pen default; not explicit | Pen default; not explicit | `#111111` |
| Supporting copy | `x=72, y=1022` | `One premium pack, one related free trial.` | Inter | 14 | normal | Pen default; not explicit | Pen default; not explicit | `#5A5A56` |

## Premium module

- Artwork node: `A3 premium artwork`
- Artwork bounds: `x=72, y=1080, width=240, height=240`
- Artwork asset: `v2/design/assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg` (local runtime asset `/assets/HARDTECHNO-ESSENTIALS-VOL.-1.jpg`)
- Artwork mode: `stretch`
- Information origin: `x=350, y=1090`
- Label: `PREMIUM SAMPLE PACK`, Inter 11, 700, color `#60605C`
- Title origin: `x=350, y=1120`
- Title: `HARDTECHNO ESSENTIALS` / `VOL. 01`, Space Grotesk 32, 700, color `#111111`
- Product type origin: `x=350, y=1210`
- Product type: `PAID / SAMPLE PACK`, Inter 11, 700, color `#60605C`
- CTA origin: `x=350, y=1250`
- CTA: `EXPLORE PACK →`, Space Grotesk 14, 700, color `#111111`

## Related Free Trial module

- Divider node: `A3 system divider`
- Divider bounds: `x=850, y=1080, width=1, height=240`, fill `#B7B7B1`
- Artwork node: `A3 free trial artwork`
- Artwork bounds: `x=875, y=1120, width=140, height=140`
- Artwork asset: `v2/design/assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg` (local runtime asset `/assets/HARDTECHNO-ESSENTIALS-VOL.-1-FREE-SAMPLEPACK.jpg`)
- Artwork mode: `stretch`
- Information origin: `x=1055, y=1095`
- Label: `RELATED FREE TRIAL`, Inter 11, 700, color `#60605C`
- Title origin: `x=1055, y=1122`
- Title: `HARDTECHNO ESSENTIALS` / `VOL. 01 FREE TRIAL`, Space Grotesk 18, 700, color `#111111`
- Product type origin: `x=1055, y=1205`
- Product type: `FREE TRIAL / SAMPLE PACK`, Inter 10, 700, color `#60605C`
- CTA origin: `x=1055, y=1245`
- CTA: `GET FREE TRIAL →`, Inter 11, 700, color `#111111`

## Implementation boundary

- Desktop target: `1440px`.
- No responsive behavior in this gate.
- No motion or React Bits.
- No product-data, commerce, backend, or integration changes.
- Navbar + Hero styles remain read-only.
