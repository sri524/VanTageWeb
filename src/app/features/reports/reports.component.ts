import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Apollo, gql } from 'apollo-angular';
import { averagepacereport } from '../../Models/AveragePaceReport';
import { vehicleusgaereport } from '../../Models/VehicleUsgaeReport';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SafeReadonly } from '@apollo/client/cache/core/types/common';
import { ApiServiceService } from 'src/app/Core/Providers/api-service/api-service.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  GraphQLService,
  AveragePaceReport_Query,
  VehicleUsgaeReport_Query,
} from '../../Core/Providers/graphQL/graph-ql.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { jitOnlyGuardedExpression } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  averagePaceReport: averagepacereport[] = [];
  avgPaceReportForm: FormGroup;
  vechileUsageReportForm: FormGroup;
  subscription: Subscription;
  avgPaceSubscription: Subscription;
  startDate: any = new Date();
  installationId: any;
  endDate: any = new Date();
  myDate: any = new Date();
  courseName: string;
  totalPace: any = 0;
  totalAvgPace: any = 0;
  avgPacehours: any;
  avgPaceminutes: any;
  trgPacehours: any;
  trgPaceminutes: any;

  // VehicleUsage Varaiables
  vehicleUsageReport: vehicleusgaereport[] = [];
  installationName: string;
  vehicleCart: vehicleusgaereport[] = [];
  vehicleFood: vehicleusgaereport[] = [];
  vehicleMarshal: vehicleusgaereport[] = [];
  vehicleUtility: vehicleusgaereport[] = [];
  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ReportsComponent>,
    @Inject(MAT_DIALOG_DATA) public RefVariable: any,
    private apollo: Apollo,
    private service: ApiServiceService,
    private datePipe: DatePipe,
    private graphQLServive: GraphQLService
  ) {
    this.myDate = this.datePipe.transform(this.myDate, 'full');
  }

  dropdown: boolean;

  ngOnInit(): void {
    console.log(this.RefVariable);
    this.avgPaceReportForm = new FormGroup({
      startDate: new FormControl('2020-09-28'),
      endDate: new FormControl('2020-12-28'),
    });

    this.vechileUsageReportForm = new FormGroup({
      startDateVR: new FormControl('2021-12-28'),
      endDateVR: new FormControl('2021-12-29'),
    });
    this.subscription = this.service.getInstallationId().subscribe((data) => {
      if (data != '') {
        this.installationId = data;
      }
    });

    // this.getAveragePaceReport();
  }
  close() {
    this.dialog.closeAll();
  }

  savedd() {
    this.dropdown = !this.dropdown;
  }

  get f() {
    return this.avgPaceReportForm.controls;
  }
  get fVR() {
    return this.vechileUsageReportForm.controls;
  }

  //Get AveragePaceReport
  getAveragePaceReport() {
    this.avgPacehours=0;
    this.avgPaceminutes=0;
    this.trgPacehours=0;
    this.trgPaceminutes=0;
    this.totalPace=0;
    this.totalAvgPace=0;
    this.startDate =
      this.datePipe.transform(this.f.startDate.value, 'yyyy-MM-dd') +
      'T00:00:00.0000Z';
    this.endDate =
      this.datePipe.transform(this.f.endDate.value, 'yyyy-MM-dd') +
      'T00:00:00.0000Z';
    this.apollo
      .use('live')
      .watchQuery<any>({
        query: AveragePaceReport_Query,
        variables: {
          installationId: this.installationId,
          start: this.startDate,
          end: this.startDate,
        },
      })
      .valueChanges.subscribe(({ data }) => {
        this.averagePaceReport = data.averagePace;
        //this.courseName = this.averagePaceReport[0].courseName;
        console.log('AveragePaceReport', this.averagePaceReport);

        for (var i = 0; i < this.averagePaceReport.length; i++) {
          this.totalAvgPace =
            this.totalAvgPace + this.averagePaceReport[i].averagePace;
          this.totalPace =
            this.totalPace + this.averagePaceReport[i].targetPace;
        }
        this.avgPacehours = Math.floor(this.totalAvgPace / 60);
        this.avgPaceminutes = this.totalAvgPace - this.avgPacehours * 60;
        this.trgPacehours = Math.floor(this.totalPace / 60);
        this.trgPaceminutes = this.totalPace - this.trgPacehours * 60;
      });
  }

  getVehicleUsageReport() {
    let j: number = 0;
    let k: number = 0;
    let l: number = 0;
    let m: number = 0;
    this.vehicleCart=[];
    this.vehicleUsageReport=[];

    this.startDate =
      this.datePipe.transform(this.fVR.startDateVR.value, 'yyyy-MM-dd') +
      'T00:00:00.0000Z';
    this.endDate =
      this.datePipe.transform(this.fVR.endDateVR.value, 'yyyy-MM-dd') +
      'T23:59:00.0000Z';
    this.apollo
      .use('live')
      .query<any>({
        query: VehicleUsgaeReport_Query,
        variables: {
          installationId:this.installationId,
          start: this.startDate,
          end: this.endDate,
          fetchPolicy: 'network-only',
        },
      })
      .subscribe(({ data }) => {
        this.vehicleUsageReport = data.vehicleUsageReport;
        console.log(this.vehicleUsageReport);
        this.installationName = this.vehicleUsageReport[0].installationName;

        for (var i = 0; i < this.vehicleUsageReport.length; i++) {
          if (this.vehicleUsageReport[i].vehicleType == 'Cart') {
            this.vehicleCart[j] = this.vehicleUsageReport[i];
            j = j + 1;
          } else if (this.vehicleUsageReport[i].vehicleType == 'Food cart') {
            this.vehicleFood[k] = this.vehicleUsageReport[i];
            k++;
          } else if (this.vehicleUsageReport[i].vehicleType == 'Marshal') {
            this.vehicleMarshal[l] = this.vehicleUsageReport[i];
            l++;
          } else {
            this.vehicleUtility[m] = this.vehicleUsageReport[i];
            m++;
          }
        }

// console.log(this.vehicleCart);
// console.log(this.vehicleFood);
// console.log(this.vehicleMarshal);
// console.log(this.vehicleUtility);
      });

  }

  onChange(e) {
    this.getAveragePaceReport();
  }
  onChangeV(e) {
    this.getVehicleUsageReport();
  }

  ngAfterViewInit() {}
}
