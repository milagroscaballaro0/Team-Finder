import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext.jsx';
import "./headerStyle.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`menu-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <nav className={`navbar ${!visible ? "navbar-hidden" : ""}`}>
        <div className="nav-container">
          <div className="nav-left">
            <div
              className="logo"
              onClick={() => handleNavigation(isAuthenticated ? "/employeeprofile" : "/")}
            >
              <div className="logo-svg">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_319_1880)">
                    <path
                      d="M35.5556 0H4.44444C1.98985 0 0 1.98985 0 4.44444V35.5556C0 38.0102 1.98985 40 4.44444 40H35.5556C38.0102 40 40 38.0102 40 35.5556V4.44444C40 1.98985 38.0102 0 35.5556 0Z"
                      fill="url(#paint0_linear_319_1880)"
                    />
                    <path
                      d="M11.4445 10.3955H21.1822C21.5141 10.3955 21.7837 10.5096 21.9911 10.7377C22.1985 10.9659 22.3022 11.2666 22.3022 11.64V32.8888H19.0356C18.3304 32.8888 17.8637 32.7748 17.6356 32.5466C17.4281 32.3185 17.3245 31.8414 17.3245 31.1155V14.2844H12.3467C11.7452 14.2844 11.4445 13.7866 11.4445 12.7911V10.3955ZM23.5467 10.3955H28.5245C29.1259 10.3955 29.4267 10.8933 29.4267 11.8888V14.2844H23.5467V10.3955Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_319_1880"
                      x1="20"
                      y1="20"
                      x2="-3.55556"
                      y2="40"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#271698" />
                      <stop offset="1" stopColor="#6030D9" />
                    </linearGradient>
                    <clipPath id="clip0_319_1880">
                      <rect width="40" height="40" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="logo-text">TeamFinder</span>
            </div>
          </div>

          <div className="nav-center">
            <ul className="nav-links">
              <li>
                <a onClick={() => handleNavigation("/about")}>Nosotros</a>
              </li>
              <li>
                <a onClick={() => handleNavigation("/integraciones")}>Integraciones</a>
              </li>
              <li>
                <a onClick={() => handleNavigation("/planes")}>Planes</a>
              </li>
              {isAuthenticated && (
                <li>
                  <a onClick={() => handleNavigation("/teams")}>Buscar Equipos</a>
                </li>
              )}
            </ul>
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <div className="user-menu">
                <div className="user-info">
                  <span>Hola, {user?.name || 'Usuario'}</span>
                </div>
                <div className="user-dropdown">
                  <button className="dropdown-toggle">
                    <div className="user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>
                  <div className="dropdown-content">
                    <a onClick={() => handleNavigation("/employeeprofile")}>Mi Perfil</a>
                    <a onClick={() => handleNavigation("/formulario")}>Realizar Test</a>
                    <a onClick={() => handleNavigation("/teams")}>Buscar Equipos</a>
                    <a onClick={handleLogout} className="logout">Cerrar Sesión</a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => handleNavigation("/login")}
                  className="btn-login"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => handleNavigation("/register")}
                  className="btn-register"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          <button
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? "open" : ""}></span>
            <span className={menuOpen ? "open" : ""}></span>
            <span className={menuOpen ? "open" : ""}></span>
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <div className="mobile-content">
          <div className="mobile-section">
            <h4>Navegación</h4>
            <a onClick={() => handleNavigation("/about")}>Nosotros</a>
            <a onClick={() => handleNavigation("/integraciones")}>Integraciones</a>
            <a onClick={() => handleNavigation("/planes")}>Planes</a>
            {isAuthenticated && (
              <a onClick={() => handleNavigation("/teams")}>Buscar Equipos</a>
            )}
          </div>
          
          <div className="mobile-section">
            <h4>Cuenta</h4>
            {isAuthenticated ? (
              <>
                <a onClick={() => handleNavigation("/employeeprofile")}>Mi Perfil</a>
                <a onClick={() => handleNavigation("/formulario")}>Realizar Test</a>
                <a onClick={handleLogout}>Cerrar Sesión</a>
              </>
            ) : (
              <>
                <a onClick={() => handleNavigation("/login")}>Iniciar Sesión</a>
                <a onClick={() => handleNavigation("/register")}>Registrarse</a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;