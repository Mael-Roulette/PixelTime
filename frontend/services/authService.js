class AuthService {
  // Méthode de connexion
  login ( email, password ) {
    return fetch( '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { email, password } )
    } )
      .then( response => {
        return response.json().then( data => ( { response, data } ) );
      } )
      .then( ( { response, data } ) => {
        if ( response.ok ) {
          localStorage.setItem( 'user', JSON.stringify( data.user ) );
          return data;
        } else {
          throw new Error( data.error || 'Erreur lors de la connexion' );
        }
      } );
  }

  register ( userData ) {
    return fetch( '/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( userData )
    } )
      .then( response => {
        return response.json().then( data => ( { response, data } ) );
      } )
      .then( ( { response, data } ) => {
        if ( response.ok ) {
          return data;
        } else {
          throw new Error( data.error || 'Erreur lors de l\'inscription' );
        }
      } );
  }

  logout () {
    localStorage.removeItem( 'user' );
  }

  getCurrentUser () {
    return JSON.parse( localStorage.getItem( 'user' ) );
  }
}

export default new AuthService();