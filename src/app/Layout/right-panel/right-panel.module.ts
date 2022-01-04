import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
//import { MatDatepicker } from '@angular/material/core';
import {MatDatepicker,MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';

import { MatMomentDateModule } from "@angular/material-moment-adapter";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatDatepicker,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule

  ]
})
export class RightPanelModule { }
