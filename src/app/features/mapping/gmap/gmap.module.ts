import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GmapRoutingModule } from './gmap-routing.module';
import { GmapComponent } from './gmap.component';


@NgModule({
  declarations: [GmapComponent],
  imports: [
    CommonModule,
    GmapRoutingModule
  ]
})
export class GmapModule { }
