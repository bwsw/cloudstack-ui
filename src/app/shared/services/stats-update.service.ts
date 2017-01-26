import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class StatsUpdateService extends Subject<any> {}
