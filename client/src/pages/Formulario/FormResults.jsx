import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import './formulario.css';

const FormResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults');
    
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults);
    
      saveResultsToDatabase(parsedResults);
    } else {
      navigate('/formulario');
    }
  }, [navigate]);

  const saveResultsToDatabase = async (testResults) => {
    try {
      setSaving(true);

      const savedUser = localStorage.getItem('user');
      if (!savedUser) {
        console.error('No se encontró usuario en localStorage');
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch('http://teamfinder.anima.edu.uy/api/tests/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          scores: testResults.scores,
          topRole: testResults.topRole
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Error guardando resultados:', data.message);
        return;
      }

      console.log('✅ Resultados guardados en la base de datos');

      localStorage.setItem('testResults', JSON.stringify({
        ...testResults,
        savedToDB: true
      }));

    } catch (error) {
      console.error('Error guardando resultados:', error);
    } finally {
      setSaving(false);
    }
  };

  const goToProfile = () => {
    navigate('/employeeprofile');
  };

  const goBackToTest = () => {
    localStorage.removeItem('testResults');
    navigate('/formulario');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (!results) return null;

  return (
    <>
      <Navbar />
      <div className="role-test-container">
        <div id="results-section" className="results-section">
          <h2 className="results-title">Resultados del Test</h2>
          
          {saving && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              color: '#4A90E2',
              fontSize: '1.1rem'
            }}>
              Guardando tus resultados...
            </div>
          )}
          
          <div className="top-role-card">
            <h3>¡Test Completado!</h3>
            <div className="top-role-name">
              {results.scores[results.topRole].name}
            </div>
            <div className="top-role-score">
              Puntuación: {results.scores[results.topRole].score}/15
            </div>
            <div className="top-role-interpretation">
              {results.scores[results.topRole].interpretation.text}
            </div>
          </div>

          <div className="all-results">
            <h3>Detalle de Todas las Áreas</h3>
            <div className="results-grid">
              {Object.keys(results.scores).map((roleKey) => (
                <div 
                  key={roleKey} 
                  className={`result-card ${roleKey === results.topRole ? 'top-role' : ''}`}
                >
                  <h4>{results.scores[roleKey].name}</h4>
                  <div className="score-bar-container">
                    <div 
                      className="score-bar"
                      style={{ 
                        width: `${(results.scores[roleKey].score / 15) * 100}%`,
                        backgroundColor: results.scores[roleKey].interpretation.color
                      }}
                    />
                  </div>
                  <div className="score-info">
                    <span className="score-value">
                      {results.scores[roleKey].score}/15
                    </span>
                    <span 
                      className="score-interpretation"
                      style={{ color: results.scores[roleKey].interpretation.color }}
                    >
                      {results.scores[roleKey].interpretation.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={goToProfile} className="reset-btn" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)' }}>
              Ver Mi Perfil
            </button>
            <button onClick={goBackToTest} className="reset-btn" style={{ background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' }}>
              Realizar Test Nuevamente
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormResults;
