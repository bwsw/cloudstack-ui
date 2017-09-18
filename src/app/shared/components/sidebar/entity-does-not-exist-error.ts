export class EntityDoesNotExistError extends Error {
  constructor(m = '') {
    super(m);
    Object.setPrototypeOf(this, EntityDoesNotExistError.prototype);
  }
}
