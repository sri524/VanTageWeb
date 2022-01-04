import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { xml2json } from 'xml-js';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SetupRoutingModule,
    MatDialogModule,
    NgxSliderModule
  ]
})
export class SetupModule { }
