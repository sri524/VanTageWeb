import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OsmComponent } from './osm.component';

const routes: Routes = [{ path: '', component: OsmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OsmRoutingModule { }
