import { NgModule } from '@angular/core';

import { EventListComponent } from './event-list.component';
import { CommonModule } from '@angular/common';
import { MdlModule } from 'angular2-mdl';
import { SharedModule } from '../shared/shared.module';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { EventService } from './event.service';

@NgModule({
  imports: [
    CommonModule,
    MdlModule,
    MdlSelectModule,
    SharedModule
  ],
  declarations: [EventListComponent],
  providers: [EventService]
})
export class EventsModule { }
