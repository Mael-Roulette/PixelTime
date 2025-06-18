import { makeAutoObservable } from 'mobx';
import { getToken, getLanguage } from '../../utils/function';

const API_URL =  import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

export default class GameModeStore {
  _cards = [];
  _card = [];
  _cardsPlay = [];
  loading = false;

  constructor () {
    this.loadCards();

    makeAutoObservable( this );
  }

  async loadCards () {
    const token = getToken();
    const language = getLanguage();

    try {
      const response = await fetch( `${ API_URL }/cards/random/15?lang=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();

        this._cards = data;
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des cartes :', error );
    }
  }
}