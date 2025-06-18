import { getToken, getLanguage } from "../utils/function";
import { makeAutoObservable } from 'mobx';

const API_URL =  import.meta.env.API_BASE_URL || 'http://localhost:8000/api';

class AdminService {
  constructor() {
    makeAutoObservable( this );
  }
  
  // Permet de récupérer un tableau avec tous les utilisateurs
  async getUsers () {
    const token = getToken();

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
      console.error( 'Erreur lors de la récupération des utilisateurs :', error );
    }
  }

  // Permet de récupérer un tableau avec toutes les cartes selon la langue de l'administrateur
  async getCards () {
    const token = getToken();
    const language = getLanguage();

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

  // Permet de supprimer un utilisateur
  async deleteUser ( userId ) {
    const token = getToken();

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

  // Permet d'ajouter une carte
  async createCard ( cardData ) {
    const token = getToken();

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
    } catch ( error ) {
      console.error( 'Erreur lors de la création de la carte :', error );
      return { success: false, error: 'Une erreur est survenue lors de la création' };
    }
  }
}



const adminService = new AdminService();
export default adminService;