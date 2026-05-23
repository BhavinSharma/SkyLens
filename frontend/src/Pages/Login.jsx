import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/skylens-logo.png";
import { loginUser } from "../Services/authService.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }

    setLoginError("");
    setIsSubmitting(true);

    try {
      await loginUser({ email, password, rememberMe });
      navigate("/dashboard");
    } catch (error) {
      setLoginError(error.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="skylens-login-page">
      <section className="skylens-login-shell">
        <div className="skylens-hero">
          <div className="brand-row">
            <img src={logo} alt="SkyLens logo" className="brand-logo" />
            <h1>
              Sky<span>Lens</span>
            </h1>
          </div>

          <div className="status-pill">SECURE • RELIABLE • INTELLIGENT</div>

          <h2>Real-time drone analytics for safer open spaces.</h2>

          <p>
            Upload aerial imagery, detect people and vehicles, and review live
            operational insights from one secure dashboard.
          </p>

          <div className="mission-card">
            <div>
              <strong>Live mission tracking</strong>
              <span>Online</span>
            </div>

            <div className="radar">
              <div className="radar-ring ring-one" />
              <div className="radar-ring ring-two" />
              <div className="radar-ring ring-three" />
              <div className="radar-line" />
              <div className="drone-dot dot-one" />
              <div className="drone-dot dot-two" />
              <div className="drone-dot dot-three" />
            </div>
          </div>

          <div className="metric-grid">
            <div>
              <strong>People</strong>
              <span>Detection</span>
            </div>
            <div>
              <strong>Vehicles</strong>
              <span>Detection</span>
            </div>
            <div>
              <strong>History</strong>
              <span>Saved</span>
            </div>
            <div>
              <strong>Privacy</strong>
              <span>First</span>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="panel-inner">
            <p className="eyebrow">Secure operator access</p>
            <h2>Welcome back</h2>
            <p className="panel-subtitle">
              Sign in to access mission analytics, upload imagery, and inspect
              detection reports.
            </p>

            <form onSubmit={handleLogin}>
              <label>Work email</label>
              <input
                type="email"
                placeholder="ops@skylens.ai"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <div className="password-row">
                <label>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {loginError && <div className="login-error">{loginError}</div>}

              <div className="login-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((value) => !value)}
                  />
                  Keep me signed in
                </label>

                <span>Enterprise secure</span>
              </div>

              <button
                className="primary-login-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in to SkyLens"}
              </button>
            </form>

            <div className="divider">
              <span />
              OR CONTINUE WITH
              <span />
            </div>

            <button className="google-btn" type="button">
              <b>G</b> Continue with Google
            </button>

            <div className="security-box">
              <strong>Security notice</strong>
              <p>
                Protected with encrypted sessions, audit logs, and secure
                authentication for every operator account.
              </p>
            </div>

            <p className="signup-text">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;