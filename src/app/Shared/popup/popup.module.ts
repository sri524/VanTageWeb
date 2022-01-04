import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatNativeDateModule} from '@angular/material/core';
//import { MatDatepicker } from '@angular/material/core';
import {MatDatepicker,MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxSliderModule,
    MatNativeDateModule,
    MatDatepicker,MatDatepickerModule,MatInputModule
  ]
})
export class PopupModule { }
