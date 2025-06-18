import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import adminService from "../../../services/adminService";

const AddCard = () => {
	const navigate = useNavigate();
	const currentYear = new Date().getFullYear();
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		title: "",
		year: "",
		image: "",
		frenchDescription: "",
		englishDescription: "",
		spanishDescription: "",
		frenchHint: "",
		englishHint: "",
		spanishHint: "",
	});
  const { onCarAdded } = useOutletContext();

	const handleGoBack = () => {
		navigate(-1);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setIsLoading(true);
		setErrors({});

		try {
			const cardData = {
				title: formData.title,
				year: parseInt(formData.year),
				image: formData.image,
				translations: [
					{
						locale: "fr",
						description: formData.frenchDescription,
						hint: formData.frenchHint,
					},
					{
						locale: "en",
						description: formData.englishDescription,
						hint: formData.englishHint,
					},
					{
						locale: "es",
						description: formData.spanishDescription,
						hint: formData.spanishHint,
					},
				],
			};

			await adminService.createCard(cardData);

      onCarAdded();
		} catch (error) {
			setErrors({
				general: error.message || "Erreur lors de la création de la carte",
			});
		} finally {
			setIsLoading(false);
			navigate("/admin/cards");
		}
	};

	return (
		<>
			<h2 className='admin-cards-add-title'>Ajout d'une nouvelle carte</h2>

			{errors.general && <div className='error-message'>{errors.general}</div>}

			{/* Formulaire de création */}
			<form onSubmit={handleSubmit} className='admin-cards-add-form'>
				<div className='add-form-container'>
					<label>Titre</label>
					<input
						type='text'
						name='title'
						value={formData.title}
						onChange={handleInputChange}
						required
						minLength={1}
						maxLength={100}
						placeholder='Tetris'
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Année</label>
					<input
						type='number'
						name='year'
						value={formData.year}
						onChange={handleInputChange}
						required
						min={1950}
						max={currentYear}
						placeholder='1974'
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Image</label>
					<input
						type='text'
						name='image'
						value={formData.image}
						onChange={handleInputChange}
						required
						minLength={5}
						maxLength={255}
						placeholder="nom-de-l-image (ex: tetris.jpg)"
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Description en Français</label>
					<textarea
						name='frenchDescription'
						value={formData.frenchDescription}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Description en Anglais</label>
					<textarea
						name='englishDescription'
						value={formData.englishDescription}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Description en Espagnol</label>
					<textarea
						name='spanishDescription'
						value={formData.spanishDescription}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Indice en Français</label>
					<textarea
						name='frenchHint'
						value={formData.frenchHint}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Indice en Anglais</label>
					<textarea
						name='englishHint'
						value={formData.englishHint}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='add-form-container'>
					<label>Indice en Espagnol</label>
					<textarea
						name='spanishHint'
						value={formData.spanishHint}
						onChange={handleInputChange}
						rows='8'
						required
						minLength={10}
						maxLength={1000}
						disabled={isLoading}
					/>
				</div>

				<div className='admin-cards-add-form-buttons'>
					<button type='submit' className='button-primary' disabled={isLoading}>
						{isLoading ? "Enregistrement..." : "Enregistrer"}
					</button>
					<button
						type='button'
						onClick={handleGoBack}
						className='button-secondary'
						disabled={isLoading}
					>
						Annuler
					</button>
				</div>
			</form>
		</>
	);
};

export default AddCard;
