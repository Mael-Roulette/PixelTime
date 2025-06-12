class AdminService {
  constructor () {
    this.TOKEN_KEY = 'jwt_token';
    this.baseURL = 'http://localhost:8000';
  }

  // Méthode pour obtenir le token JWT
  getToken () {
    return localStorage.getItem( this.TOKEN_KEY );
  }

  async getUsers () {
    const token = this.getToken();
    if ( !token ) return false;

    try {
      const response = await fetch( `${ this.baseURL }/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      }

      return false;
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des utilisateurs :', error );
      return false;
    }
  }
}

const adminService = new AdminService();
export default adminService;