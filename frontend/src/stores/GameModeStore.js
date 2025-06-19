import { makeAutoObservable } from 'mobx';
import { getToken, getLanguage } from '../../utils/function';

const API_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

export default class GameModeStore {
  cards = [];
  placedCards = [];
  loading = false;

  constructor () {
    makeAutoObservable( this );
  }

  async loadCards () {
    this.loading = true;
    const language = getLanguage();

    try {
      const response = await fetch( `${ API_URL }/cards/random/3?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        this.cards = data;
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des cartes :', error );
    } finally {
      this.loading = false;
    }
  }

  // Lance le jeu
  play () {
    this.loadCards();
  }

  // Permet de placer une carte
  placeCard ( card, position ) {
    // Retirer la carte des cartes disponibles
    this.cards = this.cards.filter( c => c.id !== card.id );

    // Insérer à la position spécifiée
    this.placedCards.splice( position, 0, card );
  }

  // Génère les positions possibles pour les drops
  get dropPositions () {
    if ( this.placedCards.length === 0 ) {
      return [ 0 ]; // Une seule position pour la première carte
    }

    // Créer une position avant, entre et après chaque carte
    const positions = [];
    for ( let i = 0; i <= this.placedCards.length; i++ ) {
      positions.push( i );
    }
    return positions;
  }
}