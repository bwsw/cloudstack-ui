interface IFieldMapper {
  [key: string]: string;
}

export abstract class BaseModel {
  protected _mapper: IFieldMapper;

  constructor(params?: {}) {
    if (params) {
      this.parse(params);
    }
  }

  public set(key: string, val: string): void {
    if (!this._mapper || !this._mapper[key]) {
      this[key] = val;
      return;
    }

    this[this._mapper[key]] = val;
  }

  public serialize() {
    const model = {};
    const reverseMap = {};

    if (!this._mapper) {
      return model;
    }

    for (let key in this._mapper) {
      if (this._mapper.hasOwnProperty(key)) {
        reverseMap[this._mapper[key]] = key;
      }
    }

    for (let key in this) {
      if (this.hasOwnProperty(key) && typeof key !== 'function' && !key.startsWith('_')) {
        if (!reverseMap[key]) {
          model[key] = this[key];
          continue;
        }

        model[reverseMap[key]] = this[key];
      }
    }
    return model;
  }

  protected parse(params: {}) {
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        this.set(key, params[key]);
      }
    }
  }
}
