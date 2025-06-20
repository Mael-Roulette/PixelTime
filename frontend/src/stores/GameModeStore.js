import { makeAutoObservable } from 'mobx';
import { getLanguage, getToken } from '../../utils/function';
import { t } from 'i18next';

const API_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

export default class GameModeStore {
  cards = [];
  placedCards = [];
  loading = false;
  cardResults = new Map();
  notification = null;
  score = 0;
  gameFinished = false;

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

  async finishGame () {
    if ( this.gameFinished ) return;

    this.showNotification( {
      type: 'finish',
      title: t( 'gameNotification.finish.title' ),
      message: t( 'gameNotification.finish.message' ),
      duration: 8000
    } );

    this.gameFinished = true;

    try {
      const token = getToken();
      if ( !token ) return;

      const response = await fetch( `${ API_URL }/users/add-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        },
        body: JSON.stringify( {
          score: this.score,
        } )
      } );

      if ( response.ok ) {
        const result = await response.json();

        return result;
      } else {
        throw new Error( 'Erreur lors de la sauvegarde du score' );
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la sauvegarde du score:', error );
    }
  }

  // Vérifie si la partie est terminée
  get isGameFinished () {
    return this.cards.length === 0 && this.placedCards.length > 0;
  }

  // Permet de placer une carte
  dropCard ( card, position ) {
    const result = this.getResult( card, position );

    this.cards = this.cards.filter( c => c.id !== card.id );

    if ( result.isCorrect ) {
      this.placedCards.splice( position, 0, card );
      this.addScore( 10 );

      this.showNotification( {
        type: 'success',
        title: t( 'gameNotification.success.title' ),
        message: t( 'gameNotification.success.message', { cardName: card.title } ),
        duration: 5000
      } );
    } else {
      const correctPosition = this.findCorrectPosition( card );
      this.placedCards.splice( correctPosition, 0, card );
      this.addScore( -5 );

      this.showNotification( {
        type: 'warning',
        title: t( 'gameNotification.incorrect.title' ),
        message: t( 'gameNotification.incorrect.message', { cardName: card.title } ),
        duration: 5000
      } );

      result.isCorrect = false;
      result.autoPlaced = true;
    }

    this.cardResults.set( card.id, result.isCorrect );

    if ( this.isGameFinished ) {
      setTimeout( () => {
        this.finishGame();
      }, 2000 );
    }

    return result;
  }

  // Trouverla position correcte d'une carte
  findCorrectPosition ( card ) {
    if ( this.placedCards.length === 0 ) {
      return 0;
    }

    for ( let i = 0; i < this.placedCards.length; i++ ) {
      if ( card.year <= this.placedCards[ i ].year ) {
        return i;
      }
    }

    return this.placedCards.length;
  }

  // Affiche une notification
  showNotification ( notification ) {
    this.notification = notification;

    // Auto-masquer la notif après la durée spécifiée
    if ( notification.duration ) {
      setTimeout( () => {
        this.hideNotification();
      }, notification.duration );
    }
  }

  // Masquer la notification
  hideNotification () {
    this.notification = null;
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


    if ( cardBefore && card.year < cardBefore.year ) {
      isCorrect = false;
    }

    if ( cardAfter && card.year > cardAfter.year ) {
      isCorrect = false;
    }

    return { cardId: card.id, isCorrect };
  }

  // Méthode pour ajouter/retirer des points
  addScore ( points ) {
    this.score += points;
    if ( this.score < 0 ) {
      this.score = 0;
    }
  }

  // Méthode pour réinitialiser le jeu
  resetGame () {
    this.cards = [];
    this.placedCards = [];
    this.cardResults.clear();
    this.score = 0;
  }
}