import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SSHKeyPair } from '../../../../app/shared/models';


const sshKeyPairs: Array<Object> = require('../fixtures/sshKeyPairs.json');

@Injectable()
export class MockSSHKeyPairService {
  public getList(): Observable<Array<SSHKeyPair>> {
    return Observable.of(sshKeyPairs.map(json => new SSHKeyPair(json)));
  }
}
