import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertDialogConfiguration } from '../../app/dialog/dialog-service/alert-dialog/alert-dialog.component';

@Injectable()
export class MockDialogService {
  public alert(config: AlertDialogConfiguration): Observable<void> {
    return Observable.of(null);
  }
}
