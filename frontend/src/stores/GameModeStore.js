import { makeAutoObservable, runInAction } from 'mobx';
import GameMode from './GameModeStore';
import authService from '../services/authService';

export default class GameStore {
  // État du jeu
  gameMode = null;
  cards = [];
  currentCard = null;
  currentCardIndex = 0;
  score = 0;
  lives = 0;
  timeRemaining = 0;
  gameStatus = 'waiting'; // 'waiting', 'playing', 'paused', 'finished'
  userAnswer = '';
  showResult = false;
  gameResults = [];

  // État de l'interface
  loading = false;
  error = null;

  constructor () {
    makeAutoObservable( this );
  }

  // Initialiser le jeu avec un mode
  async initializeGame ( modeType ) {
    runInAction( () => {
      this.loading = true;
      this.error = null;
    } );

    try {
      // Définir les modes de jeu disponibles
      const gameModes = {
        classic: new GameMode( {
          id: 1,
          name: 'Classique',
          description: 'Mode de jeu standard',
          image: '/images/classic.png',
          nbLives: 3,
          timePerCard: 30,
          multiplicator: 1
        } ),
        survival: new GameMode( {
          id: 2,
          name: 'Survie',
          description: 'Survie sans limite de temps',
          image: '/images/survival.png',
          nbLives: 1,
          timePerCard: -1,
          multiplicator: 2
        } ),
        timed: new GameMode( {
          id: 3,
          name: 'Contre la montre',
          description: 'Jeu rapide avec temps limité',
          image: '/images/timed.png',
          nbLives: -1,
          timePerCard: 15,
          multiplicator: 3
        } )
      };

      const selectedMode = gameModes[ modeType ];
      if ( !selectedMode ) {
        throw new Error( 'Mode de jeu invalide' );
      }

      // Charger les cartes pour le jeu
      await this.loadCards();

      runInAction( () => {
        this.gameMode = selectedMode;
        this.lives = selectedMode.nbLives;
        this.timeRemaining = selectedMode.timePerCard;
        this.score = 0;
        this.currentCardIndex = 0;
        this.gameStatus = 'waiting';
        this.gameResults = [];
        this.currentCard = this.cards[ 0 ] || null;
      } );

    } catch ( error ) {
      runInAction( () => {
        this.error = error.message;
      } );
    } finally {
      runInAction( () => {
        this.loading = false;
      } );
    }
  }

  // Charger les cartes depuis l'API
  async loadCards () {
    try {
      const token = authService.getToken();
      const language = localStorage.getItem( 'language' ) || 'fr';

      const response = await fetch( `http://localhost:8000/api/cards?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const cards = await response.json();
        // Mélanger les cartes aléatoirement
        const shuffledCards = this.shuffleArray( [ ...cards ] );

        runInAction( () => {
          this.cards = shuffledCards;
        } );
      } else {
        throw new Error( 'Erreur lors du chargement des cartes' );
      }
    } catch ( error ) {
      throw new Error( `Impossible de charger les cartes: ${ error.message }` );
    }
  }

  // Démarrer le jeu
  startGame () {
    runInAction( () => {
      this.gameStatus = 'playing';
      if ( this.gameMode.timePerCard > 0 ) {
        this.timeRemaining = this.gameMode.timePerCard;
        this.startTimer();
      }
    } );
  }

  // Gérer la réponse du joueur
  submitAnswer ( answer ) {
    if ( this.gameStatus !== 'playing' ) return;

    const isCorrect = this.checkAnswer( answer );
    const points = isCorrect ? ( 100 * this.gameMode.multiplicator ) : 0;

    runInAction( () => {
      this.userAnswer = answer;
      this.showResult = true;

      if ( isCorrect ) {
        this.score += points;
      } else if ( this.gameMode.nbLives > 0 ) {
        this.lives -= 1;
      }

      // Enregistrer le résultat
      this.gameResults.push( {
        cardId: this.currentCard.id,
        userAnswer: answer,
        correctAnswer: this.currentCard.year,
        isCorrect,
        points,
        timeSpent: this.gameMode.timePerCard - this.timeRemaining
      } );
    } );

    // Passer à la carte suivante après un délai
    setTimeout( () => {
      this.nextCard();
    }, 2000 );
  }

  // Vérifier la réponse
  checkAnswer ( answer ) {
    if ( !this.currentCard ) return false;

    const userYear = parseInt( answer );
    const correctYear = parseInt( this.currentCard.year );

    // Tolérance de ±5 ans
    return Math.abs( userYear - correctYear ) <= 5;
  }

  // Passer à la carte suivante
  nextCard () {
    runInAction( () => {
      this.showResult = false;
      this.userAnswer = '';

      // Vérifier les conditions de fin de jeu
      if ( this.lives === 0 || this.currentCardIndex >= this.cards.length - 1 ) {
        this.endGame();
        return;
      }

      // Carte suivante
      this.currentCardIndex += 1;
      this.currentCard = this.cards[ this.currentCardIndex ];

      // Réinitialiser le timer
      if ( this.gameMode.timePerCard > 0 ) {
        this.timeRemaining = this.gameMode.timePerCard;
      }
    } );
  }

  // Terminer le jeu
  async endGame () {
    runInAction( () => {
      this.gameStatus = 'finished';
    } );

    // Sauvegarder le score
    try {
      await this.saveScore();
    } catch ( error ) {
      console.error( 'Erreur lors de la sauvegarde du score:', error );
    }
  }

  // Sauvegarder le score
  async saveScore () {
    const token = authService.getToken();

    const response = await fetch( 'http://localhost:8000/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ token }`
      },
      body: JSON.stringify( {
        score: this.score,
        gameMode: this.gameMode.name,
        cardsPlayed: this.gameResults.length,
        accuracy: this.calculateAccuracy()
      } )
    } );

