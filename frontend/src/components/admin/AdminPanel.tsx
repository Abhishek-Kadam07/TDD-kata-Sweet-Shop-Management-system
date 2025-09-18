import React, { useState, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'chocolate',
    price: '',
    quantity: '',
    image: '',
    description: ''
  });

  const categories = ['chocolate', 'candy', 'gummy', 'hard candy', 'lollipop'];

  useEffect(() => {
    // Redirect if not admin
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchSweets();
  }, [user, navigate]);

  const fetchSweets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/sweets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // The API returns { sweets: [...] }, so we need response.data.sweets
      const sweetsData = response.data.sweets || response.data;
      if (Array.isArray(sweetsData)) {
        setSweets(sweetsData);
      } else {
        console.error('API response is not an array:', response.data);
        setSweets([]);
        setError('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching sweets:', err);
      setSweets([]);
      setError('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const sweetData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingSweet) {
        await axios.put(
          `http://localhost:3001/api/sweets/${editingSweet._id}`,
          sweetData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/sweets',
          sweetData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setFormData({ name: '', category: 'chocolate', price: '', quantity: '', image: '', description: '' });
      setShowAddForm(false);
      setEditingSweet(null);
      fetchSweets();
    } catch (err) {
      setError('Failed to save sweet');
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image: sweet.image || '',
      description: sweet.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (sweetId: string) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/sweets/${sweetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSweets();
    } catch (err) {
      setError('Failed to delete sweet');
    }
  };

  const handleRestock = async (sweetId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/sweets/${sweetId}/restock`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSweets();
    } catch (err) {
      setError('Failed to restock sweet');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSweet(null);
    setFormData({ name: '', category: 'chocolate', price: '', quantity: '', image: '', description: '' });
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Add New Sweet
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    {editingSweet ? 'Update Sweet' : 'Add Sweet'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sweets Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sweets.map((sweet) => (
                  <tr key={sweet._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sweet.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {sweet.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{sweet.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sweet.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(sweet)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet._id, 10)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Restock (+10)
                      </button>
                      <button
                        onClick={() => handleDelete(sweet._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sweets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sweets available. Add some sweets to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;