export class Config {
  public config: any;

  constructor(json?: any) {
    this.config = JSON.parse(json);
  }
}
