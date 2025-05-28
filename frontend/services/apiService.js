import authService from './authService';

const apiService = {
  request ( url, options = {} ) {
    const token = authService.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...( token && { 'Authorization': `Bearer ${ token }` } ),
        ...options.headers
      }
    };

    return fetch( url, config )
      .then( response => {
        if ( response.status === 401 ) {
          authService.logout();
          window.location.href = '/login';
        }
        return response;
      } );
  }
};