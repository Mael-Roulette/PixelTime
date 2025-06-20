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
  lives = null;
  timeLeft = null;
  scoreMultiplier = 1;
  maxCards = 5;

  constructor () {
    makeAutoObservable( this );
  }

  async loadCards () {
    this.loading = true;
    const language = getLanguage();

    try {
      const response = await fetch( `${ API_URL }/cards/random/${ this.maxCards }?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        console.log( data );
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
    if ( !this.loadGameState() ) {
      this.loadCards();
    }
  }

  async finishGame () {
    if ( this.gameFinished ) return;

    const finalScore = Math.floor( this.score * this.scoreMultiplier );
    this.score = finalScore;

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

      await fetch( `${ API_URL }/users/add-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        },
        body: JSON.stringify( {
          score: this.score,
        } )
      } );
    } catch ( error ) {
      console.error( 'Erreur lors de la sauvegarde du score:', error );
    }

    this.clearGameState();
  }

  // Vérifie si la partie est terminée
  get isGameFinished () {
    const result = !this.loading &&
      this.cards.length === 0 &&
      this.placedCards.length >= this.maxCards &&
      !this.gameFinished;

    console.log('🎯 isGameFinished check:', {
      loading: this.loading,
      cardsLength: this.cards.length,
      placedCardsLength: this.placedCards.length,
      maxCards: this.maxCards,
      gameFinished: this.gameFinished,
      result: result
    });

    return result;
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
        duration: 3500
      } );
    } else {
      this.handleIncorrectAnswer( card, result );
    }

    this.cardResults.set( card.id, result.isCorrect );
    this.saveGameState();

    if ( this.isGameFinished || this.isGameOver() ) {
      setTimeout( () => {
        this.finishGame();
      }, 2000 );
    }

    return result;
  }

  handleIncorrectAnswer ( card, result ) {
    const correctPosition = this.findCorrectPosition( card );
    this.placedCards.splice( correctPosition, 0, card );
    this.addScore( -5 );

    this.showNotification( {
      type: 'warning',
      title: t( 'gameNotification.incorrect.title' ),
      message: t( 'gameNotification.incorrect.message', { cardName: card.title } ),
      duration: 3500
    } );

    result.isCorrect = false;
    result.autoPlaced = true;
  }

  isGameOver () {
    return this.lives !== null && this.lives <= 0;
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
    this.hideNotification();

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

  async quitGame () {
    if ( !this.gameFinished && this.placedCards.length > 0 ) {
      await this.finishGame();
    }

    this.resetGame();
    this.gameFinished = false;
    this.hideNotification();
  }

  // Méthode pour réinitialiser le jeu
  resetGame () {
    this.cards = [];
    this.placedCards = [];
    this.cardResults.clear();
    this.score = 0;
    this.clearGameState();
  }

  // Sauvegarder l'état du jeu
  saveGameState () {
    const gameState = {
      cards: this.cards,
      placedCards: this.placedCards,
      score: this.score,
      cardResults: Array.from( this.cardResults.entries() ),
      gameFinished: this.gameFinished,
      lives: this.lives,
      timeLeft: this.timeLeft,
      scoreMultiplier: this.scoreMultiplier,
      timestamp: Date.now()
    };
    localStorage.setItem( 'pixeltime_game_state', JSON.stringify( gameState ) );
  }

  // Charger l'état du jeu
  loadGameState () {
    const savedState = localStorage.getItem( 'pixeltime_game_state' );
    if ( savedState ) {
      try {
        const gameState = JSON.parse( savedState );

        const maxAge = 24 * 60 * 60 * 1000;
        if ( Date.now() - gameState.timestamp > maxAge ) {
          this.clearGameState();
          return false;
        }

        this.cards = gameState.cards || [];
        this.placedCards = gameState.placedCards || [];
        this.score = gameState.score || 0;
        this.cardResults = new Map( gameState.cardResults || [] );
        this.gameFinished = gameState.gameFinished || false;
        this.lives = gameState.lives;
        this.timeLeft = gameState.timeLeft;
        this.scoreMultiplier = gameState.scoreMultiplier || 1;

        return true;
      } catch ( error ) {
        console.error( 'Erreur lors du chargement de la sauvegarde:', error );
        this.clearGameState();
      }
    }
    return false;
  }

  // Supprimer la sauvegarde
  clearGameState () {
    localStorage.removeItem( 'pixeltime_game_state' );
  }

  // Vérifier s'il y a une partie en cours
  hasGameInProgress () {
    const savedState = localStorage.getItem( 'pixeltime_game_state' );
    if ( savedState ) {
      try {
        const gameState = JSON.parse( savedState );
        return gameState.cards.length > 0 || gameState.placedCards.length > 0;
      } catch {
        return false;
      }
    }
    return false;
  }
}