export class Color {
  public name: string;
  public value: string;
  public primaryOnly: boolean;

  constructor(name: string, value: string, primaryOnly = false) {
    this.name = name;
    this.value = value;
    this.primaryOnly = primaryOnly;
  }
}
