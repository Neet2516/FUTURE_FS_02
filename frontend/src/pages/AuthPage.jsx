import React, { useState } from 'react';
import { authApi } from '../services/api';
import { useToast } from '../components/common/Toast';
import { Eye, EyeOff, Lock, Mail, User, Briefcase, ArrowRight } from 'lucide-react';

const ROLES = ['Sales Rep', 'Account Executive', 'Sales Director', 'Business Development', 'Account Manager'];

export function AuthPage({ onAuthenticated }) {
  const toast = useToast();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Sales Rep',
  });

  // ── Validation helpers ──────────────────────────────────────────
  const validateLogin = () => {
    const e = {};
    if (!loginForm.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) e.email = 'Enter a valid email address.';
    if (!loginForm.password) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!registerForm.name.trim()) e.name = 'Full name is required.';
    else if (registerForm.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    else if (registerForm.name.trim().length > 50) e.name = 'Name must be 50 characters or fewer.';
    if (!registerForm.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) e.email = 'Enter a valid email address.';
    else if (registerForm.email.length > 100) e.email = 'Email must be 100 characters or fewer.';
    if (!registerForm.password) e.password = 'Password is required.';
    else if (registerForm.password.length < 8) e.password = 'Password must be at least 8 characters.';
    else if (registerForm.password.length > 72) e.password = 'Password must be 72 characters or fewer.';
    if (registerForm.password !== registerForm.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit handlers ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await authApi.login({
        email: loginForm.email.trim().toLowerCase(),
        password: loginForm.password,
      });
      localStorage.setItem('papercrm_token', res.token);
      localStorage.setItem('papercrm_user', JSON.stringify(res.user));
      toast.success(`Welcome back, ${res.user.name}!`);
      onAuthenticated(res.user, res.token);
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const res = await authApi.register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
        role: registerForm.role,
      });
      localStorage.setItem('papercrm_token', res.token);
      localStorage.setItem('papercrm_user', JSON.stringify(res.user));
      toast.success(`Welcome to PaperCRM, ${res.user.name}!`);
      onAuthenticated(res.user, res.token);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 font-ui text-[11px] text-accent font-semibold">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-newsprint flex flex-col">
      {/* Masthead-style Header */}
      <header className="bg-newsprint border-b-[3px] border-foreground">
        <div className="border-b border-neutral-300 px-6 py-1.5 flex items-center justify-between">
          <span className="font-data text-[0.625rem] text-neutral-500 tracking-wider">
            VOL. 01 — DIGITAL EDITION
          </span>
          <span className="font-data text-[0.625rem] text-neutral-500 tracking-wider hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            }).toUpperCase()}
          </span>
          <span className="font-ui text-[0.625rem] font-semibold text-neutral-500 uppercase tracking-wider">
            Staff Access Portal
          </span>
        </div>
        <div className="text-center py-5 px-4">
          <div className="flex items-center justify-center gap-4 mb-1">
            <div className="h-px flex-1 max-w-24 bg-foreground" />
            <span className="font-ui text-[0.5rem] font-bold uppercase tracking-[0.3em] text-neutral-400">
              All The Deals That's Fit To Print
            </span>
            <div className="h-px flex-1 max-w-24 bg-foreground" />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-foreground tracking-tight leading-none">
            PaperCRM
          </h1>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="h-[2px] flex-1 max-w-16 bg-foreground" />
            <span className="font-data text-[0.5625rem] text-neutral-400 tracking-[0.15em]">
              THE DAILY LEDGER
            </span>
            <div className="h-[2px] flex-1 max-w-16 bg-foreground" />
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Section label */}
          <div className="mb-6">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest block mb-2">
              STAFF AUTHENTICATION BUREAU
            </span>
            <div className="h-[3px] bg-foreground" />
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b-2 border-foreground mb-8">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              className={`px-6 py-3 font-ui text-xs font-bold uppercase tracking-[0.15em] border-b-2 -mb-0.5 transition-colors ${
                mode === 'login'
                  ? 'text-foreground border-accent'
                  : 'text-neutral-400 border-transparent hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}); }}
              className={`px-6 py-3 font-ui text-xs font-bold uppercase tracking-[0.15em] border-b-2 -mb-0.5 transition-colors ${
                mode === 'register'
                  ? 'text-foreground border-accent'
                  : 'text-neutral-400 border-transparent hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form-level error */}
          {errors.form && (
            <div className="mb-5 p-3 border-l-4 border-accent bg-red-50/40 font-ui text-xs font-semibold text-accent">
              {errors.form}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} noValidate className="space-y-6">
              <div>
                <label htmlFor="login-email" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={100}
                  value={loginForm.email}
                  onChange={(e) => {
                    setLoginForm({ ...loginForm, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="editor@papercrm.io"
                  className={`w-full bg-newsprint border-b-2 py-2.5 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                    errors.email ? 'border-accent' : 'border-foreground focus:border-accent'
                  }`}
                />
                <FieldError field="email" />
              </div>

              <div>
                <label htmlFor="login-password" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    maxLength={72}
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm({ ...loginForm, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="••••••••"
                    className={`w-full bg-newsprint border-b-2 py-2.5 pr-10 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                      errors.password ? 'border-accent' : 'border-foreground focus:border-accent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError field="password" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-foreground text-newsprint font-ui text-xs font-bold uppercase tracking-[0.15em] border-2 border-foreground hover:bg-newsprint hover:text-foreground transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In to the Newsroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center font-body text-xs text-neutral-500">
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrors({}); }}
                  className="font-ui font-bold text-foreground hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Register a new correspondent
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} noValidate className="space-y-6">
              <div>
                <label htmlFor="reg-name" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Full Name *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  autoComplete="name"
                  minLength={2}
                  maxLength={50}
                  value={registerForm.name}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="Sarah Miller"
                  className={`w-full bg-newsprint border-b-2 py-2.5 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                    errors.name ? 'border-accent' : 'border-foreground focus:border-accent'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  <FieldError field="name" />
                  <span className={`font-data text-[10px] ml-auto ${
                    registerForm.name.length > 45 ? 'text-accent font-bold' : 'text-neutral-400'
                  }`}>
                    {registerForm.name.length}/50
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address *
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={100}
                  value={registerForm.email}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="sarah@company.io"
                  className={`w-full bg-newsprint border-b-2 py-2.5 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                    errors.email ? 'border-accent' : 'border-foreground focus:border-accent'
                  }`}
                />
                <FieldError field="email" />
              </div>

              <div>
                <label htmlFor="reg-role" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" /> Role / Title
                </label>
                <select
                  id="reg-role"
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className="w-full bg-newsprint border-b-2 border-foreground focus:border-accent py-2.5 font-body text-sm outline-none cursor-pointer transition-colors"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="reg-password" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Password *
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    value={registerForm.password}
                    onChange={(e) => {
                      setRegisterForm({ ...registerForm, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="Minimum 8 characters"
                    className={`w-full bg-newsprint border-b-2 py-2.5 pr-10 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                      errors.password ? 'border-accent' : 'border-foreground focus:border-accent'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password strength bar */}
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((lvl) => {
                    const len = registerForm.password.length;
                    const strength = len === 0 ? 0 : len < 8 ? 1 : len < 12 ? 2 : len < 16 ? 3 : 4;
                    return (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 transition-colors ${
                          lvl <= strength
                            ? strength <= 1 ? 'bg-accent' : strength <= 2 ? 'bg-yellow-500' : strength <= 3 ? 'bg-blue-500' : 'bg-green-600'
                            : 'bg-neutral-200'
                        }`}
                      />
                    );
                  })}
                </div>
                <FieldError field="password" />
              </div>

              <div>
                <label htmlFor="reg-confirm" className="editorial-label text-neutral-500 block mb-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Confirm Password *
                </label>
                <input
                  id="reg-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  maxLength={72}
                  value={registerForm.confirmPassword}
                  onChange={(e) => {
                    setRegisterForm({ ...registerForm, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
                  placeholder="Re-enter your password"
                  className={`w-full bg-newsprint border-b-2 py-2.5 font-body text-sm outline-none transition-colors placeholder-neutral-400 ${
                    errors.confirmPassword ? 'border-accent' : 'border-foreground focus:border-accent'
                  }`}
                />
                <FieldError field="confirmPassword" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-foreground text-newsprint font-ui text-xs font-bold uppercase tracking-[0.15em] border-2 border-foreground hover:bg-newsprint hover:text-foreground transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Enrolling correspondent...</span>
                ) : (
                  <>
                    <span>Create Staff Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center font-body text-xs text-neutral-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrors({}); }}
                  className="font-ui font-bold text-foreground hover:text-accent underline underline-offset-2 transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-neutral-300 text-center">
            <p className="font-data text-[10px] text-neutral-400 tracking-wider">
              PAPERCRM · SECURE STAFF ACCESS · RUST + POSTGRESQL
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
