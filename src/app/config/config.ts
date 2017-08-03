export class Config {
  public config: any;

  public parse(json?: any) {
    this.config = JSON.parse(json);
  }
}

export const CONFIG = new Config();
