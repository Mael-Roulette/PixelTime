class LeaderboardService {
  constructor () {
    this.TOKEN_KEY = 'jwt_token';
    this.baseURL = 'http://localhost:8000/api';
  }

  // Méthode pour obtenir le token JWT
  getToken () {
    return localStorage.getItem( this.TOKEN_KEY );
  }

  // Récupérer le leaderboard
  async getLeaderboard ( levelId = null, limit = 50 ) {
    const token = this.getToken();

    try {
      let url = `${ this.baseURL }/leaderboard?limit=${ limit }`;
      if ( levelId ) {
        url += `&level=${ levelId }`;
      }

      const response = await fetch( url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      } else {
        throw new Error( 'Erreur lors de la récupération du classement' );
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération du classement:', error );
      throw error;
    }
  }

  // Récupérer le top N joueurs
  async getTopPlayers ( limit = 10 ) {
    const token = this.getToken();

    try {
      const response = await fetch( `${ this.baseURL }/leaderboard/top/${ limit }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      } else {
        throw new Error( 'Erreur lors de la récupération du top' );
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération du top:', error );
      throw error;
    }
  }

  // Récupérer le rang d'un utilisateur
  async getUserRank ( userId ) {
    const token = this.getToken();

    try {
      const response = await fetch( `${ this.baseURL }/leaderboard/user/${ userId }/rank`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      } else {
        throw new Error( 'Erreur lors de la récupération du rang' );
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération du rang:', error );
      throw error;
    }
  }
}

const leaderboardService = new LeaderboardService();
export default leaderboardService;