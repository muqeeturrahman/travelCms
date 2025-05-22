import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightTakeoff, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:3008/api';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Store token in localStorage for persistence across browser sessions
        localStorage.setItem('authToken', response.data.data.token);
        
        // Store user data in sessionStorage (cleared when browser is closed)
        const userData = response.data.data.user;
        delete userData.password; // Remove sensitive data
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('isAuthenticated', 'true');

        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const token = localStorage.getItem('authToken');
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-[420px] mx-4 bg-white rounded-3xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FlightTakeoff className="text-3xl" />
            <h1 className="text-2xl font-bold">Go Trip</h1>
          </div>
          <h2 className="text-gray-600 text-lg">Welcome Back!</h2>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-600 text-sm"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-600 text-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-600 text-sm">Remember me</span>
            </label>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              disabled={loading}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}