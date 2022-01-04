import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsgRoutingModule } from './dsg-routing.module';
import { DsgComponent } from './dsg.component';
import { DatePipe } from '@angular/common'
// import{LoaderModule} from '../../../Shared/loader/loader.module'

@NgModule({
  declarations: [DsgComponent],
  imports: [
    CommonModule,
    DsgRoutingModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers : [DatePipe]
})
export class DsgModule { }
