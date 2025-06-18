const TOKEN_KEY = 'jwt_token';
const LANGUAGE_KEY = 'language';

// Méthode pour obtenir le token JWT
function getToken () {
  return localStorage.getItem( TOKEN_KEY );
}

// Méthode pour obtenir la langue
function getLanguage () {
  return localStorage.getItem( LANGUAGE_KEY ) || 'fr';
}

export { getLanguage, getToken };