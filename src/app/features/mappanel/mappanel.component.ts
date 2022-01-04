import { Apollo, gql } from 'apollo-angular';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter,ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service';
import { EventEmitterService } from '../../Core/Providers/event-emitter-service/event-emitter.service';
import { ReportsComponent } from '../../features/reports/reports.component'
import { SetupComponent } from '../../features/setup/setup.component'
import { GeneralComponent } from '../general/general.component';
import { ZonesComponent } from '../zones/zones.component';

import { MatDatepicker } from '@angular/material/datepicker';
// import { IDayCalendarConfig, DatePickerComponent } from "ng2-date-picker";
import { Options, LabelType } from "@angular-slider/ngx-slider";
import * as moment from 'moment';
// import { tz } from 'moment-timezone';
import { DatePipe } from '@angular/common'
const getMapArea = gql`

query($id: ID!){
  installations(where : {
    id : {
      eq : $id
    }
  })

  {
    id,
    name
    region{
      id
      name
      bounds
     zoomLevel
      zoomPoint
   }
  }
}
`
const getTagDetails = gql`

query($id: ID!){
  installations(where : {
    id : {
      eq : $id
    }
  })

  {
    id,
    name
    region{
      id
      name
      bounds
      zoomLevel
      zoomPoint
   }
 
   timeZone{
    code
    offset
  }
  
   tags{ 
    id 
    name 
    imei 
    vehicleType
    coreState
    {
      isLocked
      seasonState
      externalVoltageType
      externalVoltage
    }
    pace{
      inGame
      holeLabel
      pace
      gameStartTime
      time
      playedHoles   

} 
  } 
 
  }
}
`
const userInstallations = gql`
{ 
  userById(userId:"8B5C9D1A-1AC2-40AD-808A-313E9B97428F") 
  { 
    installations 
    { 
      id 
      name 
    }     
  } 
} 
`

const getZonesDetails = gql`
query($id : ID!)

{ 

  zones(installationId: $id) 

  { 

      id 

      name 

      shape 

      enabled 

  } 

}

`
@Component({
  selector: 'app-mappanel',
  templateUrl: './mappanel.component.html',
  styleUrls: ['./mappanel.component.css']
})
export class MappanelComponent implements OnInit {
 
  showtag: boolean;
  installationsDetails: any;
  installationId: any = 'c14d7722303744d882e5ef18d0248844';
  zones: any = [];
  subscribtion: Subscription;
  result: any = [];
  tagDetails: any;
  ins_id: any;
  StartTime: any;
  EndTime: any;
  date: any;

  TrailDate: any
  Array : any =[]
  constructor(
    private dialog: MatDialog,
    private route: Router,
    private service: ApiServiceService, private readonly _EventEmit: EventEmitterService,
    private apollo: Apollo,
    private cdRef: ChangeDetectorRef,
  ) { }
  @Input() Menushow: string = '';
  @Input() panelmessage: boolean;
  @Input() cartdata: any = [];
  @ViewChild('elementToFocus') _input: ElementRef;
  @Output() StartRange = new EventEmitter<any>();
  @Output() Range = new EventEmitter<any>();
  @Output() Reset = new EventEmitter<any>();
  @Output() VisibilityStatus = new EventEmitter<any>();

  subscription: Subscription;
  trails: boolean;
  alltrails: boolean;
  rstctedzone: boolean = false;
  wrkzone: boolean = false;
  commonzone: boolean = false;
  setupflag: boolean = true;
  Today:boolean=true;
  length: any; flag: boolean = false;


  minValue: number = 0;
  time = [{ val: 0, hour: '00', ampm: 'AM' },
  { val: 1, hour: '01', ampm: 'AM' },

  { val: 2, hour: '02', ampm: 'AM' },
  { val: 3, hour: '03', ampm: 'AM' },
  { val: 4, hour: '04', ampm: 'AM' },
  { val: 5, hour: '05', ampm: 'AM' },
  { val: 6, hour: '06', ampm: 'AM' },
  { val: 7, hour: '07', ampm: 'AM' },
  { val: 8, hour: '08', ampm: 'AM' },
  { val: 9, hour: '09', ampm: 'AM' },
  { val: 10, hour: '10', ampm: 'AM' },
  { val: 11, hour: '11', ampm: 'AM' },
  { val: 12, hour: '12', ampm: 'PM' },
  { val: 13, hour: '13', ampm: 'PM' },
  { val: 14, hour: '14', ampm: 'PM' },

  { val: 15, hour: '15', ampm: 'PM' },
  { val: 16, hour: '16', ampm: 'PM' },
  { val: 17, hour: '17', ampm: 'PM' },
  { val: 18, hour: '18', ampm: 'PM' },
  { val: 19, hour: '19', ampm: 'PM' },
  { val: 20, hour: '20', ampm: 'PM' },
  { val: 21, hour: '21', ampm: 'PM' },
  { val: 22, hour: '22', ampm: 'PM' },
  { val: 23, hour: '23', ampm: 'PM' },
  { val: 24, hour: '24', ampm: 'PM' },
  ]

