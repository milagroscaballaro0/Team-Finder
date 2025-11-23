import React, { useState, useEffect } from 'react';
import trelloService from '../../services/trelloService.js';
import TrelloAuth from './TrelloAuth.jsx';
import './trelloIntegration.css';

/**
 * Componente principal de integración con Trello
 * Muestra tableros, listas y permite crear tareas
 * Cada usuario ve sus propios datos de Trello
 */
const TrelloIntegration = () => {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Estados de datos
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [error, setError] = useState(null);
  
  // Estados del formulario
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Verifica la autenticación al montar el componente
   */
  useEffect(() => {
    checkAuthentication();
  }, []);

  /**
   * Carga los tableros cuando el usuario está autenticado
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadBoards();
      loadUserInfo();
    }
  }, [isAuthenticated]);

  /**
   * Verifica si hay un token guardado
   */
  const checkAuthentication = () => {
    const authenticated = trelloService.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  /**
   * Carga la información del usuario de Trello
   */
  const loadUserInfo = async () => {
    try {
      const user = await trelloService.getCurrentUser();
      setUserName(user.fullName || user.username);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    }
  };

  /**
   * Carga todos los tableros del usuario
   */
  const loadBoards = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const boardsData = await trelloService.getBoards();
      setBoards(boardsData);
    } catch (error) {
      setError(error.message);
      console.error('Error al cargar tableros:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el click en un tablero
   * Carga las listas y tarjetas de ese tablero
   */
  const handleBoardClick = async (board) => {
    // Si es el mismo tablero, cerrar
    if (selectedBoard?.id === board.id) {
      setSelectedBoard(null);
      setLists([]);
      setCards({});
      return;
    }

    setSelectedBoard(board);
    setLoading(true);

    try {
      // Cargar listas del tablero
      const listsData = await trelloService.getLists(board.id);
      setLists(listsData);

      // Cargar tarjetas de cada lista
      const cardsMap = {};
      for (const list of listsData) {
        const cardsData = await trelloService.getCards(list.id);
        cardsMap[list.id] = cardsData;
      }
      setCards(cardsMap);
    } catch (error) {
      setError(error.message);
      console.error('Error al cargar contenido del tablero:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la creación de una nueva tarea
   */
  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!selectedList || !taskName.trim()) {
      setError('Selecciona una lista y escribe el nombre de la tarea');
      return;
    }

    setCreating(true);
    setError(null);
    setSuccessMessage('');

    try {
      const newCard = await trelloService.createCard(
        selectedList,
        taskName,
        taskDescription
      );

      setSuccessMessage(`✅ Tarea "${newCard.name}" creada exitosamente!`);
      setTaskName('');
      setTaskDescription('');
      setSelectedList('');

      // Recargar el tablero
      if (selectedBoard) {
        handleBoardClick(selectedBoard);
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  /**
   * Maneja el cambio de estado de autenticación
   */
  const handleAuthChange = (authenticated) => {
    setIsAuthenticated(authenticated);
    if (!authenticated) {
      setBoards([]);
      setLists([]);
      setCards({});
      setSelectedBoard(null);
      setUserName('');
    }
  };

  return (
    <div className="trello-integration">
      <h2 className="integration-title">🎯 Integración con Trello</h2>
      
      {/* Componente de autenticación */}
      <TrelloAuth 
        isAuthenticated={isAuthenticated}
        onAuthChange={handleAuthChange}
        userName={userName}
      />

      {/* Contenido solo visible si está autenticado */}
      {isAuthenticated && (
        <>
          {/* Lista de tableros */}
          {loading && !selectedBoard && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando tus tableros...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>❌ {error}</p>
              <button onClick={loadBoards} className="btn-retry">
                Reintentar
              </button>
            </div>
          )}

          {!loading && boards.length > 0 && (
            <div className="boards-section">
              <h3>Mis Tableros</h3>
              <div className="boards-grid">
                {boards.map(board => (
                  <div
                    key={board.id}
                    className={`board-card ${selectedBoard?.id === board.id ? 'active' : ''}`}
                    onClick={() => handleBoardClick(board)}
                  >
                    <div 
                      className="board-header"
                      style={{ background: board.prefs.backgroundColor || '#0079bf' }}
                    >
                      <h4>{board.name}</h4>
                    </div>
                    {board.desc && (
                      <p className="board-description">{board.desc}</p>
                    )}
                    <span className="board-hint">
                      {selectedBoard?.id === board.id ? '👆 Clic para cerrar' : '👆 Clic para ver'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contenido del tablero seleccionado */}
          {selectedBoard && (
            <div className="board-content">
              <div className="board-content-header">
                <h3>📋 {selectedBoard.name}</h3>
                <button
                  onClick={() => {
                    setSelectedBoard(null);
                    setLists([]);
                    setCards({});
                  }}
                  className="btn-close-board"
                >
                  ✕ Cerrar
                </button>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Cargando contenido...</p>
                </div>
              ) : (
                <div className="lists-grid">
                  {lists.map(list => (
                    <div key={list.id} className="list-column">
                      <h4>{list.name}</h4>
                      <div className="cards-container">
                        {cards[list.id]?.length > 0 ? (
                          cards[list.id].map(card => (
                            <div key={card.id} className="card-item">
                              <h5>{card.name}</h5>
                              {card.desc && <p>{card.desc}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="no-cards">Sin tareas</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Formulario de creación de tareas */}
          <div className="task-creator">
            <h3>➕ Crear Nueva Tarea</h3>

            {successMessage && (
              <div className="success-alert">{successMessage}</div>
            )}

            <form onSubmit={handleCreateTask}>
              <div className="form-row">
                <label>Tablero</label>
                <select
                  value={selectedBoard?.id || ''}
                  onChange={(e) => {
                    const board = boards.find(b => b.id === e.target.value);
                    if (board) handleBoardClick(board);
                  }}
                  disabled={creating}
                  required
                >
                  <option value="">Selecciona un tablero</option>
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>

              {lists.length > 0 && (
                <div className="form-row">
                  <label>Lista</label>
                  <select
                    value={selectedList}
                    onChange={(e) => setSelectedList(e.target.value)}
                    disabled={creating}
                    required
                  >
                    <option value="">Selecciona una lista</option>
                    {lists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-row">
                <label>Nombre de la tarea *</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Ej: Revisar documentación"
                  disabled={creating}
                  required
                />
              </div>

              <div className="form-row">
                <label>Descripción (opcional)</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Detalles de la tarea..."
                  rows="4"
                  disabled={creating}
                />
              </div>

              <button
                type="submit"
                className="btn-create-task"
                disabled={creating || !selectedList}
              >
                {creating ? 'Creando...' : '✨ Crear Tarea'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default TrelloIntegration;