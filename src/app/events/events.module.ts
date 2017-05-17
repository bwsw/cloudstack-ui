import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlModule } from '@angular-mdl/core';
import { TranslateModule } from '@ngx-translate/core';

import { EventListComponent } from './event-list.component';
import { SharedModule } from '../shared/shared.module';
import { EventService } from './event.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdlModule,
    MdlSelectModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [EventListComponent],
  providers: [EventService]
})
export class EventsModule { }
