import { getToken } from "../utils/function";

const API_URL =  import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

class AuthService {
  // Méthode de connexion
  async login ( email, password ) {
    try {
      const response = await fetch( `${ API_URL }/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email, password } )
      } );

      const data = await response.json();

      if ( response.ok ) {
        localStorage.setItem( this.TOKEN_KEY, data.token );
        localStorage.setItem( this.USER_KEY, JSON.stringify( data.user ) );

        return data;
      } else {
        throw new Error( data.error || 'Erreur lors de la connexion' );
      }
    } catch ( error ) {
      console.error( 'Erreur de connexion:', error );
      throw error;
    }
  }

  // Méthode d'inscription
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

  // Méthode de déconnexion
  logout () {
    localStorage.removeItem( 'jwt_token' );
    localStorage.removeItem( 'language' );
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated () {
    return !!localStorage.getItem( 'jwt_token' );
  }

  // Méthode pour vérifier si l'utilisateur est admin
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

  // Permet de récupére l'utilisateur actuel
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

      // On refresh le token s'il est expiré
      if ( response.status === 401 ) {
        return await this.refreshToken();
      }


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

  // Rafraîchir le token
  async refreshToken () {
    const token = getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ API_URL }/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        localStorage.setItem( this.TOKEN_KEY, data.token );
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch ( error ) {
      console.error( 'Erreur lors du refresh du token:', error );
      this.logout();
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;