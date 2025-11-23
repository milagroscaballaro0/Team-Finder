import TRELLO_CONFIG from '../config/trello.config.js';

/**
 * Servicio para interactuar con la API de Trello
 * Maneja la autenticación OAuth y las peticiones a la API
 */

class TrelloService {
  constructor() {
    this.apiKey = TRELLO_CONFIG.API_KEY;
    this.apiBaseUrl = TRELLO_CONFIG.API_BASE_URL;
    this.tokenKey = 'trello_token'; // Clave para localStorage
  }

  /**
   * Genera la URL de autorización OAuth de Trello
   * @returns {string} URL completa para redireccionar al usuario
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      return_url: TRELLO_CONFIG.REDIRECT_URI,
      callback_method: 'fragment',
      scope: TRELLO_CONFIG.SCOPE,
      expiration: TRELLO_CONFIG.EXPIRATION,
      name: TRELLO_CONFIG.APP_NAME,
      key: this.apiKey,
      response_type: TRELLO_CONFIG.RESPONSE_TYPE
    });

    return `${TRELLO_CONFIG.AUTH_URL}?${params.toString()}`;
  }

  /**
   * Guarda el token de acceso en localStorage
   * @param {string} token - Token OAuth de Trello
   */
  saveToken(token) {
    localStorage.setItem(this.tokenKey, token);
    console.log('✅ Token de Trello guardado exitosamente');
  }

  /**
   * Obtiene el token guardado en localStorage
   * @returns {string|null} Token o null si no existe
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si hay un token guardado
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Cierra la sesión eliminando el token
   */
  logout() {
    localStorage.removeItem(this.tokenKey);
    console.log('✅ Sesión de Trello cerrada');
  }

  /**
   * Hace una petición GET a la API de Trello
   * @param {string} endpoint - Endpoint de la API (ej: '/members/me/boards')
   * @returns {Promise<any>} Respuesta de la API
   */
  async get(endpoint) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No estás autenticado. Conecta tu cuenta de Trello primero.');
    }

    const url = `${this.apiBaseUrl}${endpoint}`;
    const params = new URLSearchParams({
      key: this.apiKey,
      token: token
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en petición a Trello:', error);
      throw error;
    }
  }

  /**
   * Hace una petición POST a la API de Trello
   * @param {string} endpoint - Endpoint de la API
   * @param {object} data - Datos a enviar en el body
   * @returns {Promise<any>} Respuesta de la API
   */
  async post(endpoint, data = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No estás autenticado. Conecta tu cuenta de Trello primero.');
    }

    const url = `${this.apiBaseUrl}${endpoint}`;
    const params = new URLSearchParams({
      key: this.apiKey,
      token: token
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en petición POST a Trello:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los tableros del usuario
   * @returns {Promise<Array>} Lista de tableros
   */
  async getBoards() {
    return await this.get('/members/me/boards');
  }

  /**
   * Obtiene las listas de un tablero específico
   * @param {string} boardId - ID del tablero
   * @returns {Promise<Array>} Lista de listas del tablero
   */
  async getLists(boardId) {
    return await this.get(`/boards/${boardId}/lists`);
  }

  /**
   * Obtiene las tarjetas de una lista específica
   * @param {string} listId - ID de la lista
   * @returns {Promise<Array>} Lista de tarjetas
   */
  async getCards(listId) {
    return await this.get(`/lists/${listId}/cards`);
  }

  /**
   * Crea una nueva tarjeta en una lista
   * @param {string} listId - ID de la lista
   * @param {string} name - Nombre de la tarjeta
   * @param {string} desc - Descripción (opcional)
   * @returns {Promise<object>} Tarjeta creada
   */
  async createCard(listId, name, desc = '') {
    return await this.post('/cards', {
      idList: listId,
      name,
      desc
    });
  }

  /**
   * Obtiene información del usuario actual
   * @returns {Promise<object>} Datos del usuario de Trello
   */
  async getCurrentUser() {
    return await this.get('/members/me');
  }
}

// Exportar instancia única (singleton)
export default new TrelloService();