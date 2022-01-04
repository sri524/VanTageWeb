import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BingRoutingModule } from './bing-routing.module';
import { BingComponent } from './bing.component';


@NgModule({
  declarations: [BingComponent],
  imports: [
    CommonModule,
    BingRoutingModule
  ]
})
export class BingModule { }
