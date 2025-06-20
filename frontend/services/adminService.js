import { getToken, getLanguage } from "../utils/function";
import { makeAutoObservable } from 'mobx';

const API_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000/api';
const token = getToken();
const language = getLanguage();

class AdminService {
  constructor () {
    makeAutoObservable( this );
  }

  /**
   * Permet de récupérer tous les utilisateurs
   * @returns {Promise<Array>} Un tableau d'utilisateurs
   * @throws {Error} Si une erreur se produit lors de la récupération des utilisateurs
   */
  async getUsers () {
    try {
      const response = await fetch( `${ API_URL }/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      }
    } catch ( error ) {
      throw new Error( 'Erreur lors de la récupération des utilisateurs : ' + error.message );
    }
  }

  /**
   * Permet de supprimer un utilisateur donné
   * @param {string} userId - L'ID de l'utilisateur à supprimer
   * @return {Promise<Object>} Un objet contenant le statut de la suppression
   * @throws {Error} Si une erreur se produit lors de la suppression
   */
  async deleteUser ( userId ) {
    try {
      const response = await fetch( `${ API_URL }/users/${ userId }`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        return { success: true, message: 'Utilisateur supprimé avec succès' };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Erreur lors de la suppression' };
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la suppression de l\'utilisateur :', error );
      return { success: false, error: 'Une erreur est survenue lors de la suppression' };
    }
  }

  /**
   * Permet de récupérer toutes les cartes en fonction de la langue de l'utilisateur
   * @returns {Promise<Array>} Un tableau de cartes
   * @throws {Error} Si une erreur se produit lors de la récupération des cartes
   */
  async getCards () {
    try {
      const response = await fetch( `${ API_URL }/cards?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      }
    } catch ( error ) {
      console.error( 'Erreur lors de la récupération des cartes :', error );
    }
  }

  /**
   * Permet de créer une carte à partir des data d'un formulaires
   * @param {Object} cardData - Les données de la carte à créer
   * @returns {Promise<Object>} Un objet contenant le statut de la création
   * @throws {Error} Si une erreur se produit lors de la création de la carte
   */
  async createCard ( cardData ) {
    try {
      const response = await fetch( `${ API_URL }/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`,
        },
        body: JSON.stringify( cardData )
      } );

      if ( response.ok ) {
        return { success: true, message: 'Carte créée avec succès' };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Erreur lors de la création' };
      }
    } catch {
      return { success: false, error: 'Une erreur est survenue lors de la création' };
    }
  }

  /**
   * Permet de récupérer tous les niveaux du jeu
   * @returns {Promise<Array>} Un tableau de niveaux
   * @throws {Error} Si une erreur se produit lors de la récupération des niveaux
   */
  async getLevels () {
    try {
      const response = await fetch( `${ API_URL }/levels?lang=${ language }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ token }`
        }
      } );

      if ( response.ok ) {
        const data = await response.json();
        return data;
      }
    } catch ( error ) {
      throw new Error( 'Erreur lors de la récupération des niveaux : ' + error.message );
    }
  }
}



const adminService = new AdminService();
export default adminService;