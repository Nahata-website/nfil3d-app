// Guides and quiz content. General best-practice only — product-specific
// steps (levelling, firmware, temperatures) must come from the NFIL3D product team.

export type Guide = { id: string; title: string; meta: string; productMatch?: RegExp; steps: string[] };

export const GUIDES: Guide[] = [
  {
    id: 'first-print',
    title: 'Your first print',
    meta: 'All printers · 6 steps',
    productMatch: /^n2 3d printer/i,
    steps: [
      'Place the printer on a stable, level surface away from drafts.',
      'Load 1.75 mm filament and confirm the material matches your slicer profile.',
      'Level the bed and clean it with isopropyl alcohol before printing.',
      'Slice a small test model, such as a calibration cube or Benchy.',
      'Copy the file to the SD card or pendrive and start the print from the printer.',
      'Watch the first layer: it should be flat and lightly squished onto the bed.',
    ],
  },
  {
    id: 'filament-storage',
    title: 'Storing filament',
    meta: 'Filaments · 4 steps',
    productMatch: /rpla/i,
    steps: [
      'Keep opened spools in a sealed bag or box with desiccant.',
      'Store away from direct sunlight and heat.',
      'Clip the loose end into the spool edge so it does not tangle.',
      'If prints turn stringy or brittle, dry the filament before use.',
    ],
  },
  {
    id: 'pen-start',
    title: '3D pen: getting started',
    meta: '3D pens · 5 steps',
    productMatch: /pen kit/i,
    steps: [
      'Connect the pen with the supplied cable and let it heat up.',
      'Insert a refill until it starts to extrude.',
      'Trace a stencil on a flat sheet first, then lift parts into 3D.',
      'Let each part cool for a few seconds before joining.',
      'Adult supervision is recommended for children: the nozzle gets hot.',
    ],
  },
  {
    id: 'materials',
    title: 'Choosing a material',
    meta: 'PLA+, PETG, ABS, TPU',
    steps: [
      'PLA / PLA+: easiest to print, good detail, everyday models.',
      'PETG: tougher and more heat-resistant, good for functional parts.',
      'ABS / ASA: heat resistant; print in an enclosure with ventilation.',
      'TPU: flexible parts such as cases and gaskets; print slowly.',
    ],
  },
];

export type Question = { q: string; options: string[]; answer: number; why: string };

export const QUIZ: Question[] = [
  { q: 'Which material is usually the easiest for a first print?', options: ['PLA', 'ABS', 'Nylon', 'TPU'], answer: 0, why: 'PLA prints at lower temperatures and warps less.' },
  { q: 'What filament diameter do NFIL3D filaments use?', options: ['1.75 mm', '2.85 mm', '3.00 mm', '0.40 mm'], answer: 0, why: 'NFIL3D filaments are listed as 1.75 mm.' },
  { q: 'Which material is flexible?', options: ['TPU', 'PLA+', 'ABS FR', 'PETG'], answer: 0, why: 'TPU is a flexible thermoplastic.' },
  { q: 'What is a “Benchy”?', options: ['A test boat model', 'A bed type', 'A nozzle size', 'A slicer'], answer: 0, why: '3DBenchy is a popular printer calibration model.' },
  { q: 'How should opened filament be stored?', options: ['Sealed with desiccant', 'In direct sunlight', 'Unwrapped on a shelf', 'In the fridge, open'], answer: 0, why: 'Many filaments absorb moisture from the air.' },
];
