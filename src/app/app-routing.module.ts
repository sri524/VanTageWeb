import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './Authentication/login/login.component'

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) },
  
 { path: 'fleet', loadChildren: () => import('./features/fleet/fleet.module').then(m => m.FleetModule) },
  { path: 'general', loadChildren: () => import('./features/general/general.module').then(m => m.GeneralModule) },
  { path: 'zones', loadChildren: () => import('./features/zones/zones.module').then(m => m.ZonesModule) },
 
  { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'setup', loadChildren: () => import('./features/setup/setup.module').then(m => m.SetupModule) },
  { path: 'advertising', loadChildren: () => import('./features/advertising/advertising.module').then(m => m.AdvertisingModule) },
  // { path: 'loader', loadChildren: () => import('./Shared/loader/loader.module').then(m => m.LoaderModule) },
  // { path: 'bing', loadChildren: () => import('./features/mapping/bing/bing.module').then(m => m.BingModule) },
  // { path: 'dsg', loadChildren: () => import('./features/mapping/dsg/dsg.module').then(m => m.DsgModule) },
  // { path: 'gmap', loadChildren: () => import('./features/mapping/gmap/gmap.module').then(m => m.GmapModule) },
  // { path: 'osm', loadChildren: () => import('./features/mapping/osm/osm.module').then(m => m.OsmModule) },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
