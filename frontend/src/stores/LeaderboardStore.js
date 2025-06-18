import { makeAutoObservable, runInAction } from "mobx";

export default class LeaderboardStore {
  _users = [];
  _levels = [];
  _isLoaded = false;

  constructor () {
    this.loadLevels();
    makeAutoObservable( this );
  }

  async loadLevels () {
    try {
      const response = await fetch( 'http:localhost:8000/api/levels' );

      if ( !response.ok ) {
        throw new Error( "Erreur lors du chargement des oeuvres" );
      }

      const levelsList = await response.json();

      runInAction( () => {
        this._levels = levelsList;
        this._isLoaded = true;
      } )

    } catch ( error ) {
      console.error( "Erreur lors du chargement des oeuvres : ", error );
    }
  }
}