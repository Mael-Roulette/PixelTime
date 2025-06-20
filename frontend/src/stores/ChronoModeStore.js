import { t } from 'i18next';
import GameModeStore from './GameModeStore';

export default class ChronoModeStore extends GameModeStore {
  timer = null;

  constructor () {
    super();
    this.lives = 5;
    this.timeLeft = 5;
    this.scoreMultiplier = 2;
  }

  /**
   * @override
   * Permet de lancer le jeu avec un timer
   */
  play () {
    if ( !this.loadGameState() ) {
      this.loadCards();
    }
    this.startTimer();
  }

  /**
   * Permet de démarrer le timer pour le mode Chrono
   */
  startTimer () {
    if ( this.timer ) {
      clearInterval( this.timer );
    }

    this.timer = setInterval( () => {
      this.timeLeft--;
      this.saveGameState();

      if ( this.timeLeft <= 0 ) {
        this.handleTimeOut();
      }
    }, 1000 );
  }

  /**
   * Permet de gérer le timeout lorsque le temps est écoulé
   */
  handleTimeOut () {
    if ( this.cards.length > 0 && !this.isGameFinished && !this.isGameOver() ) {
      const currentCard = this.cards[ 0 ];
      const randomPosition = Math.floor( Math.random() * ( this.placedCards.length + 1 ) );
      this.dropCard( currentCard, randomPosition );
    } else {
      this.stopTimer();
    }
  }

  /**
   * @override
   * Permet de déposer une carte à une position donnée
   * @param {*} card c'est la carte à placé
   * @param {*} position c'est la position où la carte doit être placée
   * @returns Retourne le résultat de la méthode parent dropCard
   */
  dropCard ( card, position ) {
    const result = super.dropCard( card, position );

    if ( this.isGameFinished || this.isGameOver() ) {
      this.stopTimer();
    } else if ( this.cards.length > 0 ) {
      this.timeLeft = 5;
    }

    return result;
  }

  /**
   * @override
   * Permet de gérer une réponse incorrecte avec le nombre de vies de l'utilisateur
   * @param {*} card c'est la carte qui a été placée
   * @param {*} result c'est le résultat de la réponse
   */
  handleIncorrectAnswer ( card, result ) {
    const correctPosition = this.findCorrectPosition( card );
    this.placedCards.splice( correctPosition, 0, card );
    this.addScore( -5 );
    this.lives--;

    this.showNotification( {
      type: 'warning',
      title: t( 'gameNotification.incorrect.title' ),
      message: t( 'gameNotification.incorrect.message', { cardName: card.title } ) + ` (${ this.lives } vies restantes)`,
      duration: 3500
    } );

    result.isCorrect = false;
    result.autoPlaced = true;

    if ( this.lives <= 0 ) {
      this.stopTimer();
      this.showNotification( {
        type: 'gameOver',
        title: 'Game Over!',
        message: 'Vous avez perdu toutes vos vies.',
        duration: 5000
      } );
      this.stopTimer();
    }
  }

  /**
   * Permet de stopper le timer
   */
  stopTimer () {
    if ( this.timer ) {
      clearInterval( this.timer );
      this.timer = null;
    }
  }

  /**
   * @override
   * Permet de réinitialiser le jeu en mode "Chrono"
   */
  resetGame () {
    super.resetGame();
    this.lives = 5;
    this.timeLeft = 5;
    this.scoreMultiplier = 2;
    this.stopTimer();
  }

  /**
   * @override
   * Permet de terminer le jeu en mode "Chrono"
   */
  async finishGame () {
    this.stopTimer();
    await super.finishGame();
  }
}