import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features-routing.module';
import { HeaderComponent } from '../Layout/header/header.component';
import { LeftPanelComponent } from '../Layout/left-panel/left-panel.component';
import { MappanelComponent } from './mappanel/mappanel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MappingComponent } from './mapping/mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RightPanelComponent } from '../Layout/right-panel/right-panel.component';
import { GeneralComponent } from './general/general.component';
import { ZonesComponent } from './zones/zones.component';
import { PopupComponent } from '../Shared/popup/popup.component';
import { SetupComponent } from './setup/setup.component';
import { ReportsComponent } from './reports/reports.component';
import { AdvertisingComponent } from './advertising/advertising.component';
import { AddeventComponent } from '../Shared/addevent/addevent.component';
import { BingComponent } from '../features/mapping/bing/bing.component';
import { DsgComponent } from '../features/mapping/dsg/dsg.component';
import { GmapComponent } from '../features/mapping/gmap/gmap.component';
import { OsmComponent } from '../features/mapping/osm/osm.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
// import { DpDatePickerModule } from "ng2-date-picker";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderByPipe } from '../Core/Pipes/order-by.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { DatedifferencePipe } from '../core/pipes/datedifference.pipe';
import { PipesModule} from '../Core/Pipes/pipes.module'


@NgModule({
  declarations: [
    HeaderComponent,
    LeftPanelComponent,
    MappanelComponent,
    MappingComponent,
    RightPanelComponent,
    GeneralComponent,
    ZonesComponent,
    ReportsComponent,
    SetupComponent,
    AdvertisingComponent,
    AddeventComponent,
    BingComponent,
    DsgComponent,
    GmapComponent,
    OsmComponent,
    PopupComponent,
    OrderByPipe,
    DatedifferencePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeaturesRoutingModule,
    MatTabsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    // DpDatePickerModule,
    NgxSliderModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    PipesModule
  ],
  providers: [DatePipe],
  exports: [HeaderComponent, LeftPanelComponent, AddeventComponent],
  //entryComponents :[PopupComponent,ZonesComponent,GeneralComponent]
})
export class FeaturesModule {}
