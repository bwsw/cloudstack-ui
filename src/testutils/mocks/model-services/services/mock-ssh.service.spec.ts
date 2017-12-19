import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SSHKeyPair } from '../../../../app/shared/models';


const sshKeyPairs: Array<SSHKeyPair> = require('../fixtures/sshKeyPairs.json');

@Injectable()
export class MockSSHKeyPairService {
  public getList(): Observable<Array<SSHKeyPair>> {
    return Observable.of(sshKeyPairs);
  }
}
