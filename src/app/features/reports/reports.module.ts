import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepicker,MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PipesModule } from '../../Core/Pipes/pipes.module';

import { ReportsRoutingModule } from './reports-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatDialogModule,
    NgxPaginationModule,
    DragDropModule,
    MatDatepicker,
    MatDatepickerModule,
    MatInputModule,
   PipesModule
  ],
  exports: [
    MatDialogModule,
  ]
})
export class ReportsModule { }