  maxValue: number = 1440;
  options: Options = {
    floor: 0,
    ceil: 1439,
    translate: (value: number, label: LabelType): string => {
      let hr = Math.floor(value / 60)
      let hour; let status
      this.time.forEach(val => {
        if (val.val == hr) {
          hour = val.hour
          status = val.ampm
        }

      })

      switch (label) {
        case LabelType.Low:
          let min = value % 60 + ':00';

          if (min.length == 4) {
            this.StartTime = hour + ':0' + min;
          }
          else {
            this.StartTime = hour + ':' + min;
          }
          if (this.date != undefined) {
            this.OnDateChange(this.TrailDate)
          }
          return '' + hour + ':' + value % 60 + status;
        case LabelType.High:
          let mins = value % 60 + ':00'
          //  this.EndTime = hour + ':' + mins;
          if (mins.length == 4) {
            this.EndTime = hour + ':0' + mins;
          }
          else {
            this.EndTime = hour + ':' + mins;
          }
          if (this.date != undefined) {
            this.OnDateChange(this.TrailDate)
          }
          return "" + hour + ':' + value % 60 + status;
        default:
          return "";
      }
    }
  };
  
  ngOnInit(): void {

    this.flag = false
    this.service.getlength().subscribe(
      data => {
        this.length = data;
        if (this.length != '' && this.length != 0) {
          this.flag = true
        }
        else {
          this.flag = false
        }
      }
    );
    this.panelmessage = false;
    this.trails = false;
    this.subscription = this.service.getInstallationId().subscribe(data => {
      if (data != '') {
        this.installationId = data;
      }
    });
    this.getUserInstallations();
    this.service.getInsId().subscribe(data => {
      this.ins_id = data;
    })
  }
  ngAfterViewInit(): void {
    var trail: any = [];
    var cart: any = [];
    this.service.GetTrailsRelatedCartData().subscribe(data => {
      trail = data.obj;
      if (trail.length > 0) {
        this.alltrails = true;
        if (trail != '' && cart != '') {
          let comresult = trail.filter(o => cart.some(({ data }) => o.id === data.tags[0].id));
          if (comresult.length > 0) {
            this.trails = true;
            this.alltrails= true;
          }
          else {
            this.trails = false;
            this.alltrails=true;
          }
        }
      }
      else {
        this.alltrails = false;
      }
      if(trail.length>5){
        this.panelmessage=false;
      }
      else{
        this.panelmessage=true
      }
    })
    this.service.getTagData().subscribe(data => {
      cart = data.obj;
      if (cart.length > 0) {
        this.panelmessage = true
        if (trail != '' && cart != '') {
          let comresult = trail.filter(o => cart.some(({ data }) => o.id === data.tags[0].id));
          console.log(comresult)
          if (comresult.length > 0) {
            this.trails = true;
           this.alltrails=true
          }
          else {
            this.trails = false;
            this.alltrails=true;
          }
        }
      }
      else {
        this.trails = false
        this.panelmessage = false
      }
    })
  }
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filteredArray: any = [];
  zonesData: any = []
  changeInstId(instId) {
    this.service.setInstallationId(instId);
    let event = instId;
    this.apollo.use('live').watchQuery({
      query: getMapArea,
      variables: {
        id: event
      }
    })
      .valueChanges.subscribe(({ data, loading }) => {
        if (data['installations'].length == 0) {
          alert(`Selected Course is not available.Please Select another course`)
        }
        else {
          this.result = data['installations'][0];
          this.service.setMapcoordinates({
            obj: this.result
          })
        }
        this.apollo.use('live').watchQuery({
          query: getTagDetails, variables: {
            id: event
          }
        }).valueChanges.subscribe(({ data, loading }) => {
          this.tagDetails = data['installations'][0];
          this.service.setTagDetails({
            obj: this.tagDetails,
          })
        });
        this.service.setInstallationId(event);
      });

    this.apollo.use('live').watchQuery({ query: getZonesDetails, variables: { id: event } }).valueChanges.subscribe(({ data, loading }) => {
      this.zones = data['zones'];
      for (let i = 0; i < this.zones.length; i++) {
        this.filteredArray.push(this.zones[i]);
      }
      this.zonesData = this.filteredArray.filter(t => t.enabled == true);
    });
  }