    if ( !response.ok ) {
      throw new Error( 'Erreur lors de la sauvegarde' );
    }
  }

  // Timer pour les modes avec temps limité
  startTimer () {
    if ( this.gameMode.timePerCard <= 0 ) return;

    this.timerInterval = setInterval( () => {
      runInAction( () => {
        if ( this.timeRemaining > 0 ) {
          this.timeRemaining -= 1;
        } else {
          // Temps écoulé, réponse incorrecte automatique
          this.submitAnswer( '' );
        }
      } );
    }, 1000 );
  }

  // Arrêter le timer
  stopTimer () {
    if ( this.timerInterval ) {
      clearInterval( this.timerInterval );
      this.timerInterval = null;
    }
  }

  // Utilitaires
  shuffleArray ( array ) {
    const shuffled = [ ...array ];
    for ( let i = shuffled.length - 1; i > 0; i-- ) {
      const j = Math.floor( Math.random() * ( i + 1 ) );
      [ shuffled[ i ], shuffled[ j ] ] = [ shuffled[ j ], shuffled[ i ] ];
    }
    return shuffled;
  }

  calculateAccuracy () {
    if ( this.gameResults.length === 0 ) return 0;
    const correct = this.gameResults.filter( result => result.isCorrect ).length;
    return Math.round( ( correct / this.gameResults.length ) * 100 );
  }

  // Actions de contrôle
  pauseGame () {
    runInAction( () => {
      this.gameStatus = 'paused';
    } );
    this.stopTimer();
  }

  resumeGame () {
    runInAction( () => {
      this.gameStatus = 'playing';
    } );
    if ( this.gameMode.timePerCard > 0 ) {
      this.startTimer();
    }
  }

  resetGame () {
    this.stopTimer();
    runInAction( () => {
      this.gameMode = null;
      this.cards = [];
      this.currentCard = null;
      this.currentCardIndex = 0;
      this.score = 0;
      this.lives = 0;
      this.timeRemaining = 0;
      this.gameStatus = 'waiting';
      this.userAnswer = '';
      this.showResult = false;
      this.gameResults = [];
      this.error = null;
    } );
  }

  // Getters computed
  get progress () {
    if ( this.cards.length === 0 ) return 0;
    return Math.round( ( ( this.currentCardIndex + 1 ) / this.cards.length ) * 100 );
  }

  get isGameActive () {
    return this.gameStatus === 'playing';
  }

  get isGameFinished () {
    return this.gameStatus === 'finished';
  }

  get hasLives () {
    return this.gameMode?.nbLives > 0;
  }

  get hasTimer () {
    return this.gameMode?.timePerCard > 0;
  }
}