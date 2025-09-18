import React, { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import axios from 'axios';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['chocolate', 'candy', 'gummy', 'hard candy', 'lollipop'];

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      console.log('Fetching sweets with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get('http://localhost:3001/api/sweets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.sweets && Array.isArray(response.data.sweets)) {
        console.log('Successfully setting sweets:', response.data.sweets.length, 'items');
        setSweets(response.data.sweets);
        setError(''); // Clear any previous errors
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected data format from server');
        setSweets([]);
      }
    } catch (err: any) {
      console.error('Error fetching sweets:', err);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
      } else {
        setError('Failed to fetch sweets: ' + (err.response?.data?.error || err.message || 'Unknown error'));
      }
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (sweetId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/sweets/${sweetId}/purchase`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSweets(); // Refresh the list
    } catch (err) {
      setError('Failed to purchase sweet');
    }
  };

  const filteredSweets = Array.isArray(sweets) ? sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || sweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
            🍭 Sweet Shop Dashboard
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🔍 Search Sweets
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏷️ Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sweets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSweets.map((sweet) => (
              <div 
                key={sweet._id} 
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 border border-white/30"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={sweet.image || 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop'}
                    alt={sweet.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 capitalize">
                      {sweet.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    {sweet.name}
                  </h3>
                  
                  {sweet.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {sweet.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{sweet.price}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sweet.quantity > 10 
                        ? 'bg-green-100 text-green-800' 
                        : sweet.quantity > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  {sweet.quantity > 0 ? (
                    <button
                      onClick={() => handlePurchase(sweet._id, 1)}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      🛒 Add to Cart
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-200 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed opacity-60"
                    >
                      😔 Out of Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredSweets.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍭</div>
              <p className="text-gray-500 text-xl mb-2">No sweets found matching your criteria.</p>
              <p className="text-gray-400">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;