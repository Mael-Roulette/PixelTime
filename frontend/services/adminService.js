class AdminService {
  constructor () {
    this.TOKEN_KEY = 'jwt_token';
    this.LANGUAGE_KEY = 'language';
    this.baseURL = 'http://localhost:8000';
  }

  // Méthode pour obtenir le token JWT
  getToken () {
    return localStorage.getItem( this.TOKEN_KEY );
  }

  // Méthode pour obtenir la langue
  getLanguage () {
    return localStorage.getItem( this.LANGUAGE_KEY ) || 'fr'; // 'fr' par défaut
  }

  // Permet de récupérer un tableau avec tous les utilisateurs
  async getUsers () {
    const token = this.getToken();

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
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des utilisateurs :', error );
    }
  }

  // Permet de récupérer un tableau avec toutes les cartes selon la langue de l'administrateur
  async getCards () {
    const token = this.getToken();
    const language = this.getLanguage();

    try {
      const response = await fetch( `${ this.baseURL }/cards?lang=${ language }`, {
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
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des cartes :', error );
    }
  }

  // Permet de supprimer un utilisateur
  async deleteUser ( userId ) {
    const token = this.getToken();

    try {
      const response = await fetch( `${ this.baseURL }/users/${ userId }`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        return { success: true, message: 'Utilisateur supprimé avec succès' };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Erreur lors de la suppression' };
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la suppression de l\'utilisateur :', error );
      return { success: false, error: 'Une erreur est survenue lors de la suppression' };
    }
  }

  // Permet d'ajouter une carte
  async createCard ( cardData ) {
    const token = this.getToken();

    try {
      const response = await fetch( `${ this.baseURL }/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`,
        },
        body: JSON.stringify( cardData )
      } );

      if ( response.ok ) {
        return { success: true, message: 'Carte créée avec succès' };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Erreur lors de la création' };
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la création de la carte :', error );
      return { success: false, error: 'Une erreur est survenue lors de la création' };
    }
  }
}



const adminService = new AdminService();
export default adminService;