import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SSHKeyPair } from '../../../../app/shared/models';

const sshKeyPairs: SSHKeyPair[] = require('../fixtures/sshKeyPairs.json');

@Injectable()
export class MockSSHKeyPairService {
  public getList(): Observable<SSHKeyPair[]> {
    return of(sshKeyPairs);
  }
}
