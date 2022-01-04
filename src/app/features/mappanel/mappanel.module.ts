import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappanelRoutingModule } from './mappanel-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import {ReportsComponent} from '../../features/reports/reports.component'
import {SetupComponent} from '../../features/setup/setup.component'

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    MappanelRoutingModule,
    MatTabsModule,
    MatDialogModule,
    SetupComponent
  ]
})
export class MappanelModule { }
