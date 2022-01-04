import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FeaturesModule } from "./features/features.module";
import { LoginComponent } from "../app/Authentication/login/login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { GraphQLModule } from "./graphql.module";
import { HttpClientModule } from "@angular/common/http";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { FeaturesComponent } from './course/features/features.component';
//import { PopupComponent } from './shared/popup/popup.component'

// import { HeaderComponent } from './Layout/header/header.component';
//import { LeftPanelComponent } from './Layout/left-panel/left-panel.component';

// import {MaterialExampleModule} from '../material.module';
import { MatNativeDateModule } from "@angular/material/core";
//import { MatDatepicker } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";

// import { DpDatePickerModule } from "ng2-date-picker";

import { MatInputModule } from "@angular/material/input";
// import { NgxSliderModule } from '@angular-slider/ngx-slider';
//import { PopupComponent } from './shared/popup/popup.component'
import { DatePipe } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    // FeaturesComponent,
    //PopupComponent,
    //HeaderComponent,
    // LeftPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FeaturesModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    MatDialogModule,
    MatTabsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,

    // NgxSliderModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  exports: [MatDialogModule, MatTabsModule],
})
export class AppModule {}
