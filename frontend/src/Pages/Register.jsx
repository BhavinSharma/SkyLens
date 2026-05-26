import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/skylens-logo.png";
import { registerUser } from "../Services/authService.js";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({ fullName, email, password });
      navigate("/login");
    } catch (error) {
      setError(error.message || "Unable to create account.");
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

          <div className="status-pill">CREATE • DETECT • ANALYSE</div>

          <h2>Start monitoring smarter with SkyLens.</h2>

          <p>
            Create an operator account to upload drone imagery, analyse people
            and vehicle counts, and review detection history.
          </p>

          <div className="mission-card">
            <div>
              <strong>Operator onboarding</strong>
              <span>Ready</span>
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
              <strong>Secure</strong>
              <span>Login</span>
            </div>
            <div>
              <strong>Upload</strong>
              <span>Images</span>
            </div>
            <div>
              <strong>Detect</strong>
              <span>Objects</span>
            </div>
            <div>
              <strong>Review</strong>
              <span>History</span>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="panel-inner">
            <p className="eyebrow">Create operator account</p>
            <h2>Join SkyLens</h2>
            <p className="panel-subtitle">
              Create your account to access drone mission analytics, upload
              imagery, and review detection history.
            </p>

            <form onSubmit={handleRegister}>
              <label>Full name</label>
              <input
                type="text"
                placeholder="Jordan Blake"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />

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
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {error && <div className="login-error">{error}</div>}

              <button
                className="primary-login-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="security-box">
              <strong>Quick start</strong>
              <p>
                Your account is created in the backend database. Once registered,
                return to the login page and sign in using the same credentials.
              </p>
            </div>

            <p className="signup-text">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;