const fs = require('fs');
const path = require('path');

const recipesFile = path.join(__dirname, 'src/data/recipes.ts');
let recipes = fs.readFileSync(recipesFile, 'utf8');

// Replace IMAGE_MAP usages in the app if any
const dashboardFile = path.join(__dirname, 'src/app/dashboard/page.tsx');
let dashboard = fs.readFileSync(dashboardFile, 'utf8');
dashboard = dashboard.replace(/IMAGE_MAP\[selectedRecipe\.category\]/g, 'selectedRecipe.imageUrl');
fs.writeFileSync(dashboardFile, dashboard, 'utf8');

const receitasPage = path.join(__dirname, 'src/app/receitas/page.tsx');
let receitas = fs.readFileSync(receitasPage, 'utf8');
receitas = receitas.replace(/IMAGE_MAP\[recipe\.category\]/g, 'recipe.imageUrl');
receitas = receitas.replace(/IMAGE_MAP\[selectedRecipe\.category\]/g, 'selectedRecipe.imageUrl');
fs.writeFileSync(receitasPage, receitas, 'utf8');

// The list of unique images for the recipes to feel premium
const images = [
  'https://images.unsplash.com/photo-1542282811-943ef1a977f5?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1622597467836-f30b912c9b2d?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559561853-08451507cbe7?q=80&w=400&h=400&fit=crop',
  'https://plus.unsplash.com/premium_photo-1663852297267-827c73e7529e?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497888329096-51c27beff665?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1481070414801-51fd732d7184?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1484723091791-0092515cb613?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511690656956-f288bd6b40e5?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504113886839-4d8dbbd341cd?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1490818387583-1b5e59b336bb?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400&h=400&fit=crop',
  'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1623366302587-bcaad5547b74?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1520173043187-573e867dc1f2?q=80&w=400&h=400&fit=crop'
];

let imageCounter = 0;

// Add generic image prop to interface if not there
if(recipes.indexOf('imageUrl: string;') === -1) {
  recipes = recipes.replace('id: string;', 'id: string;\n  imageUrl: string;');
}

// Ensure RECIPES gets unique image URLs
recipes = recipes.replace(/category:\s*'[^']+',/g, (match) => {
  const url = images[imageCounter % images.length];
  imageCounter++;
  return match + "\n    imageUrl: '" + url + "',";
});

fs.writeFileSync(recipesFile, recipes, 'utf8');

// Also remove costs from supplements.ts
const suppsFile = path.join(__dirname, 'src/data/supplements.ts');
let supps = fs.readFileSync(suppsFile, 'utf8');
supps = supps.replace(/\s*costRange:\s*'[^']+',?/g, '');
supps = supps.replace(/\s*costRange:\s*string;/g, '');
supps = supps.replace(/Custo estimado:.*?(\r?\n)/g, '');
fs.writeFileSync(suppsFile, supps, 'utf8');

console.log('Images attached and costs removed!');
