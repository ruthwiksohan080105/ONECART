import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import "./Login.css";

function Login({ onBack, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (isRegister && formData.name.trim().length < 3) {
      alert("Please enter your full name.");
      return;
    }

    if (isRegister) {
      alert("Registration demo successful!");
    } else {
      alert("Login demo successful!");
    }
    onLogin({
      name: isRegister ? formData.name : formData.email.split("@")[0],
      email: formData.email,
    });

    onBack();
  };

  return (
    <section className="login-page">
      <button className="login-back" onClick={onBack}>
        <ArrowLeft size={17} />
        BACK TO SHOPPING
      </button>

      <div className="login-container">
        <div className="login-brand">
          <h1>
            ONE<span>CART</span>
          </h1>
          <p>EVERYTHING IN ONE PLACE</p>
        </div>

        <div className="login-card">
          <span className="login-label">WELCOME TO ONECART</span>

          <h2>{isRegister ? "Create Account." : "Welcome Back."}</h2>

          <p className="login-description">
            {isRegister
              ? "Create your account and discover something new."
              : "Sign in to continue your shopping journey."}
          </p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button type="submit" className="login-submit">
              {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>
          </form>

          <div className="login-switch">
            {isRegister ? "Already have an account?" : "Don't have an account?"}

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setShowPassword(false);
              }}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </div>
        </div>

        <p className="login-footer">© 2026 ONECART. ALL RIGHTS RESERVED.</p>
      </div>
    </section>
  );
}

export default Login;
