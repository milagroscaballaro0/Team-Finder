import { useState, useEffect } from 'react';
import './trelloBoardsStyle.css';

const TrelloBoards = () => {
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedListForTask, setSelectedListForTask] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingBoardContent, setLoadingBoardContent] = useState(false);

  const API_KEY = '47d46009738ac47134421fe54f42b766';
  const TOKEN = 'ATTAbbab6c2830e00c6ff8e66376ed740e4dc8fc38645501b2ba9dc8c80b13c7f9e8C0A588A1';

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/members/me/boards?key=${API_KEY}&token=${TOKEN}`
      );

      if (!response.ok) {
        throw new Error('Error al obtener los tableros');
      }

      const data = await response.json();
      setBoards(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchBoardContent = async (boardId) => {
    setLoadingBoardContent(true);
    setLists([]);
    setCards({});

    try {
      const listsResponse = await fetch(
        `https://api.trello.com/1/boards/${boardId}/lists?key=${API_KEY}&token=${TOKEN}`
      );

      if (!listsResponse.ok) {
        throw new Error('Error al obtener las listas');
      }

      const listsData = await listsResponse.json();
      setLists(listsData);

      const cardsPromises = listsData.map(async (list) => {
        const cardsResponse = await fetch(
          `https://api.trello.com/1/lists/${list.id}/cards?key=${API_KEY}&token=${TOKEN}`
        );
        const cardsData = await cardsResponse.json();
        return { listId: list.id, cards: cardsData };
      });

      const cardsResults = await Promise.all(cardsPromises);
      const cardsMap = {};
      cardsResults.forEach(result => {
        cardsMap[result.listId] = result.cards;
      });
      setCards(cardsMap);

      setLoadingBoardContent(false);
    } catch (err) {
      console.error('Error fetching board content:', err);
      setError(err.message);
      setLoadingBoardContent(false);
    }
  };

  const handleBoardClick = (board) => {
    if (selectedBoard?.id === board.id) {
      setSelectedBoard(null);
      setLists([]);
      setCards({});
    } else {
      setSelectedBoard(board);
      fetchBoardContent(board.id);
    }
  };

  // ✅ Versión corregida de creación de tareas
 const handleCreateTask = async (e) => {
  e.preventDefault();

  if (!selectedListForTask || !taskName.trim()) {
    setError('Por favor selecciona una lista y escribe el nombre de la tarea');
    setTimeout(() => setError(null), 3000);
    return;
  }

  setCreating(true);
  setSuccessMessage('');
  setError(null);

  try {
    const params = new URLSearchParams({
      idList: selectedListForTask,
      key: API_KEY,
      token: TOKEN,
    });

    const url = `https://api.trello.com/1/cards?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: taskName,
        desc: taskDescription,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear la tarea: ${errorText}`);
    }

    const data = await response.json();

    setSuccessMessage(`✅ Tarea "${data.name}" creada exitosamente!`);
    setTaskName('');
    setTaskDescription('');
    setSelectedListForTask('');

    if (selectedBoard) {
      fetchBoardContent(selectedBoard.id);
    }

    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Error creating task:', err);
    setError(`Error: ${err.message}`);
    setTimeout(() => setError(null), 5000);
  } finally {
    setCreating(false);
  }
};


  if (loading) {
    return (
      <div className="trello-container">
        <div className="loading-spinner"></div>
        <p>Cargando tableros...</p>
      </div>
    );
  }

  if (error && boards.length === 0) {
    return (
      <div className="trello-container">
        <div className="error-message">
          <h3>Error al cargar tableros</h3>
          <p>{error}</p>
          <button onClick={fetchBoards} className="retry-btn">Reintentar</button>
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="trello-container">
        <h3>No hay tableros disponibles</h3>
        <p>Crea tu primer tablero en Trello para verlo aquí</p>
      </div>
    );
  }

  return (
    <div className="trello-container">
      <h2>🎯 Mis Tableros de Trello</h2>

      <ul className="boards-list">
        {boards.map((board) => (
          <li
            key={board.id}
            className={`board-item ${selectedBoard?.id === board.id ? 'active' : ''}`}
            onClick={() => handleBoardClick(board)}
          >
            <div className="board-color" style={{ backgroundColor: board.prefs.backgroundColor || '#0079bf' }}></div>
            <div className="board-info">
              <h3>{board.name}</h3>
              {board.desc && <p className="board-desc">{board.desc}</p>}
              <span className="board-hint">
                {selectedBoard?.id === board.id ? '👆 Clic para cerrar' : '👆 Clic para ver contenido'}
              </span>
            </div>
            <a
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="board-external-link"
              onClick={(e) => e.stopPropagation()}
              title="Abrir en Trello"
            >
              🔗
            </a>
          </li>
        ))}
      </ul>

      {selectedBoard && (
        <div className="board-content">
          <div className="board-content-header">
            <h3>📋 {selectedBoard.name}</h3>
            <button
              className="close-board-btn"
              onClick={() => {
                setSelectedBoard(null);
                setLists([]);
                setCards({});
              }}
            >
              ✕ Cerrar
            </button>
          </div>

          {loadingBoardContent ? (
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Cargando contenido del tablero...</p>
            </div>
          ) : (
            <div className="lists-container">
              {lists.map((list) => (
                <div key={list.id} className="list-column">
                  <h4 className="list-title">{list.name}</h4>
                  <div className="cards-list">
                    {cards[list.id]?.length > 0 ? (
                      cards[list.id].map((card) => (
                        <div key={card.id} className="card-item">
                          <h5>{card.name}</h5>
                          {card.desc && <p className="card-desc">{card.desc}</p>}
                        </div>
                      ))
                    ) : (
                      <p className="no-cards">No hay tareas en esta lista</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Formulario para crear tareas */}
      <div className="task-creator">
        <h2>➕ Crear Nueva Tarea</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleCreateTask} className="task-form">
          <div className="form-group">
            <label htmlFor="board-select">Seleccionar Tablero *</label>
            <select
              id="board-select"
              value={selectedBoard?.id || ''}
              onChange={(e) => {
                const board = boards.find(b => b.id === e.target.value);
                if (board) {
                  setSelectedBoard(board);
                  fetchBoardContent(board.id);
                }
                setSelectedListForTask('');
              }}
              disabled={creating}
              required
            >
              <option value="">-- Selecciona un tablero --</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          {selectedBoard && lists.length > 0 && (
            <div className="form-group">
              <label htmlFor="list-select">Seleccionar Lista *</label>
              <select
                id="list-select"
                value={selectedListForTask}
                onChange={(e) => setSelectedListForTask(e.target.value)}
                disabled={creating}
                required
              >
                <option value="">-- Selecciona una lista --</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="task-name">Nombre de la Tarea *</label>
            <input
              type="text"
              id="task-name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Ej: Revisar documentación"
              disabled={creating}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Descripción (Opcional)</label>
            <textarea
              id="task-description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Agrega más detalles sobre la tarea..."
              disabled={creating}
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="create-task-btn"
            disabled={creating || !selectedListForTask || !taskName.trim()}
          >
            {creating ? 'Creando...' : '✨ Crear Tarea'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrelloBoards;
