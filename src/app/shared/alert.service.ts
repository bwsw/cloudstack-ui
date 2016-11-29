import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

  public alert(message: string): void {
    alert(message);
  }
}
