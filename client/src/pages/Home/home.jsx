import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import "./homeStyle.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />


      <main style={{ flex: 1 }}>

        <section className="hero">
          <h1>
            <span className="highlight">Logra</span> el ambiente de trabajo deseado
          </h1>
          <p>
            Integramos herramientas claves para que tus colaboradores se sientan
            escuchados, motivados y conectados entre sí.{" "}
            <strong>
              Mejoramos relaciones, reducimos conflictos, potenciamos resultados
            </strong>
          </p>
          <div className="button-group">
            <button
              className="btn btn-black"
              onClick={() => navigate("/login")}
            >
              Ingresar
            </button>
            <button
              className="btn btn-blue"
              onClick={() => navigate("/about")}
            >
              Conoce más
            </button>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <h3>+30</h3>
              <p>Equipos transformados</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Satisfacción de usuarios</p>
            </div>
            <div className="stat-item">
              <h3>+40%</h3>
              <p>Productividad aumentada</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Compromiso con resultados</p>
            </div>
          </div>
        </section>

        
        <section className="features-preview">
          <div className="container">
            <h2>Todo lo que necesitas en una sola plataforma</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
              
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="9" cy="7" r="4" />
                    <path d="M17 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4z" />
                    <path d="M2 21v-2a4 4 0 0 1 4-4h4" />
                    <path d="M15 21v-2a4 4 0 0 1 4-4h0" />
                  </svg>
                </div>
                <h3>Gestión de Equipos</h3>
                <p>Forma equipos basados en compatibilidades reales y fortalezas individuales</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
           
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3>Comunicación Efectiva</h3>
                <p>Espacios seguros para diálogos productivos y resolución de conflictos</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
         
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.06A1.65 1.65 0 0 0 9 3.09V3a2 2 0 1 1 4 0v.09c.06.69.39 1.31.94 1.71a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.06c.4.55 1.02.88 1.71.94H21a2 2 0 1 1 0 4h-.09c-.69.06-1.31.39-1.71.94z" />
                  </svg>
                </div>
                <h3>
                  Productividad Creación de equipos
                </h3>
                <p>
                  Formá equipos más efectivos asignando tareas según fortalezas reales...
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;