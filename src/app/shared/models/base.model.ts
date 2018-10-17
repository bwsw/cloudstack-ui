export interface BaseModelInterface {
  id?: string;
}

export abstract class BaseModel implements BaseModelInterface {
  public id: string;
  protected mapper: { [key: string]: string };

  constructor(params?: {}) {
    if (params) {
      this.parse(params);
    }
  }

  public set(key: string, val: string): void {
    if (!this.mapper || !this.mapper[key]) {
      this[key] = val;
      return;
    }

    this[this.mapper[key]] = val;
  }

  public serialize(): any {
    const model: any = {};
    const reverseMap: any = {};

    if (!this.mapper) {
      return model;
    }

    for (const key in this.mapper) {
      if (this.mapper.hasOwnProperty(key)) {
        reverseMap[this.mapper[key]] = key;
      }
    }

    for (const key in this) {
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

  public get keys(): string[] {
    return Object.keys(this).filter((key: string) => !key.startsWith('_'));
  }

  protected parse(params: {}): void {
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        this.set(key, params[key]);
      }
    }
  }
}

export class BaseModelStub extends BaseModel {}
