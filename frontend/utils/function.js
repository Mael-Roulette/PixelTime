const TOKEN_KEY = 'jwt_token';
const LANGUAGE_KEY = 'language';
const USER_KEY = 'user';

/**
 * Permet d'obtenir le token JWT stocké dans le localStorage
 * @returns Retourne le token JWT stocké dans le localStorage
 */
function getToken () {
  return localStorage.getItem( TOKEN_KEY );
}

/**
 * PErmet de récupérer la langue stocker dans le localStorage
 * @returns Retourne la langue stocker dans le localStorage, ou 'fr' par défaut si aucune langue n'est définie
 */
function getLanguage () {
  return localStorage.getItem( LANGUAGE_KEY ) || 'fr';
}

export { getLanguage, getToken, TOKEN_KEY, LANGUAGE_KEY, USER_KEY };