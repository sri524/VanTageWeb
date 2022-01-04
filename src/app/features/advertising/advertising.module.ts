import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvertisingRoutingModule } from './advertising-routing.module';
import{MatDialogModule} from '@angular/material/dialog'
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdvertisingRoutingModule,MatDialogModule,MatTabsModule
  ]
})
export class AdvertisingModule { }
