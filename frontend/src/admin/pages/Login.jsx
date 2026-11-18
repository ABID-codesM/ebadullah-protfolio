import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Code2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);

      navigate("/admin", { replace: true });
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-decoration login-decoration-one"></div>
      <div className="login-decoration login-decoration-two"></div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Code2 size={27} />
          </div>

          <div>
            <h2>
              ABID<span>.</span>
            </h2>
            <p>ADMINISTRATION PORTAL</p>
          </div>
        </div>

        <div className="login-heading">
          <div className="login-shield">
            <ShieldCheck size={25} />
          </div>

          <h1>Welcome Back</h1>

          <p>Sign in to access your portfolio management dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email Address</label>

            <div className="login-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <div className="login-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}

            {!isSubmitting && <ArrowRight size={19} />}
          </button>
        </form>

        <div className="login-footer">
          <LockKeyhole size={14} />
          <span>Secure Administrator Access</span>
        </div>
      </div>

      <p className="login-copyright">
        © {new Date().getFullYear()} ABID. All rights reserved.
      </p>
    </div>
  );
};

export default Login;