  OnDateChange(evt) {
    this.Today=false;
    let Timeslot:any=[]
    let StartDate = moment(evt).format("YYYY-MM-DD");
    this.TrailDate = StartDate

    StartDate = StartDate + ' ' + this.StartTime
    this.StartRange.emit(StartDate)

    let EndDate = moment(evt).format("YYYY-MM-DD");
    EndDate = EndDate + ' ' + this.EndTime
    // this.EndRange.emit(EndDate)
    Timeslot[0]=StartDate
    Timeslot[1]=EndDate
    this.Range.emit(Timeslot)

    let sdate = new Date(StartDate)
    let edate = new Date(EndDate)
    if (sdate <= new Date() && edate >= new Date()) {
      this.Reset.emit('Yes')
    }
    else {
      this.Reset.emit('No')
    }
  }
  showTagsMenu() {
    this._EventEmit.onLeftPanelTagsClick();
  }

  getUserInstallations() {
    this.service.getUserInstallations().subscribe(data => { this.installationsDetails = data.obj })

  }

  restricted() {
    //console.log(this.ins_id);
    this.service.insIdSet({ id: this.ins_id, value: 1 })

  }

  workZones() {
    this.service.insIdSet({ id: this.ins_id, value: 2 })
  }
  showtags() {
    this.showtag = !this.showtag;
  }


  select(value) {
    //console.log(value);

    this.service.selectMouse(value);
  }
  onClick(value) {
    //console.log(value);
    this.service.setMapName(value);
  }

  ShowHideTrails(val) {
    if (val == 'S') {
      this.trails = true;
      this.alltrails = true;
      console.log('s')
      let status=[...'1']
      this.VisibilityStatus.emit(status)
    }
    else {
      if (val == 'H') {
        this.trails = false;
        this.alltrails=false;
        let status=[...'2']
        this.VisibilityStatus.emit(status)
      }
      else {
        this.alltrails = false;
        this.trails = false;
        let status=[...'0']
        this.VisibilityStatus.emit(status)
      }
    }
  }
  ZonesShowHide(val) {
    if (val == 'R') {
      this.service.insIdSet({ id: this.ins_id, value: 1 })
      this.rstctedzone = !this.rstctedzone
    }
    else {
      this.service.insIdSet({ id: this.ins_id, value: 2 })
      this.wrkzone = !this.wrkzone

    }
    if (this.wrkzone == true || this.rstctedzone == true) {
      this.commonzone = true;
    }
    else {
      this.commonzone = false;
    }
  }
  Reports(ref) {
    if (ref == 'II' || ref == 'I') {
      this.dialog.open(ReportsComponent, {
        width: 'auto',
        height: 'auto',
        data: ref

      });
    }

    else {
      this.dialog.open(ReportsComponent, {
        width: '50vw',
        height: 'auto',
        data: ref

      });
    }

  }
  setUpBattery(ref) {
    this.dialog.open(SetupComponent, {
      width: 'auto',
      height: 'auto',
      data: ref
    });
  }


  Setup(ref) {
    if (ref == 'C' || ref == "P" || ref == 'PC') {
      this.setupflag = false;
    }
    else {
      this.setupflag = true;
    }
    if(ref == 'PC')
    this.service.setpaceclose({ 'Open': 'open' });
    this.dialog.open(SetupComponent, {
      width: 'auto',
      height: 'auto',
      //  data: ref
      data: { cartdetails: this.cartdata, variable: ref }
    });

    this.dialog.afterAllClosed.subscribe(res => {
      this.setupflag = true;
    })
  }
  _openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    setTimeout(() => this._input.nativeElement.focus());
  }


  _closeCalendar(e) {
    setTimeout(() => this._input.nativeElement.blur());
  }

  eventCloseHandler(e) {
    setTimeout(() => this._input.nativeElement.blur());
  }
  general(REF) {
    this.dialog.open(GeneralComponent,
      { width: 'auto', height: 'auto', data: REF });
  }
  zoness(ref) {
    this.dialog.open(ZonesComponent,
      { width: 'auto', height: 'auto', data: ref });
  }

  activeIdleTags(event: any, isChecked: boolean) 
  {
    if (isChecked) {
      this.Array.push(event.target.value)
    }
    else {
      let index = this.Array.indexOf(event.target.value);
      this.Array.splice(index, 1);
    }
  this.service.setShowTagsCheck({data:this.Array,value:1});
  }



}



function UsagepopuComponent(UsagepopuComponent: any, arg1: { width: string; height: string; }) {
  throw new Error('Function not implemented.');
}

function vehicleUsage() {
  throw new Error('Function not implemented.');
}