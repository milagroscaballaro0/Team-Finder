import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginStyle.css";
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import { useAuth } from '../../context/AuthContext.jsx';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!form.email || !form.password) {
      setMessage("Por favor completa todos los campos");
      setIsLoading(false);
      return;
    }

    try {

      console.log("🔄 Enviando datos de login...");
      
      const response = await fetch("http://teamfinder.anima.edu.uy/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      console.log("✅ Respuesta del servidor:", data);

      if (!response.ok || !data.success) {
        setMessage(data.message || "Error en el login");
        setIsLoading(false);
        return;
      }

      setMessage(`✅ ${data.message}`);
      console.log("Usuario logueado:", data.user);

      login(data.user);

      setTimeout(() => {
        if (data.user.role === 'empresa' || data.user.company) {
          navigate("/companyprofile");
        } else {
          navigate("/employeeprofile");
        }
      }, 1000);

    } catch (error) {
      console.error("💥 Error en login:", error);
      setMessage("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Header />

      <main className="login-main">
        <div className="login-card">
          <h2>Ingresar</h2>
          <p>Ingresa tus datos para acceder a tu cuenta.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john.doe@gmail.com"
                required
                disabled={isLoading}
                className={form.email ? "has-value" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••"
                  required
                  disabled={isLoading}
                  className={form.password ? "has-value" : ""}
                />
                <span 
                  className={`toggle-password ${isLoading ? "disabled" : ""}`}
                  onClick={isLoading ? undefined : togglePassword}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.81 21.81 0 0 1 5.06-6.06M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-5.12" />
                    </svg>
                  ) : (

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {message && (
            <div className={`message ${
              message.includes("✅") ? "message-success" : "message-error"
            }`}>
              {message}
            </div>
          )}

          <p className="signup-text centered">
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;