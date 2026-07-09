const CDN = 'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket';

const ITEM_IMAGES: { prefix: string; img: string }[] = [
  { prefix: 'certificate', img: `${CDN}/858c5def-a2d9-4503-aef3-192e73b205e1.png` },
  { prefix: 'kids', img: `${CDN}/cd92a426-9a1e-4eba-81fa-09e5b75b623d.jpg` },
  { prefix: 'promo', img: `${CDN}/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png` },
  { prefix: 'thematic', img: `${CDN}/0bce1c46-ce6d-45d4-9a78-fc97b423975d.jpg` },
  { prefix: 'date', img: `${CDN}/0691624f-cc62-4d3b-8069-e5ab1d935b18.png` },
  { prefix: 'coworking', img: `${CDN}/42ebb68f-5d36-4a32-b4bd-b871307db9bc.jpg` },
];

const DEFAULT_ITEM_IMAGE = `${CDN}/031d0b25-5ce6-4c27-8e82-d33ec3b0b178.png`;

export const itemImage = (id: string) =>
  ITEM_IMAGES.find((m) => id.startsWith(m.prefix))?.img ?? DEFAULT_ITEM_IMAGE;
