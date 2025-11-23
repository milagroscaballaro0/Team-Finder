import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import './formulario.css';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Formulario() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const roles = {
    projectManager: {
      name: 'Jefe de Proyecto / Project Manager',
      questions: [
        'Suelo organizar al equipo y distribuir tareas con claridad.',
        'Me aseguro de que los objetivos y plazos estén claros.',
        'Me mantengo en comunicación constante con el equipo.',
        'Identifico riesgos antes de que se conviertan en problemas.',
        'Me motiva coordinar reuniones y liderar proyectos.'
      ]
    },
    businessAnalyst: {
      name: 'Analista de Negocios / Business Analyst',
      questions: [
        'Me gusta entender a fondo las necesidades del cliente.',
        'Hago preguntas para descubrir problemas ocultos.',
        'Traduzco requerimientos en documentación clara.',
        'Equilibro necesidades del cliente y limitaciones técnicas.',
        'Prioritizo funcionalidades según valor para el negocio.'
      ]
    },
    softwareArchitect: {
      name: 'Arquitecto de Software / Solution Architect',
      questions: [
        'Me interesa diseñar la estructura técnica de los sistemas.',
        'Pienso en la escalabilidad y mantenibilidad a largo plazo.',
        'Evalúo tecnologías y patrones de diseño apropiados.',
        'Me gusta definir estándares y mejores prácticas.',
        'Busco soluciones que integren múltiples sistemas.'
      ]
    },
    frontendDev: {
      name: 'Desarrollador Frontend',
      questions: [
        'Disfruto crear interfaces visuales atractivas e intuitivas.',
        'Me gusta trabajar con HTML, CSS y JavaScript.',
        'Me preocupo por la experiencia del usuario final.',
        'Me motiva ver el resultado visual de mi código.',
        'Me mantengo actualizado con frameworks frontend modernos.'
      ]
    },
    backendDev: {
      name: 'Desarrollador Backend',
      questions: [
        'Me gusta trabajar con lógica de negocio y bases de datos.',
        'Disfruto optimizar el rendimiento de APIs y servicios.',
        'Me interesa la seguridad y manejo de datos sensibles.',
        'Prefiero trabajar con código server-side.',
        'Me motiva resolver problemas de arquitectura de datos.'
      ]
    },
    devOps: {
      name: 'Ingeniero DevOps / SysAdmin',
      questions: [
        'Me gusta automatizar procesos y despliegues.',
        'Me interesa la infraestructura cloud y servidores.',
        'Disfruto configurando pipelines de CI/CD.',
        'Me preocupo por la disponibilidad y monitoreo de sistemas.',
        'Me motiva optimizar tiempos de deployment.'
      ]
    },
    securitySpecialist: {
      name: 'Especialista en Seguridad Informática',
      questions: [
        'Me preocupa identificar vulnerabilidades en sistemas.',
        'Me gusta investigar sobre ciberseguridad y amenazas.',
        'Evalúo riesgos de seguridad constantemente.',
        'Me interesa implementar controles de acceso y cifrado.',
        'Me motiva proteger información sensible.'
      ]
    },
    uxUiDesigner: {
      name: 'Diseñador UX/UI',
      questions: [
        'Me gusta diseñar prototipos y wireframes.',
        'Investigo el comportamiento y necesidades de usuarios.',
        'Me preocupo por la usabilidad y accesibilidad.',
        'Disfruto trabajar con herramientas de diseño visual.',
        'Me motiva crear experiencias centradas en el usuario.'
      ]
    },
    qaEngineer: {
      name: 'Tester / QA Engineer',
      questions: [
        'Me gusta encontrar errores antes de que lleguen a producción.',
        'Soy detallista y metódico al revisar funcionalidades.',
        'Disfruto escribiendo casos de prueba y escenarios.',
        'Me interesa la automatización de tests.',
        'Me motiva asegurar la calidad del software.'
      ]
    },
    dba: {
      name: 'Administrador de Base de Datos (DBA)',
      questions: [
        'Me gusta diseñar y optimizar bases de datos.',
        'Me preocupo por la integridad y consistencia de datos.',
        'Disfruto escribiendo queries SQL complejas.',
        'Me interesa el backup y recuperación de datos.',
        'Me motiva mejorar el rendimiento de consultas.'
      ]
    },
    techSupport: {
      name: 'Especialista en Soporte Técnico',
      questions: [
        'Me gusta ayudar a resolver problemas técnicos de usuarios.',
        'Tengo paciencia para explicar conceptos técnicos.',
        'Disfruto diagnosticando y solucionando incidencias.',
        'Me adapto rápido a diferentes tipos de problemas.',
        'Me motiva la satisfacción del usuario al resolver su problema.'
      ]
    },
    scrumMaster: {
      name: 'Scrum Master',
      questions: [
        'Me gusta facilitar reuniones y eliminar impedimentos.',
        'Promuevo la mejora continua del equipo.',
        'Me aseguro de que se sigan las prácticas ágiles.',
        'Me motiva crear un ambiente de trabajo colaborativo.',
        'Ayudo al equipo a ser más eficiente y autónomo.'
      ]
    }
  };

  const handleAnswerChange = (roleKey, questionIndex, value) => {
    setAnswers({
      ...answers,
      [`${roleKey}-${questionIndex}`]: parseInt(value)
    });
  };

  const getInterpretation = (score) => {
    if (score >= 0 && score <= 7) return { text: 'Baja afinidad', color: '#e74c3c' };
    if (score >= 8 && score <= 14) return { text: 'Afinidad media', color: '#f39c12' };
    return { text: 'Alta afinidad', color: '#27ae60' };
  };

  const calculateResults = async (e) => {
    e.preventDefault();
    setLoading(true);

    const totalQuestions = Object.keys(roles).length * 5;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      alert(`Por favor responde todas las preguntas. Te faltan ${totalQuestions - answeredQuestions} preguntas.`);
      setLoading(false);
      return;
    }

    const scores = {};

    Object.keys(roles).forEach(roleKey => {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += answers[`${roleKey}-${i}`] || 0;
      }
      scores[roleKey] = {
        name: roles[roleKey].name,
        score: total,
        interpretation: getInterpretation(total)
      };
    });

    const topRole = Object.keys(scores).reduce((a, b) =>
      scores[a].score > scores[b].score ? a : b
    );

    const results = { 
      scores, 
      topRole,
      topRoleName: roles[topRole].name,
      completedAt: new Date().toISOString()
    };

    try {

      if (user && user.id) {
        console.log('📤 Enviando resultados al servidor...');
        
        const response = await fetch('http://teamfinder.anima.edu.uy/api/users/save-test-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            testResults: results
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log('✅ Resultados guardados en base de datos:', data.testResult);
          
        } else {
          console.error('❌ Error del servidor:', data.message);
          throw new Error(data.message || 'Error del servidor');
        }
      } else {
        console.warn('⚠️ Usuario no identificado, guardando solo en localStorage');
      }

      localStorage.setItem('testResults', JSON.stringify(results));

      navigate('/resultados');

    } catch (error) {
      console.error('❌ Error al guardar resultados:', error);

      localStorage.setItem('testResults', JSON.stringify(results));
      alert('Resultados guardados localmente. Error al conectar con el servidor.');
      navigate('/resultados');
    } finally {
      setLoading(false);
    }
  };

  const skipToResults = () => {

    const mockAnswers = {};
    Object.keys(roles).forEach(roleKey => {
      for (let i = 0; i < 5; i++) {
        mockAnswers[`${roleKey}-${i}`] = Math.floor(Math.random() * 4);  
      }
    });

    const scores = {};
    Object.keys(roles).forEach(roleKey => {
      let total = 0;
      for (let i = 0; i < 5; i++) {
        total += mockAnswers[`${roleKey}-${i}`];
      }
      scores[roleKey] = {
        name: roles[roleKey].name,
        score: total,
        interpretation: getInterpretation(total)
      };
    });

    const topRole = Object.keys(scores).reduce((a, b) =>
      scores[a].score > scores[b].score ? a : b
    );

    const results = { 
      scores, 
      topRole,
      topRoleName: roles[topRole].name,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('testResults', JSON.stringify(results));

    if (user && user.id) {
      fetch('http://teamfinder.anima.edu.uy/api/users/save-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          testResults: results
        })
      }).catch(err => console.error('Error guardando mock data:', err));
    }

    navigate('/resultados');
  };

  let questionCounter = 0;

  const totalQuestions = Object.keys(roles).length * 5;
  const answeredQuestions = Object.keys(answers).length;
  const progress = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <>
      <Header />
      <div className="role-test-container">
        <div className="test-header">
          <h1>Test de Roles TIC</h1>
          <p className="test-subtitle">
            Descubre qué rol tecnológico se adapta mejor a tu perfil profesional
          </p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {answeredQuestions} de {totalQuestions} preguntas respondidas ({progress}%)
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <button 
            type="button" 
            onClick={skipToResults} 
            className="skip-btn"
            title="Solo para desarrollo - Borrar en producción"
            disabled={loading}
          >
            ⚡ Skip to Results (Dev Only)
          </button>
        )}

        <form onSubmit={calculateResults} className="role-test-form">
          {Object.keys(roles).map((roleKey) => (
            <div key={roleKey} className="role-section">
              <h3 className="role-title">{roles[roleKey].name}</h3>
              {roles[roleKey].questions.map((question, qIndex) => {
                questionCounter++;
                return (
                  <div key={qIndex} className="question-block">
                    <p className="question-text">
                      <span className="question-number">{questionCounter}.</span>
                      {question}
                    </p>
                    <div className="options-group">
                      {[
                        { label: 'Nunca', value: 0 },
                        { label: 'A veces', value: 1 },
                        { label: 'Casi siempre', value: 2 },
                        { label: 'Siempre', value: 3 }
                      ].map((option) => (
                        <label key={option.value} className="radio-option">
                          <input
                            type="radio"
                            name={`${roleKey}-${qIndex}`}
                            value={option.value}
                            checked={answers[`${roleKey}-${qIndex}`] === option.value}
                            onChange={(e) => handleAnswerChange(roleKey, qIndex, e.target.value)}
                            required
                            disabled={loading}
                          />
                          <span className="radio-label">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="submit-section">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || answeredQuestions < totalQuestions}
            >
              {loading ? 'Guardando...' : 'Ver Resultados'}
            </button>
            
            {answeredQuestions < totalQuestions && (
              <p className="completion-warning">
                Completa todas las preguntas para ver tus resultados
              </p>
            )}
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
