import { useNavigate } from "react-router";
import BottomNavBar from "../../components/BottomNavBar";
import GameMode from "../../stores/GameMode";

export default function GameChoice() {
	const navigate = useNavigate();

	const gameModes = [
		{
			id: "classic",
			name: "Mode Classique",
			description: "Mode sans limite, parfait pour apprendre",
			config: {
				name: "classic",
				description: "Mode sans pression",
				scoreBonus: 10,
				scorePenalty: 5,
				allowRetry: true,
				availableToGuests: true,
			},
		},
		{
			id: "lives",
			name: "Mode Survie",
			description: "3 vies pour réussir le maximum de cartes",
			config: {
				name: "lives",
				description: "Mode survie avec 3 vies",
				maxLives: 3,
				scoreBonus: 15,
				scorePenalty: 5,
				allowRetry: false,
			},
		},
		{
			id: "chrono",
			name: "Mode Chrono",
			description: "10 secondes par carte, 5 vies",
			config: {
				name: "chrono",
				description: "Mode chronométré",
				maxLives: 5,
				hasTimer: true,
				timePerCard: 10,
				scoreBonus: 20,
				scorePenalty: 10,
				allowRetry: false,
			},
		},
	];

	const handleModeSelect = (modeConfig) => {
		// Créer une instance du mode de jeu
		const gameMode = new GameMode(modeConfig.config);

		// Stocker la configuration dans localStorage ou context
		localStorage.setItem("selectedGameMode", JSON.stringify(modeConfig));

		// Naviguer vers le plateau de jeu
		navigate("/game/board", {
			state: {
				gameMode: gameMode,
				modeConfig: modeConfig,
			},
		});
	};

	return (
		<>
			<BottomNavBar />

			<div className='game-choice-container'>
				<h1>Choix du Mode de Jeu</h1>

				<div className='game-modes-grid'>
					{gameModes.map((mode) => (
						<div
							key={mode.id}
							className='game-mode-card'
							onClick={() => handleModeSelect(mode)}
						>
							<div className='mode-icon'>{mode.icon}</div>
							<h3>{mode.name}</h3>
							<p>{mode.description}</p>

							<div className='mode-details'>
								{mode.config.maxLives && (
									<span className='detail'>❤️ {mode.config.maxLives} vies</span>
								)}
								{mode.config.hasTimer && (
									<span className='detail'>⏱️ {mode.config.timePerCard}s</span>
								)}
								{mode.config.trainingMode && (
									<span className='detail'>🎓 Entraînement</span>
								)}
							</div>

							<button className='select-mode-btn'>Jouer</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
