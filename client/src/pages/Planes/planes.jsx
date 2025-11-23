import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Header/header.jsx";
import Footer from "../Footer/footer.jsx";
import "./planesStyle.css";
import { planes } from './planesViewModel';

const Planes = () => {
  const planBasicoRef = useRef(null);
  const planIntermedioRef = useRef(null);
  const planAvanzadoRef = useRef(null);
  const [centerPlanIndex, setCenterPlanIndex] = useState(1);  

  const scrollToPlan = (planRef, planIndex) => {
    setCenterPlanIndex(planIndex); 
    
    setTimeout(() => {
      if (planRef.current) {
        const yOffset = -100;
        const element = planRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        element.classList.add('plan-highlight-animation');
        setTimeout(() => {
          element.classList.remove('plan-highlight-animation');
        }, 2000);
      }
    }, 300); 
  };

  const getPlanRef = (index) => {
    switch(index) {
      case 0: return planBasicoRef;
      case 1: return planIntermedioRef;
      case 2: return planAvanzadoRef;
      default: return null;
    }
  };

  const getOrderedPlanes = () => {
    const orderedPlanes = [...planes];
    if (centerPlanIndex === 0) {
      return [orderedPlanes[1], orderedPlanes[0], orderedPlanes[2]];
    } else if (centerPlanIndex === 2) {
      return [orderedPlanes[0], orderedPlanes[2], orderedPlanes[1]];
    }
    return orderedPlanes;
  };

  const getOriginalIndex = (displayIndex) => {
    if (centerPlanIndex === 0) {
      const mapping = [1, 0, 2];
      return mapping[displayIndex];
    } else if (centerPlanIndex === 2) {
      const mapping = [0, 2, 1];
      return mapping[displayIndex];
    }
    return displayIndex;
  };

  return (
    <>
      <Navbar />
      <div className="planes-container">
   
        <section className="hero-section">
          <div 
            className="cloud-bronce" 
            onClick={() => scrollToPlan(planBasicoRef, 0)}
            style={{ cursor: 'pointer' }}
            title="Ver Plan Bronce"
          ></div>
          <div 
            className="cloud-plata" 
            onClick={() => scrollToPlan(planIntermedioRef, 1)}
            style={{ cursor: 'pointer' }}
            title="Ver Plan Plata"
          ></div>
          <div 
            className="cloud-oro" 
            onClick={() => scrollToPlan(planAvanzadoRef, 2)}
            style={{ cursor: 'pointer' }}
            title="Ver Plan Oro"
          ></div>

          <h1 className="hero-title">
            <span className="highlight">Planes</span> personalizados para tu empresa, logra un ambiente ideal para trabajar.
          </h1>
          <p className="hero-subtitle">
            Elige el plan que mejor se adapte a las necesidades de tu equipo y comienza a transformar la forma en que trabajas.
          </p>
        </section>

        <section className="planes-section">
          <div className="planes-grid">
            {getOrderedPlanes().map((plan, displayIndex) => {
              const originalIndex = getOriginalIndex(displayIndex);
              return (
                <div 
                  key={plan.name} 
                  ref={getPlanRef(originalIndex)}
                  className={`plan-card ${plan.highlight ? 'highlight' : ''} ${plan.color} ${displayIndex === 1 ? 'center-plan' : ''}`}
                >
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">{plan.price}</div>
                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Link
                    to={
                      plan.name.includes("Bronce")
                        ? "/metodo-pago/bronce"
                        : plan.name.includes("Plata")
                        ? "/metodo-pago/plata"
                        : "/metodo-pago/oro"
                    }
                  >
                    <button className={`plan-button ${plan.button.includes('Current') ? 'current' : 'upgrade'}`}>
                      {plan.button}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="motivational-section">
          <p>
            Tu empresa no es como las demás, y eso nos encanta. 
            Encuentra el plan perfecto que impulse tu crecimiento y potencie tu equipo.
          </p>
        </section>
      <Footer />
      </div>
    </>
  );
}

export default Planes;
