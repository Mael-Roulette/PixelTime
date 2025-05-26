export default class GameMode {
  _id;
  _name;
  _description;
  _image;
  _nbLives;
  _timePerCard;
  _multiplicator;

  constructor ( { id, name, description, image, nbLives = -1, timePerCard = -1, multiplicator = 1 } ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._image = image;
    this._nbLives = nbLives;
    this._timePerCard = timePerCard;
    this._multiplicator = multiplicator;
  }

  get id () {
    return this._id;
  }

  get name () {
    return this._name;
  }

  set name ( value ) {
    if ( typeof value !== "string" || value.trim().length < 0 ) {
      throw new Error( `Titre invalide : ${ value }` );
    }

    this._name = value.trim();
  }

  get description () {
    return this._description;
  }

  set description ( value ) {
    if ( typeof value !== "string" || value.trim().length < 0 ) {
      throw new Error( `Description invalide : ${ value }` );
    }

    this._description = value.trim();
  }

  get image () {
    return this._image;
  }

  set image ( value ) {
    if ( typeof value !== "string" || value.trim().length < 0 ) {
      throw new Error( `Image invalide : ${ value }` );
    }

    this._image = value.trim();
  }

  get nbLives () {
    return this._nbLives;
  }

  set nbLives ( value ) {
    if ( typeof value !== "number" || value < 0 ) {
      throw new Error( `Nombre de vies invalide : ${ value }` );
    }

    this._nbLives = value;
  }

  get timePerCard () {
    return this._timePerCard;
  }

  set timePerCard ( value ) {
    if ( typeof value !== "number" || value < 0 ) {
      throw new Error( `Temps par carte invalide : ${ value }` );
    }

    this._timePerCard = value;
  }

  get multiplicator () {
    return this._multiplicator;
  }

  set multiplicator ( value ) {
    if ( typeof value !== "number" || value <= 0 ) {
      throw new Error( `Multiplicateur invalide : ${ value }` );
    }

    this._multiplicator = value;
  }
}