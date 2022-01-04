import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import{MatDialogModule} from '@angular/material/dialog'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GeneralRoutingModule,MatDialogModule
  ]
})
export class GeneralModule { }
