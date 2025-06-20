import { t } from 'i18next';
import GameModeStore from './GameModeStore';

export default class LivesModeStore extends GameModeStore {
  constructor () {
    super();
    this.lives = 3;
    this.scoreMultiplier = 1.5;
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

    // Vérifier si le joueur a perdu toutes ses vies
    if ( this.lives <= 0 ) {
      this.showNotification( {
        type: 'gameOver',
        title: 'Game Over!',
        message: 'Vous avez perdu toutes vos vies.',
        duration: 5000
      } );
    }
  }

  resetGame () {
    super.resetGame();
    this.lives = 3;
    this.scoreMultiplier = 1.5;
  }
}