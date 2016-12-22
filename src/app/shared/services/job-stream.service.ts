import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class JobStreamService extends Subject<any> {}
