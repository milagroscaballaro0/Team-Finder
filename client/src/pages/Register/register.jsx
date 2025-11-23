import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import { useAuth } from '../../context/AuthContext.jsx';
import "./registerStyle.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [userType, setUserType] = useState("empresa");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!form.name || !form.email || !form.password) {
      setMessage("Por favor completa todos los campos");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMessage("Por favor ingresa un email válido");
      setIsLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Enviando datos de registro...");

      const response = await fetch("http://teamfinder.anima.edu.uy/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: userType === "empresa" ? "empresa" : "empleado"
        }),
      });

      const data = await response.json();
      console.log("✅ Respuesta del servidor:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      setMessage(data.message || "✅ Registro exitoso");
      
      if (data.user) {
        console.log("🔄 Realizando auto-login...");
     
        login(data.user);
        
        setForm({ name: "", email: "", password: "" });

        if (userType === "empresa") {
          navigate("/companyprofile"); 
        } else {
          navigate("/employeeprofile"); 
        }
      } else {

        setMessage("✅ Registro exitoso. Redirigiendo al login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      console.error("💥 Error en registro:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-container">
      <Header />
      <main className="register-main">
        <div className="register-card">
          <h2>Crear cuenta</h2>
          <p>Ingresa tus datos para registrarte</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                required
                disabled={isLoading}
                className={form.name ? "has-value" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Ingresa tu email"
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
                  placeholder="Crea una contraseña"
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
              <div className="password-hint">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <div className="form-group">
              <label>Tipo de usuario</label>
              <div className="user-type-selector">
                <div
                  className={`user-type-option ${userType === "empresa" ? "selected" : ""} ${
                    isLoading ? "disabled" : ""
                  }`}
                  onClick={() => !isLoading && setUserType("empresa")}
                >
                  <div className="radio-circle">
                    {userType === "empresa" && <div className="radio-dot"></div>}
                  </div>
                  <span>Empresa</span>
                </div>
                <div
                  className={`user-type-option ${userType === "empleado" ? "selected" : ""} ${
                    isLoading ? "disabled" : ""
                  }`}
                  onClick={() => !isLoading && setUserType("empleado")}
                >
                  <div className="radio-circle">
                    {userType === "empleado" && <div className="radio-dot"></div>}
                  </div>
                  <span>Empleado</span>
                </div>
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
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`message ${
                message.includes("✅") ? "message-success" : "message-error"
              }`}
            >
              {message}
            </div>
          )}

          <p className="signup-text">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="login-link">
              Inicia sesión
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Register;