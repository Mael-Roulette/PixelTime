import { makeObservable, observable, action, computed } from 'mobx';
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
  maxCards = 7;

  constructor () {
    makeObservable( this, {
      cards: observable,
      placedCards: observable,
      loading: observable,
      cardResults: observable,
      notification: observable,
      score: observable,
      gameFinished: observable,
      lives: observable,
      timeLeft: observable,
      scoreMultiplier: observable,
      maxCards: observable,

      loadCards: action,
      play: action,
      finishGame: action,
      dropCard: action,
      handleIncorrectAnswer: action,
      showNotification: action,
      hideNotification: action,
      resetGame: action,
      saveGameState: action,
      loadGameState: action,

      isGameFinished: computed,
    } );
  }

  /**
   * Permet de charger un nombre de carte défini aléatoirement
   */
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
        this.cards = data;
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des cartes :', error );
    } finally {
      this.loading = false;
    }
  }

  /**
   * Permet de démarrer le jeu
   */
  play () {
    if ( !this.loadGameState() ) {
      this.loadCards();
    }
  }

  /**
   * Permet de terminer la partie en cours
   * @description Cette méthode est appelée lorsque la partie est terminée, soit parce que l'utilisateur a placé toutes les cartes, soit parce qu'il n'a plus de vies.
   * Elle calcule le score final et le rendre dans la table du joueur et affiche une notification de fin de jeu.
   * @returns
   */
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

  /**
   * Permet de savoir si le jeu est terminé
   */
  get isGameFinished () {
    const gameOverByLives = this.isGameOver();
    const gameOverByCards = !this.loading &&
        this.cards.length === 0 &&
        this.placedCards.length >= this.maxCards &&
        !this.gameFinished;

    const result = gameOverByLives || gameOverByCards;

    return result;
  }

  /**
   * Permet de déposer une carte à une position donnée
   * @description Cette méthode est appelée lorsque l'utilisateur dépose une carte sur la timeline
   * @param {*} card c'est la carte à déposer
   * @param {*} position c'est la position où la carte doit être déposée
   * @returns {Object} Un objet contenant le résultat du dépôt de la carte, avec un booléen isCorrect indiquant si le dépôt est correct ou non.
   */
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

  /**
   * Permet de gérer une réponse incorrecte
   * @description Cette méthode est appelée lorsque l'utilisateur dépose une carte à une position incorrecte et envoie une notification
   * @param {*} card c'est la carte qui a été déposée et qui est mal placée
   * @param {*} result c'est le résultat du dépôt de la carte, avec un booléen isCorrect indiquant si le dépôt est correct ou non.
   */
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

  /**
   * Permet de savoir si le jeu est terminé
   * @returns {boolean} Retourne true si le jeu est terminé, false sinon
   */
  isGameOver () {
    return this.lives !== null && this.lives <= 0;
  }

  /**
   * PErmet de trouver la bonne position pour placer une carte en cas d'erreur
   * @param {*} card c'est la carte à placer
   * @returns {number} Retourne la position correcte pour placer la carte
   */
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

  /**
   * Afficge une notification / Message à l'utilisateur
   * @param {*} notification C'est l'objet de notification à afficher
   */
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

  /**
   * Permet de masquer la notification actuelle
   */
  hideNotification () {
    this.notification = null;
  }

  /**
   * Permet de récupérer le résultat d'une carte précise
   * @param {*} cardId C'est l'identifiant de la carte pour laquelle on veut récupérer le résultat
   * @returns {Object|null} Retourne l'objet de résultat de la carte si elle existe, sinon retourne null
   */
  getCardResult ( cardId ) {
    return this.cardResults.has( cardId ) ? this.cardResults.get( cardId ) : null;
  }

  /**
   * Génère les positions où l'utilisateur peut déposer une carte
   */
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

  /**
   * PErmet de récupérer le résultat d'une carte à une position donnée
   * @param {*} card C'est la carte pour laquelle on veut récupérer le résultat
   * @param {*} position C'est la position où la carte a été déposée
   * @returns {Object} Retourne un objet contenant l'identifiant de la carte et un booléen isCorrect indiquant si le dépôt est correct ou non.
   */
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

  /**
   * Permet d'ajouter des points au score du joueur
   * @param {*} points C'est le nombre de points à ajouter
   */
  addScore ( points ) {
    this.score += points;
    if ( this.score < 0 ) {
      this.score = 0;
    }
  }

  /**
   * Permet de quitter le jeu
   */
  async quitGame () {
    if ( !this.gameFinished && this.placedCards.length > 0 ) {
      await this.finishGame();
    }

    this.resetGame();
    this.gameFinished = false;
    this.hideNotification();
  }

  /**
   * Permet de réinitialiser le jeu
   */
  resetGame () {
    this.cards = [];
    this.placedCards = [];
    this.cardResults.clear();
    this.score = 0;
    this.clearGameState();
  }

  /**
   * Permet de sauvegarder l'état du jeu dans le localStorage en cas de reprise
   */
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

  /**
   * Charger l'état du jeu depuis le localStorage en cas de reprise
   * @returns {boolean} Retourne true si l'état du jeu a été chargé avec succès, false sinon.
   */
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

  /**
   * Permet de supprimer la sauvegarde de l'état du jeu
   */
  clearGameState () {
    localStorage.removeItem( 'pixeltime_game_state' );
  }

  /**
   * Permet de vérifier si une partie est en cours
   * @returns {boolean} Retourne true si une partie est en cours, false sinon.
   */
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