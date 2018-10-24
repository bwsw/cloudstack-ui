export class Color {
  public primaryOnly?: boolean;

  constructor(public name = '', public value = '', public textColor = '#FFFFFF') {
    this.primaryOnly = false;
  }
}
