export class Color {
  public primaryOnly?: boolean;

  constructor(
    public name = '',
    public value: string,
    public textColor = '#FFFFFF'
  ) {
    this.primaryOnly = false;
  }
}
