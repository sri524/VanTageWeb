import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DsgComponent } from './dsg.component';

const routes: Routes = [{ path: '', component: DsgComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DsgRoutingModule { }
