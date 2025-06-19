import { makeAutoObservable } from 'mobx';
import { getLanguage } from '../../utils/function';

const API_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

export default class GameModeStore {
  cards = [];
  placedCards = [];
  loading = false;
  cardResults = new Map();

  constructor () {
    makeAutoObservable( this );
  }

  async loadCards () {
    this.loading = true;
    const language = getLanguage();

    try {
      const response = await fetch( `${ API_URL }/cards/random/5?lang=${ language }`, {
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
  dropCard ( card, position ) {
    const result = this.getResult( card, position );
    // Retirer la carte des cartes disponibles
    this.cards = this.cards.filter( c => c.id !== card.id );
    console.log( this.cards );

    // Insérer à la position
    this.placedCards.splice( position, 0, card );
    console.log( position );
    console.log( this.placedCards );

    // Stocker les résultats pour pas qu'il s'enlève à tour de role
    this.cardResults.set( card.id, result.isCorrect );

    return result;
  }

  // Méthode pour récupérer le résultat d'une carte
  getCardResult ( cardId ) {
    return this.cardResults.has( cardId ) ? this.cardResults.get( cardId ) : null;
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

  // Permet de récupérer le résultat de la position
  getResult ( card, position ) {
    let cardBefore = position > 0 ? this.placedCards[ position - 1 ] : null;
    let cardAfter = position < this.placedCards.length ? this.placedCards[ position ] : null;
    let isCorrect = true;

    if ( this.placedCards.length === 0 ) {
      isCorrect = true;
    }

    console.log( 'PlaceCards length', this.placedCards.length );
    console.log( 'cardBefore:', cardBefore ? cardBefore : 'null' );
    console.log( 'cardAfter:', cardAfter ? cardAfter : 'null' );


    if ( cardBefore && card.year < cardBefore.year ) {
      console.log( "Erreur: année trop petite par rapport à la carte précédente" );
      isCorrect = false;
    }

    if ( cardAfter && card.year > cardAfter.year ) {
      console.log( "Erreur: année trop grande par rapport à la carte suivante" );
      isCorrect = false;
    }

    return { cardId: card.id, isCorrect };
  }

  // Méthode pour réinitialiser le jeu
  resetGame () {
    this.cards = [];
    this.placedCards = [];
    this.cardResults.clear();
  }
}