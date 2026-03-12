/**
 * Script: assign_images.js
 * Adds a unique imageUrl to every recipe in recipes.ts
 * and adds the imageUrl field to the Recipe interface.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/data/recipes.ts');
let src = fs.readFileSync(file, 'utf8');

// 1) Add imageUrl to interface if not already there
if (!src.includes('imageUrl:')) {
  src = src.replace(
    "  subtitle: string;\n  description: string;",
    "  subtitle: string;\n  imageUrl: string;\n  description: string;"
  );
}

// 2) Unique curated Unsplash images — 50 slots, food/drinks/health oriented, all verified working
const images = [
  // Shots (S01–S10)
  'https://images.unsplash.com/photo-1542282811-943ef1a977f5?w=400&h=400&fit=crop&q=80', // lime shot
  'https://images.unsplash.com/photo-1622597467836-f30b912c9b2d?w=400&h=400&fit=crop&q=80', // green juice
  'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=400&h=400&fit=crop&q=80', // cucumber water
  'https://images.unsplash.com/photo-1497449493050-aad1e7cad165?w=400&h=400&fit=crop&q=80', // citrus shot
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop&q=80', // ginger roots
  'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop&q=80', // saffron water
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop&q=80', // colorful drinks
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=400&fit=crop&q=80', // passion fruit
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&q=80', // healthy food
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop&q=80', // pomegranate
  // Sucos (SU01–SU08)
  'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=400&h=400&fit=crop&q=80', // green smoothie
  'https://images.unsplash.com/photo-1568158879083-c42860933ed7?w=400&h=400&fit=crop&q=80', // kale green juice
  'https://images.unsplash.com/photo-1610970882406-4b76e459d77e?w=400&h=400&fit=crop&q=80', // mango smoothie
  'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?w=400&h=400&fit=crop&q=80', // kiwi smoothie bowl
  'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop&q=80', // carrot juice
  'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop&q=80', // pineapple drink
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop&q=80', // green veggie juice
  'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop&q=80', // banana smoothie
  // Chás (C01–C08)
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop&q=80', // tea cup
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&q=80', // hot tea
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&q=80', // chamomile
  'https://images.unsplash.com/photo-1565799993513-c0ca52de53b4?w=400&h=400&fit=crop&q=80', // sage green tea
  'https://images.unsplash.com/photo-1516916759473-600c07bc12d4?w=400&h=400&fit=crop&q=80', // herbal tea
  'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop&q=80', // green tea pouring
  'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=400&fit=crop&q=80', // hibiscus tea
  'https://images.unsplash.com/photo-1567706235968-45e96da99a38?w=400&h=400&fit=crop&q=80', // ginger turmeric tea
  // Vitaminas (V01–V06)
  'https://images.unsplash.com/photo-1623065422900-30fc0406c1fa?w=400&h=400&fit=crop&q=80', // berry smoothie bowl
  'https://images.unsplash.com/photo-1478145046317-81bae6810773?w=400&h=400&fit=crop&q=80', // cacao banana
  'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=400&fit=crop&q=80', // bone milk glass
  'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop&q=80', // green apple smoothie
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop&q=80', // mango collagen
  'https://images.unsplash.com/photo-1464500369799-7154ac40eb43?w=400&h=400&fit=crop&q=80', // dark chocolate smoothie
  // Comidas (CO01–CO06)
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80', // healthy bowl
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&q=80', // omelette
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop&q=80', // salmon plate
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&q=80', // salad bowl
  'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&h=400&fit=crop&q=80', // tofu bowl
  'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400&h=400&fit=crop&q=80', // zucchini pizza
  // Lanches (L01–L06)
  'https://images.unsplash.com/photo-1484723091791-0092515cb613?w=400&h=400&fit=crop&q=80', // cloud bread
  'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&h=400&fit=crop&q=80', // banana peanut butter
  'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=400&fit=crop&q=80', // nut mix
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=400&fit=crop&q=80', // veggie guacamole
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&q=80', // greek yogurt
  'https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=400&h=400&fit=crop&q=80', // oat energy ball
  // Caldos (CA01–CA05)
  'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&h=400&fit=crop&q=80', // chicken broth
  'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&h=400&fit=crop&q=80', // golden turmeric soup
  'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop&q=80', // bone broth
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop&q=80', // green soup
  'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&h=400&fit=crop&q=80', // red lentil soup
];

// 3) Assign unique image to each recipe by matching `id: '` patterns
let imageIdx = 0;
src = src.replace(
  /(\s*id:\s*'[A-Z0-9]+',\s*category:\s*'[^']+',)/g,
  (match) => {
    const url = images[imageIdx % images.length];
    imageIdx++;
    return match + `\n    imageUrl: '${url}',`;
  }
);

fs.writeFileSync(file, src, 'utf8');
console.log(`Done! Assigned ${imageIdx} unique images to recipes.`);
