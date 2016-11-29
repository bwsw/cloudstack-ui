import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

  constructor() {}

  public alert(message: string): void {
    alert(message);
  }
}
