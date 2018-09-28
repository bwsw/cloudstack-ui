import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiskOffering } from '../../../../app/shared/models';

const diskOfferings: Array<DiskOffering> = require('../fixtures/diskOfferings.json');

@Injectable()
export class MockDiskOfferingService {
  public getList(): Observable<Array<DiskOffering>> {
    return of(diskOfferings);
  }
}
