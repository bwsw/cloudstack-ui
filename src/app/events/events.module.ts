import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlSelectModule } from '@angular2-mdl-ext/select';
import { MdlModule } from 'angular2-mdl';
import { TranslateModule } from 'ng2-translate';

import { EventListComponent } from './event-list.component';
import { SharedModule } from '../shared/shared.module';
import { EventService } from './event.service';

@NgModule({
  imports: [
    CommonModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [EventListComponent],
  providers: [EventService]
})
export class EventsModule { }
