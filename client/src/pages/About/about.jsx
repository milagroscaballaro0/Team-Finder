import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import "./aboutStyle.css";

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Mikaela Mesa",
      role: "Diseñadora",
      photo: "/src/assets/img/team/mikaela.jpg" 
    },
    {
      name: "Milagros Caballero",
      role: "Project Manager",
      photo: "/src/assets/img/team/milagros.jpg"
    },
    {
      name: "Juan Rodríguez",
      role: "Analista",
      photo: "/src/assets/img/team/juan.jpg"
    },
    {
      name: "Ezequiel Barreiro",
      role: "Programador",
      photo: "/src/assets/img/team/ezequiel.jpg"
    },
    {
      name: "Dylan Silva",
      role: "Programador",
      photo: "/src/assets/img/team/dylan.jpg"
    },
    {
      name: "Verena Da Roza",
      role: "Diseñadora",
      photo: "/src/assets/img/team/verena.jpg"
    },
    {
      name: "Belén Dubois",
      role: "Project Manager",
      photo: "/src/assets/img/team/belen.jpg"
    },
    {
      name: "Lucía Saravia",
      role: "Diseñadora",
      photo: "/src/assets/img/team/lucia.jpg"
    },
    {
      name: "Ezequiel Fernández",
      role: "Pensador",
      photo: "/src/assets/img/team/ezequiel.jpg"
    },
    {
      name: "Martina",
      role: "Investigadora",
      photo: "/src/assets/img/team/martina.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const goToContact = () => {
    navigate('/contacto');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <>
      <Navbar />
      <div className="about-container">
        {}
        <section className="about-hero">
          <h1>SOBRE NOSOTROS</h1>
          <p className="about-description">
            Somos un grupo de estudiantes de sexto año que decidimos crear una plataforma para 
conectar personas y formar equipos de trabajo ideales, combinando tecnología,
olaboración y creatividad.

La idea surgió de nuestra propia experiencia: muchas veces nos costaba formar buenos equipos de trabajo, 
equilibrar roles y encontrar personas con quienes realmente pudiéramos conectar.

Por eso decidimos crear una plataforma que ayude a elegir equipos de forma más inteligente,
 considerando tanto las habilidades técnicas como las cualidades personales.
Con Team Finder, buscamos hacer más fácil lo que para nosotros fue un desafío: trabajar mejor, juntos.
          </p>
        </section>

        {}
        <section className="team-carousel-section">
          <h2>Integrantes de nuestro equipo</h2>
          
          <div className="carousel-container">
            <button className="carousel-btn prev" onClick={prevSlide}>
              ‹
            </button>

            <div className="carousel-track">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className={`carousel-card ${index === currentSlide ? 'active' : ''} ${
                    index === (currentSlide - 1 + teamMembers.length) % teamMembers.length ? 'prev' : ''
                  } ${
                    index === (currentSlide + 1) % teamMembers.length ? 'next' : ''
                  }`}
                >
                  <div className="team-photo-carousel"></div>
                  <div className="team-info">
                    <h3 className="team-name-carousel">{member.name}</h3>
                    <p className="team-role-carousel">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-btn next" onClick={nextSlide}>
              ›
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </section>

        {}
        <section className="contact-cta-section">
          <div className="contact-cta-content">
            <div className="contact-cta-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>¿Tienes alguna pregunta?</h2>
            <p>
              Nuestro equipo está aquí para ayudarte. No dudes en contactarnos 
              si tienes dudas sobre nuestros servicios o quieres solicitar una integración.
            </p>
            <button 
              className="contact-cta-button" 
              onClick={goToContact}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Contáctanos
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default About;