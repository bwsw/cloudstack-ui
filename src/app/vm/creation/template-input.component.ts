import { Component } from '@angular/core';

@Component({
  selector: 'cs-template-input',
  template: `
  <mdl-select floating-label [(ngModel)]="otherCountryCode" placeholder="Country">
    <optgroup label="Test">
      <mdl-option *ngFor="let c of countries" [value]="c.code">{{c.name}}</mdl-option>
      <option [value]="5">Test</option>
    </optgroup>
  </mdl-select>
  `
})
export class TemplateInputComponent {
  private otherCountryCode: number;
  private countries = new Array<Country>();

  constructor() {
    this.countries.push(new Country(1, 'Russia'));
    this.countries.push(new Country(2, 'Kazakhstan'));
    this.countries.push(new Country(3, 'USA'));
    this.countries.push(new Country(4, 'France'));
  }

}

class Country {
  code: number;
  name: string;

  constructor(code: number, name: string) {
    this.code = code;
    this.name = name;
  }
}
