const llmsText = `# AKA Sounds

AKA Sounds creates sound design and sample packs for hard dance, rawstyle, hardstyle and hard techno producers.

## Public pages
- Homepage: https://akasounds.com/
- Sample pack catalog: https://akasounds.com/#sample-packs
- Hardtechno Essentials Vol. 01: https://akasounds.com/sounds/hardtechno-essentials-vol-1
- Modern Raw Kick Arsenal Vol. 1 — Full Edition: https://akasounds.com/sounds/modern-raw-kick-arsenal-vol-1
- Tutorials: https://akasounds.com/#tutorials
- Free sounds: https://akasounds.com/#free-sounds

## Modern Raw Kick Arsenal Vol. 1 — Full Edition
- 151 raw kick samples
- 31 full kicks
- 120 kick-building components
- 4 FL Studio kick projects
- 3 Serum 2 presets
- Previews on the product page come from the Free Edition.

## Modern Raw Kick Arsenal Vol. 1 — Free Edition
- 13 raw kick samples
- 3 full kicks
- 10 components

## Hardtechno Essentials
See the product page for the verified product details and current offer.
`;

export function GET() {
  return new Response(llmsText, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
