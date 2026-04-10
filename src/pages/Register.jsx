import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.password2
    );
    setLoading(false);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-16">
      <Toaster position="top-right" />
      
      <div className="glass-panel rounded-2xl p-8 w-full max-w-md neon-glow">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-space font-black text-primary mb-2">Join the Void</h1>
          <p className="text-on-surface-variant">Create your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              autoComplete="new-password"
              value={formData.password2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-surface-container-highest text-on-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 primary-gradient text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-on-surface-variant text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;