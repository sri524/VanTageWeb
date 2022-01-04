import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { DashboardComponent } from '../dashboard/dashboard.component';
import {FeaturesModule}  from '../features.module';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FeaturesModule
  ]
})
export class DashboardModule { }
