// Function to generate AI-based image URL from product name (same as in server.js)
const generateAIImageURL = (productName) => {
  // Using Pollinations.ai for AI-generated images based on product name
  const prompt = encodeURIComponent(`${productName} sweet candy confectionery food photography high quality`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=400&height=400&seed=${Math.floor(Math.random() * 1000)}`;
};

console.log('🍬 Sweet Shop AI Image Generation Demo');
console.log('=====================================\n');

const sampleSweets = [
  'Chocolate Truffle',
  'Strawberry Gummy Bears', 
  'Vanilla Lollipop',
  'Mint Hard Candy',
  'Rainbow Candy Canes',
  'Dark Chocolate Bar',
  'Sour Gummy Worms',
  'Caramel Lollipop',
  'Assorted Macarons',
  'Cotton Candy',
  'Rainbow Gummy Rings',
  'Peppermint Humbugs'
];

console.log('✨ AI-Generated Image URLs for Sweet Products:');
console.log('───────────────────────────────────────────────\n');

sampleSweets.forEach((sweetName, index) => {
  const imageUrl = generateAIImageURL(sweetName);
  console.log(`${index + 1}. ${sweetName}`);
  console.log(`   🖼️  ${imageUrl}`);
  console.log('');
});

console.log('🎯 How it works:');
console.log('- Each product name is converted to an AI image prompt');
console.log('- Using Pollinations.ai free AI image generation service');
console.log('- Images are 400x400 pixels, optimized for web display');
console.log('- Each product gets a unique image based on its name');
console.log('- New products automatically get AI-generated images');

console.log('\n✅ AI Image Integration Complete!');
console.log('📸 All sweet shop products now have AI-generated images');
console.log('🚀 No need for manual image uploads or stock photos');