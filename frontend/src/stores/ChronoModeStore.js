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

  play () {
    if ( !this.loadGameState() ) {
      this.loadCards();
    }
    this.startTimer();
  }

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

  handleTimeOut () {
    if ( this.cards.length > 0 ) {
      const currentCard = this.cards[ 0 ];
      // Placer automatiquement la carte à une position aléatoire (erreur)
      const randomPosition = Math.floor( Math.random() * ( this.placedCards.length + 1 ) );
      this.dropCard( currentCard, randomPosition );
    }
  }

  dropCard ( card, position ) {
    const result = super.dropCard( card, position );

    // Réinitialiser le timer pour la prochaine carte
    if ( this.cards.length > 0 && !this.gameFinished && !this.isGameOver() ) {
      this.timeLeft = 5;
    } else {
      this.stopTimer();
    }

    return result;
  }

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
      this.showNotification( {
        type: 'gameOver',
        title: 'Game Over!',
        message: 'Vous avez perdu toutes vos vies.',
        duration: 5000
      } );
      this.stopTimer();
    }
  }

  stopTimer () {
    if ( this.timer ) {
      clearInterval( this.timer );
      this.timer = null;
    }
  }

  resetGame () {
    super.resetGame();
    this.lives = 5;
    this.timeLeft = 5;
    this.scoreMultiplier = 2;
    this.stopTimer();
  }

  async finishGame () {
    this.stopTimer();
    await super.finishGame();
  }
}