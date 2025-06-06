class AuthService {
  constructor () {
    this.TOKEN_KEY = 'jwt_token';
    this.baseURL = 'http://localhost:8000';
  }

  // Méthode de connexion
  async login ( email, password ) {
    try {
      const response = await fetch( `${ this.baseURL }/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { email, password } )
      } );

      const data = await response.json();

      if ( response.ok ) {
        localStorage.setItem( this.TOKEN_KEY, data.token );
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
      const response = await fetch( `${ this.baseURL }/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( userData )
      } );

      const data = await response.json();

      if ( response.ok ) {
        // Stocker automatiquement le token après inscription
        localStorage.setItem( this.TOKEN_KEY, data.token );
        localStorage.setItem( this.USER_KEY, JSON.stringify( data.user ) );
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
    localStorage.removeItem( this.TOKEN_KEY );
  }

  // Méthode pour vérifier si l'utilisateur est connecté
  isAuthenticated () {
    return !!localStorage.getItem( this.TOKEN_KEY );
  }

  // Méthode pour vérifier si l'utilisateur est admin
  async isAdmin () {
    const token = this.getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ this.baseURL }/user/role`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ token }`
        }
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

  // Méthode pour obtenir le token JWT
  getToken () {
    return localStorage.getItem( this.TOKEN_KEY );
  }

  // Méthode pour vérifier le token JWT
  async verifyToken () {
    const token = this.getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ this.baseURL }/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      return response.ok;
    } catch ( error ) {
      console.error( 'Erreur de vérification du token:', error );
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;