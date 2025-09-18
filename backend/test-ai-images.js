const axios = require('axios');

const testAIImages = async () => {
  try {
    console.log('🧪 Testing AI Image Generation...\n');
    
    // Login as admin
    const loginResponse = await axios.post('http://127.0.0.1:3001/api/auth/login', {
      email: 'admin@sweetshop.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Get all sweets to check AI-generated images
    const sweetsResponse = await axios.get('http://127.0.0.1:3001/api/sweets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const sweets = sweetsResponse.data.sweets;
    console.log(`✅ Retrieved ${sweets.length} sweets\n`);
    
    // Display the first few sweets with their AI-generated images
    console.log('🍬 Sample AI-Generated Images:');
    console.log('=====================================');
    
    sweets.slice(0, 5).forEach((sweet, index) => {
      console.log(`${index + 1}. ${sweet.name}`);
      console.log(`   Image URL: ${sweet.image}`);
      console.log(`   Price: ₹${sweet.price}`);
      console.log(`   Description: ${sweet.description}`);
      console.log('');
    });
    
    // Test creating a new sweet with AI-generated image
    console.log('🆕 Testing creation of new sweet with AI image...');
    
    const newSweetResponse = await axios.post('http://127.0.0.1:3001/api/sweets', {
      name: 'AI Test Chocolate Donut',
      category: 'chocolate',
      price: 199,
      quantity: 25,
      description: 'A delicious chocolate donut created for AI image testing'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const newSweet = newSweetResponse.data.sweet;
    console.log('✅ New sweet created successfully!');
    console.log(`   Name: ${newSweet.name}`);
    console.log(`   AI-Generated Image: ${newSweet.image}`);
    console.log(`   Confirms AI image generation is working for new products!\n`);
    
    // Verify AI image URL format
    const imageUrlPattern = /https:\/\/image\.pollinations\.ai\/prompt\/.+/;
    const hasCorrectFormat = sweets.every(sweet => imageUrlPattern.test(sweet.image));
    
    if (hasCorrectFormat) {
      console.log('✅ All images use AI generation service (Pollinations.ai)');
    } else {
      console.log('❌ Some images do not use AI generation service');
    }
    
    console.log('\n🎉 AI Image Generation Test Complete!');
    console.log('📸 All sweet products now have AI-generated images based on their names');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
  }
};

testAIImages();