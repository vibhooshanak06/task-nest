import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';

const passwordRules = (pw) => {
  return [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', ok: /[a-z]/.test(pw) },
    { label: 'One number', ok: /\d/.test(pw) },
  ];
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    const rules = passwordRules(password);
    if (!rules.every((r) => r.ok)) {
      setError('Password does not meet the requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rules = passwordRules(form.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-3xl font-bold text-blue-600">TaskNest</h1>
          <p className="text-gray-500 mt-1">Create your free account</p>
        </div>

        <div className="card p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Get started</h2>

          <Alert message={error} type="error" onClose={() => setError('')} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Jane Smith"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setShowRules(true)}
                className="input"
                placeholder="Create a strong password"
                disabled={loading}
              />
              {/* Password strength checklist */}
              {showRules && form.password && (
                <ul className="mt-2 space-y-1">
                  {rules.map((r) => (
                    <li key={r.label} className={`text-xs flex items-center gap-1.5 ${r.ok ? 'text-green-600' : 'text-gray-400'}`}>
                      <span>{r.ok ? '✓' : '○'}</span>
                      {r.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Repeat your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" /> Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
