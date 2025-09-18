// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const Sweet = require('./models/Sweet');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Sample data for development
const sampleSweets = [
  { 
    name: 'Chocolate Truffle', 
    category: 'chocolate', 
    price: 249, 
    quantity: 50,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Rich, decadent chocolate truffles with a smooth ganache center'
  },
  { 
    name: 'Strawberry Gummy Bears', 
    category: 'gummy', 
    price: 120, 
    quantity: 100,
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Chewy strawberry-flavored gummy bears bursting with fruity goodness'
  },
  { 
    name: 'Vanilla Lollipop', 
    category: 'lollipop', 
    price: 80, 
    quantity: 75,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Classic vanilla-flavored lollipops with a creamy, smooth taste'
  },
  { 
    name: 'Mint Hard Candy', 
    category: 'hard candy', 
    price: 165, 
    quantity: 60,
    image: 'https://images.unsplash.com/photo-1575224300306-1b8bc36a7d68?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Refreshing mint hard candies with a cool, invigorating flavor'
  },
  { 
    name: 'Rainbow Candy Canes', 
    category: 'candy', 
    price: 289, 
    quantity: 40,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Colorful striped candy canes with multiple fruity flavors'
  },
  { 
    name: 'Dark Chocolate Bar', 
    category: 'chocolate', 
    price: 415, 
    quantity: 30,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Premium dark chocolate bar with 70% cocoa content'
  },
  { 
    name: 'Sour Gummy Worms', 
    category: 'gummy', 
    price: 205, 
    quantity: 80,
    image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Tangy sour gummy worms with a perfect balance of sweet and sour'
  },
  { 
    name: 'Caramel Lollipop', 
    category: 'lollipop', 
    price: 105, 
    quantity: 65,
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Golden caramel lollipops with a rich, buttery flavor'
  },
  { 
    name: 'Assorted Macarons', 
    category: 'chocolate', 
    price: 499, 
    quantity: 25,
    image: 'https://images.unsplash.com/photo-1558312657-b2f7e2c1a3d6?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Delicate French macarons in assorted flavors and colors'
  },
  { 
    name: 'Cotton Candy', 
    category: 'candy', 
    price: 330, 
    quantity: 20,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Fluffy, melt-in-your-mouth spun sugar cotton candy'
  },
  { 
    name: 'Rainbow Gummy Rings', 
    category: 'gummy', 
    price: 148, 
    quantity: 90,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Colorful gummy rings with fruity flavors in every bite'
  },
  { 
    name: 'Peppermint Humbugs', 
    category: 'hard candy', 
    price: 190, 
    quantity: 70,
    image: 'https://images.unsplash.com/photo-1540221652346-e5dd1f50b2f1?w=400&h=400&fit=crop&ixlib=rb-4.0.3',
    description: 'Traditional striped peppermint hard candies with intense mint flavor'
  }
];

// Setup MongoDB
const setupDatabase = async () => {
  let mongoUri;
  
  if (MONGODB_URI) {
    // Use configured MongoDB URI (production or development)
    console.log(`📊 Using configured MongoDB...`);
    mongoUri = MONGODB_URI;
  } else {
    // Use in-memory MongoDB for development
    console.log('🔧 Starting in-memory MongoDB for development...');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }
  
  return mongoUri;
};

// Seed database with sample data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Sweet.deleteMany({});
    await User.deleteMany({});
    
    // Create sample sweets
    await Sweet.insertMany(sampleSweets);
    console.log(`✅ Seeded ${sampleSweets.length} sample sweets`);
    
    // Create sample admin user
    await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@sweetshop.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });
    
    // Create sample regular user
    await User.create({
      name: process.env.USER_NAME || 'John Customer',
      email: process.env.USER_EMAIL || 'user@sweetshop.com',
      password: process.env.USER_PASSWORD || 'user123',
      role: 'user'
    });
    
    console.log('✅ Created sample users:');
    console.log('   Admin: admin@sweetshop.com / admin123');
    console.log('   User:  user@sweetshop.com / user123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Start the application
const startServer = async () => {
  try {
    const mongoUri = await setupDatabase();
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Seed database with sample data
    await seedDatabase();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🍭 ${process.env.APP_NAME || 'Sweet Shop Management System'} v${process.env.API_VERSION || '1.0.0'}`);
      console.log(`🍭 Backend Server running on port ${PORT}`);
      console.log(`🌐 Server listening on: http://${HOST}:${PORT}`);
      console.log(`📖 API Documentation: http://${HOST}:${PORT}`);
      console.log(`🍬 Test API: http://${HOST}:${PORT}/api/sweets`);
      console.log(`🔧 Environment: ${NODE_ENV}`);
      console.log('');
      console.log('🎯 Test Credentials:');
      console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@sweetshop.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
      console.log(`   User:  ${process.env.USER_EMAIL || 'user@sweetshop.com'} / ${process.env.USER_PASSWORD || 'user123'}`);
    });
    
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
    
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();