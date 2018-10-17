import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiskOffering } from '../../../../app/shared/models';

const diskOfferings: DiskOffering[] = require('../fixtures/diskOfferings.json');

@Injectable()
export class MockDiskOfferingService {
  public getList(): Observable<DiskOffering[]> {
    return of(diskOfferings);
  }
}
