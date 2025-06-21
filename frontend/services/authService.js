import { getToken, TOKEN_KEY, USER_KEY } from "../utils/function";

const API_URL =  import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

class AuthService {
  /**
   * Méthode pour la connexion d'un utilisateur
   * @param {*} email email de l'utilisateur
   * @param {*} password mot de passe de l'utilisateur
   * @returns {Promise<Object>} Un objet contenant le token et les informations de l'utilisateur
   * @throws {Error} Si une erreur se produit lors de la connexion
   */
  async login ( email, password ) {
    try {
      const response = await fetch( `${ API_URL }/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email, password } )
      } );

      const data = await response.json();

      if ( response.ok ) {
        localStorage.setItem( TOKEN_KEY, data.token );
        localStorage.setItem( USER_KEY, JSON.stringify( data.user ) );

        return data;
      } else {
        throw new Error( data.error || 'Erreur lors de la connexion' );
      }
    } catch ( error ) {
      console.error( 'Erreur de connexion:', error );
      throw error;
    }
  }

  /**
   * Permet l'inscription d'un nouvel utilisateur
   * @param {Object} userData - Les données de l'utilisateur à enregistrer
   * @returns {Promise<Object>} Un objet contenant les informations de l'utilisateur inscrit
   * @throws {Error} Si une erreur se produit lors de l'inscription
   */
  async register ( userData ) {
    try {
      const response = await fetch( `${ API_URL }/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( userData )
      } );

      const data = await response.json();

      if ( response.ok ) {
        return data;
      } else {
        throw new Error( data.error || data.errors || 'Erreur lors de l\'inscription' );
      }
    }
    catch ( error ) {
      console.error( 'Erreur d\'inscription:', error );
      throw error;
    }
  }

  /**
   * Permet de déconnecter l'utilisateur
   * @returns {void}
   */
  logout () {
    localStorage.removeItem( 'jwt_token' );
    localStorage.removeItem( 'language' );
  }

  /**
   * Méthode pour vérifier si l'utilisateur est authentifié
   * @returns {boolean} true si l'utilisateur est authentifié, false sinon
   * @description La méthode contient deux "!" pour remettre le booléan à son état d'origine
   */
  isAuthenticated () {
    return !!localStorage.getItem( 'jwt_token' );
  }

  /**
   * Permet de vérifier si l'utilisateur est admin
   * @returns {Promise<boolean>} true si l'utilisateur est admin, false sinon
   * @throws {Error} Si une erreur se produit lors de la vérification du rôle
   */
  async isAdmin () {
    const token = getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ API_URL }/user/role`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        },
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data.isAdmin === true || data.role === 'admin';
      }
      return false;
    } catch ( error ) {
      console.error( 'Erreur lors de la vérification du rôle admin:', error );
      return false;
    }
  }

  /**
   * Récupère les informations de l'utilisateur authentifié
   * @returns {Promise<Object|boolean>} Les informations de l'utilisateur si authentifié, false sinon
   * @throws {Error} Si une erreur se produit lors de la récupération de l'utilisateur
   */
  async getUser () {
    const token = getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ API_URL }/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );


      const data = await response.json();

      if ( response.ok ) {
        return data;
      } else {
        throw new Error( data.error || data.errors || 'Erreur lors de la récupération de l\'utilisateur' );
      }
    }
    catch ( error ) {
      console.error( 'Erreur de récupération :', error );
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;