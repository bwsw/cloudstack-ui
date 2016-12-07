interface IMapper {
  [key: string]: string;
}

export abstract class BaseModel {
  protected mapper: IMapper;

  constructor(params?: {}) {
    this.mapper = {};
    if (params) {
      this.parse(params);
    }
  }

  public set(key: string, val: string): void {
    if (!this.mapper[key]) {
      this[key] = val;
      return;
    }

    this[this.mapper[key]] = val;
  }

  public serialize() {
    const model = {};

    const reverseMap = {};
    for (let key in this.mapper) {
      if (this.mapper.hasOwnProperty(key)) {
        reverseMap[this.mapper[key]] = key;
      }
    }

    for (let key in this) {
      if (this.hasOwnProperty(key) && typeof key !== 'function') {
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
