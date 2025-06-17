import { makeAutoObservable, runInAction } from 'mobx';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import leaderboardService from '../../services/leaderboardService';

export default class AppStore {
  users = [];
  leaderboard = [];
  levels = [];
  loading = false;
  error = null;

  constructor () {
    makeAutoObservable( this );
  }

  // Actions pour les utilisateurs
  async fetchUsers () {
    this.setLoading( true );
    try {
      const users = await adminService.getUsers();
      runInAction( () => {
        this.users = users;
        this.error = null;
      } );
    } catch ( error ) {
      runInAction( () => {
        this.error = error.message;
      } );
    } finally {
      runInAction( () => {
        this.setLoading( false );
      } );
    }
  }

  // Récupérer le leaderboard
  async fetchLeaderboard ( levelId = null, limit = 50 ) {
    this.loading = true;
    this.error = null;

    try {
      const data = await leaderboardService.getLeaderboard( levelId, limit );
      this.leaderboard = data;
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération du leaderboard:', error );
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  // Actions pour les levels
  async fetchLevels () {
    this.setLoading( true );
    try {
      const token = authService.getToken();
      const language = localStorage.getItem( 'language' ) || 'fr';

      const response = await fetch( `http://localhost:8000/api/levels?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const levels = await response.json();
        runInAction( () => {
          this.levels = levels;
          this.error = null;
        } );
      } else {
        throw new Error( 'Erreur lors de la récupération des levels' );
      }
    } catch ( error ) {
      runInAction( () => {
        this.error = error.message;
      } );
    } finally {
      runInAction( () => {
        this.setLoading( false );
      } );
    }
  }

  // Actions utilitaires
  setLoading ( loading ) {
    this.loading = loading;
  }

  setError ( error ) {
    this.error = error;
  }

  clearError () {
    this.error = null;
  }

  // Computed values (getters)
  get userCount () {
    return this.users.length;
  }

  get levelCount () {
    return this.levels.length;
  }

  get isLoading () {
    return this.loading;
  }

  get hasError () {
    return this.error !== null;
  }
}