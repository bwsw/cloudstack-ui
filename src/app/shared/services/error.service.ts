import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export class ErrorService {

  public errorObservable: Subject<any>;

  constructor() {
    this.errorObservable = new Subject<any>();
  }

  public emitError(error: any): void {
    this.errorObservable.next(error);
  }
}
