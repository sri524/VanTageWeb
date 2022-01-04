import { Component, OnInit, Output, EventEmitter,HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../Shared/popup/popup.component';
import{ApiServiceService} from '../../Core/Providers/api-service/api-service.service'
import { EventEmitterService } from '../../Core/Providers/event-emitter-service/event-emitter.service';
import { gql, Apollo } from 'apollo-angular';
import { DataSource } from '@angular/cdk/collections';
import { LoneSchemaDefinitionRule } from 'graphql';


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
   tags{ 
    id 
    name 
    imei 
    vehicleType
    coreState
    {
      isLocked
      seasonState
    }
  }   
  }
}
`
const tagPosition =gql`
query($id:ID!) 
{ 
tags(where:{ 
id:{ 
eq:$id 
} 
}) 
{ 
id 
name 
location 
{ 
 position 
time 
}     
} 
} 
`

 const tagBatteryLevel = gql`

query($id:ID!)
{
  installationBatteryLimit(installationId:$id)
  {
     installationId
      max12V
      min12V
      max24V
      min24V
      max36V
      min36V
      max48V
      min48V
  }
 }`

 const Courses = gql`



query($id:ID!)

{

 courses(installationId:$id)

{

id

name    

}

}

`

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {
  style: any;
  opencht:boolean;
  avgpace: boolean =true;
  chatbx: boolean;
  lftPanel:boolean =true;
  properties: boolean;
  instalationTagDetails: any =[];
  cartInfo: any = [];
  cartType: any = '';
 flag: any = 'p';
  tagId: any;
  carts: any = [];
  players:number;
  services:number;
  utility:number;
  offseason:number;
  @Output() msgToHeader = new EventEmitter<any>();
  @Output() cartdata = new EventEmitter<any>();
  hello: any =[];
  Array: string[] = [];
  Arraynames: string[] = [];
  isfrmChecked:any;
  length:any=[]
  arrayid:any[]=[];
  idarray:any[]=[];
  playerDetails : boolean = true;
  serviceDetails : boolean = false;
  bindPlayerDetails : boolean = true;
  bindServiceDetails : boolean = false;
  offSeasonDetails : boolean =false;
  bindoffseasonDetails : boolean = false;
  courseInstallationId : any;
  loader : boolean=false;
  tagDetails: any[];
  batteryVoltage : any =[]
  TrailsCartData: any;
  courses:any=[];
  positivecount:any =[];
  negativecount:any=[];
 
  courseNames:any=[];
  levelofbattery : any;
  ShowHideData:any;
  currentId: any;

  width = 284;
  x = 100;
  oldX = 0;
  grabber = false;
  constructor(private dialog : MatDialog,private service : ApiServiceService,private readonly _EventEmit: EventEmitterService,private apollo: Apollo,) { }


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    this.resizer(event.clientX - this.oldX);
    this.oldX = event.clientX;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  resizer(offsetX: number) {
    this.width += offsetX;
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.grabber = true;
    this.oldX = event.clientX;
  }


  ngOnInit(): void {
 
    this.service.getInsId().subscribe(data=>{
console.log(data);
this.currentId = ""
      this.courseInstallationId = data;
      this.apollo.use('live').watchQuery({query : tagBatteryLevel, variables : {id : data}}).valueChanges.subscribe(data=>{
        ////console.log(data);
        this.levelofbattery = data['data']['installationBatteryLimit']
        ////console.log(this.levelofbattery);
        if(this.levelofbattery.length == 0)
        { }
        else
        {
        this.batteryVoltage = data['data']['installationBatteryLimit'][0]
        ////console.log(this.batteryVoltage);
        }
      })
      this.apollo.use('live').watchQuery({query : Courses, variables : {id : this.courseInstallationId}}).valueChanges.subscribe(data=>{
      this.courses=data;
      this.courseNames=this.courses.data.courses;
    })
    })

    this.service.getempty().subscribe(data => {
      if(data == "emptyarray"){
        this.idarray=[];
        this.length=[];
        this.Array=[];
        this.Arraynames=[];
    this.sendlength(this.length)
      }
      })  
this.gettagdetails();
    if(this._EventEmit.subsVar == undefined){
      this._EventEmit.subsVar = this._EventEmit.showTagsMenu.subscribe(() => {
        this.openLftPanel();
      })
    }
    this.leftFalse();
    setTimeout(() => { this.cartData() }, 4000);
  }

  ngAfterViewInit() {
    this.service.GetTrailsRelatedCartData().subscribe(data => {
      this.TrailsCartData = data;
    })
    this.service.GetHideShowData().subscribe(data => {
      this.ShowHideData = data;
      console.log(this.carts)
      console.log(this.TrailsCartData);
      if (this.ShowHideData.obj != '') {
        var traillen = this.TrailsCartData.obj.length 
        if(traillen>0){
          var diffresult = this.carts.filter(o => !this.TrailsCartData.obj.some(({ id }) => o.id == id));         
          console.log(diffresult)  
        }
        var dummy = [];
        dummy = JSON.parse(JSON.stringify(this.cartInfo));
        var showcheckedcolor: any = []
        if (this.ShowHideData.obj == 'H') {
          for (var i = 0; i < dummy.length; i++) {
            dummy[i].data.showhide = this.ShowHideData.obj
            for (var j = 0; j < this.carts.length; j++) {
              if (dummy[i].data.id == this.carts[j].id) {
                dummy[i].data.checked = true
                dummy[i].data.color=''
                dummy[i].data.flag=0
              }
            }
            for (var k = 0; k < this.TrailsCartData.obj.length; k++) {
              if (dummy[i].data.id == this.TrailsCartData.obj[k].id) {
                console.log(this.TrailsCartData.obj)
                dummy[i].data.color = ''
                dummy[i].data.flag = 0
              }
            }
          }
          this.TrailsCartData.obj = ''
          this.cartInfo = dummy
          console.log(this.cartInfo)
          let res=this.cartInfo.filter(e=>e.data.flag==1) 
          res.forEach(e=>{showcheckedcolor.push(e.data)}) 
           console.log(showcheckedcolor)
           this.service.SetTrailsRelatedCartData({
            obj: showcheckedcolor,
          })
        }
        if (this.ShowHideData.obj == 'HO') {
          for (var i = 0; i < dummy.length; i++) {
            dummy[i].data.showhide = this.ShowHideData.obj
            for (var j = 0; j < this.carts.length; j++) {
              if (dummy[i].data.id == this.carts[j].id) {
                dummy[i].data.checked = true
                dummy[i].data.color = ''
                dummy[i].data.flag = 0
              }
            }
          }
          this.cartInfo = dummy
          console.log(this.cartInfo)
          let res=this.cartInfo.filter(e=>e.data.flag==1) 
          res.forEach(e=>{showcheckedcolor.push(e.data)}) 
           console.log(showcheckedcolor)
           this.service.SetTrailsRelatedCartData({
            obj: showcheckedcolor,
          })
        }
        if (this.ShowHideData.obj == 'S') {
           
          console.log(this.TrailsCartData)
          for (var i = 0; i < dummy.length; i++) {
            dummy[i].data.showhide = this.ShowHideData.obj

            if(traillen>0){
             
              for (var k = 0; k < this.TrailsCartData.obj.length; k++) {
                if (dummy[i].data.id == this.TrailsCartData.obj[k].id) {
                  dummy[i].data.color = k
                  dummy[i].data.flag = 1
                }
              }
              for (var j = 0; j < diffresult.length; j++) {              
                if (dummy[i].data.id == diffresult[j].id) {
                  console.log(diffresult)
                  dummy[i].data.checked = true;
                  dummy[i].data.color = traillen
                  dummy[i].data.flag = 1
                  traillen++
                }
              }
            }
          if(traillen==0){
            for (var j = 0; j < this.carts.length; j++) {              
              console.log(traillen)
            if (dummy[i].data.id == this.carts[j].id) {
              console.log(this.carts)
              dummy[i].data.checked = true;
              dummy[i].data.color = j
              dummy[i].data.flag = 1
            }
          }
          }
          }
          this.cartInfo = dummy
          console.log(this.cartInfo)
          let res=this.cartInfo.filter(e=>e.data.flag==1) 
         res.forEach(e=>{showcheckedcolor.push(e.data)}) 
          console.log(showcheckedcolor)
          this.service.SetTrailsRelatedCartData({
            obj: showcheckedcolor,
          })
        }

      }

    })
  }
  cartData(): void {
    // alert('Before cart data')
    this.service.getTagDetails().subscribe(data => {
      if (data.length != 0) {
        this.instalationTagDetails = data.obj;
        this.cartInfo = this.instalationTagDetails.tags;
        // alert('CartData')
        this.changeCartDetails('s')
        this.changeCartDetails('u')
        this.changeCartDetails('o')
        this.changeCartDetails('p')
      }
    });
  }

 batteryData : any =[]
    // change Cart information
    changeCartDetails(cartType): void {
      this.msgToHeader.emit(false);
      this.cartdata.emit(this.carts)
      this.carts=[]
      this.flag = cartType;
       this.cartInfo = this.instalationTagDetails.tags;
      var dummy = [];
    dummy = JSON.parse(JSON.stringify(this.cartInfo));
      this.cartInfo = [];
      for (var i = 0; i < dummy.length; i++) {
        dummy[i].flag = 0;
        dummy[i].color = '';
        dummy[i].showhide='S';
        dummy[i].checked=false;
        if (cartType == 'p') {
          this.serviceDetails = false;
          this.playerDetails =true;
          this.bindPlayerDetails = true;
          this.bindServiceDetails = false;
          this.offSeasonDetails = false;
          this.bindoffseasonDetails = false;
          if(dummy[i].pace != null)
          {
          if (dummy[i].vehicleType == 'PLAYER_CART' || dummy[i].vehicleType == 'WALKER' || dummy[i].vehicleType == 'MEMBER_CART' || dummy[i].vehicleType == 'SPECIAL_PRIVILEGE') {

            if (dummy[i].coreState.seasonState == 'ON'|| dummy[i].coreState.seasonState == 'OFF') {
              
              if(this.levelofbattery.length !=0)
              {
               if(dummy[i].coreState.externalVoltageType == "FORTY_EIGHT_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max48V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                    if(dummy[i].pace.inGame== true &&dummy[i].pace.pace > 0 ){
                      this.positivecount.push(dummy[i].pace.pace)
                     // //console.log(this.positivecount)
                                  }
                                  if(dummy[i].pace.inGame== true &&dummy[i].pace.pace <= 0){
                      this.negativecount.push(dummy[i].pace.pace)
                     // //console.log(this.negativecount)
                                }
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min48V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min48V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "THIRTY_SIX_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max36V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min36V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min36V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});
                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "TWENTY_FOUR_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max24V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min24V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min24V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }
               
               if(dummy[i].coreState.externalVoltageType == "TWELVE_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max12V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min12V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min12V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

              }
              else
              {
                this.cartInfo.push({data :dummy[i]});
              }
              this.players = this.cartInfo.length;
            }
          }
        }
      }
      
        if (cartType == 's') {
          this.playerDetails = false;
          this.serviceDetails = true;
          this.bindServiceDetails = true;
          this.bindPlayerDetails =false;
          this.offSeasonDetails = false;
          this.bindoffseasonDetails = false
          if (dummy[i].vehicleType == 'MARSHAL_CART' || dummy[i].vehicleType == 'FOOD_CART' || dummy[i].vehicleType == 'SHUTTLE') {

            if (dummy[i].coreState.seasonState == 'ON'||dummy[i].coreState.seasonState == 'OFF') {
  
              if(this.levelofbattery.length !=0)
              {
               if(dummy[i].coreState.externalVoltageType == "FORTY_EIGHT_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max48V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min48V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min48V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "THIRTY_SIX_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max36V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min36V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min36V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});
                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "TWENTY_FOUR_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max24V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min24V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min24V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }
               
               if(dummy[i].coreState.externalVoltageType == "TWELVE_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max12V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min12V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min12V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

              }
              else
              {
                this.cartInfo.push({data :dummy[i]});
              }
              this.services = this.cartInfo.length;
  
              //  //////console.log(this.services);
  
  
  
            }
  
          }
  
        }
        if (cartType == 'u') {
          this.serviceDetails = true;
          this.playerDetails =false;
          this.bindServiceDetails = true;
          this.bindPlayerDetails =false;
          this.offSeasonDetails = false;
          this.bindoffseasonDetails = false
          if (dummy[i].vehicleType == 'UTILITY' || dummy[i].vehicleType == 'TURF_EQUIPMENT' ) {

            if (dummy[i].coreState.seasonState == 'ON'||dummy[i].coreState.seasonState == 'OFF') {
  
              if(this.levelofbattery.length !=0)
              {
               if(dummy[i].coreState.externalVoltageType == "FORTY_EIGHT_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max48V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min48V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min48V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "THIRTY_SIX_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max36V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min36V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min36V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});
                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

               if(dummy[i].coreState.externalVoltageType == "TWENTY_FOUR_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max24V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min24V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min24V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }
               
               if(dummy[i].coreState.externalVoltageType == "TWELVE_VOLT")
               {
                  if(dummy[i].coreState.externalVoltage > this.batteryVoltage.max12V)
                  {
                    // ////console.log("green",dummy[i]);
                    this.cartInfo.push({data :dummy[i],color : 'green'});
                  }
                  else if(dummy[i].coreState.externalVoltage < this.batteryVoltage.min12V)
                  {
                    //  this.cartInfo.push(dummy[i]);
                    // ////console.log("red")
                    this.cartInfo.push({data :dummy[i],color : 'red'});

                  }
                  else if(dummy[i].coreState.externalVoltage >= this.batteryVoltage.min12V)
                  {
                    this.cartInfo.push({data :dummy[i],color : 'yellow'});

                    // ////console.log("yellow",dummy[i])
                  }
                 
               }

              }
              else
              {
                this.cartInfo.push({data :dummy[i]});
              }
  
              this.utility = this.cartInfo.length;
  
              //   //////console.log(this.utility);
  
  
  
            }
  
  
  
          }
  
        }
        if (cartType == 'o') {
          this.offSeasonDetails = true;
          this.playerDetails = false;
          this.serviceDetails = false;
          this.bindoffseasonDetails = true;
          this.bindPlayerDetails = false;
          this.bindServiceDetails =false;
          if (dummy[i].coreState.seasonState == 'OFF_MONITORED')
          this.cartInfo.push({data :dummy[i],color : 'yellow'});
          this.offseason=this.cartInfo.length;
        //  ////////console.log(this.offseason);

  
        
  
        }
      
      
      
      // //console.log(this.cartInfo);

      // else
      // {
      //   this.cartInfo.push({data : dummy[i]})
      // }
      
  
      }
      let field="name";

      this.cartInfo.sort((a: any, b: any) => {

        if (a.data[field] < b.data[field]) {

            return -1;

        }

      }) 
   
    }
 leftFalse()
  {
    this.service.getToggleButton().subscribe(res=>{
      if(res == 1)
      {
        this.lftPanel !=this.lftPanel 
      }
      else
      {
        this.lftPanel = false;
      }
    })
  }

  openchat(){
    this.avgpace=false;
    this.chatbx=true;
    this.style = {'max-height': 'calc(100vh - 361px)',   'margin-bottom': '0%'}
}
checkPopup(value,data) {
this.tagDetails = []
    this.cartInfo.forEach((val,i) => {
      if (val.data.flag == 1) {
        this.tagDetails.push(val.data)
        //console.log(this.tagDetails)
      }
    })
  this.service.setTagId({
    tagId :value
 });
  this.dialog.open(PopupComponent, {
    width: '32%',
    height: '79%',
     data: { cartdetails: data, val: this.tagDetails }
  });
}

closechat(){
  this.avgpace=true;
  this.chatbx=false;
  this.style = {'height': 'calc(100vh - 248px)'}
}

closeLftPanel(){
this.lftPanel=false;

}
openLftPanel(){
  this.lftPanel=true;
  
  this.service.setToggleButton(1);
}

zoneProperties(){
  this.properties = !this.properties;
}

gettagdetails(){
  this.service.getTagDetails().subscribe(data => {
    //////console.log("sadsdafd",data.obj);
    if(data.length != 0){
    this.instalationTagDetails = data.obj;
    this.cartInfo = this.instalationTagDetails.tags;
    //this.changeCartDetails('p');
    //////console.log(this.cartInfo)
    }  
  });
}

componentMethodName(event: any, isChecked: boolean,tagid:any,tagdetails:any,tagname:any,i) 
{
  console.log(event);
  
  console.log(tagdetails['data'],i);
  this.currentId = i
//  console.log(this.currentId,event.target.checked)
  if (event.target.checked) {
    this.Array.push(tagdetails['data'].name)
    this.idarray.push(tagdetails['data'].id)
   //////console.log("Array",this.Array)
    //////console.log("idarray",this.idarray)
    this.Arraynames=this.Array
   this.arrayid=this.idarray
   this.length=  this.Array.length
    //////console.log( this.length)
    this.sendTextValue(tagdetails)
   this.sendarraynames(this.Arraynames)
    this.sendlength(this.length)
    this.sendselectedid(this.arrayid);



    this.hello = []
    this.apollo.use('live').watchQuery({
    query: tagPosition,
    variables: {
      id: tagid
    }
    }).valueChanges.subscribe(data => {
    console.log("tagInfo",data);
    // this.service.setTagData({obj:data,value:1})
    
    if (event.target.checked) {
      // Pushing the object into array
      this.hello.push(data);
      console.log(this.hello);
    }
    else {
      let el = this.hello.find(itm => itm.data.tags[0].id === this.tagId);
      console.log(el)
      if (el)
        this.hello.splice(this.hello.indexOf(el), 1);
      console.log(this.hello);
    }
    this.service.setTagData({ obj: this.hello, value: 1 })
    })

    if (event.target.checked) {
      this.carts.push(tagdetails['data'])
      this.msgToHeader.emit(event.target.checked);
      this.cartdata.emit(this.carts)
    ////////console.log(this.carts)
    }
    else {
      this.carts.splice(this.carts.indexOf(tagdetails['data']), 1)
      if (this.carts.length == 0) {
        this.msgToHeader.emit(event.target.checked);
        this.cartdata.emit(this.carts)
        ////////console.log(this.carts)
    
      }
      else {
        this.msgToHeader.emit(true);
        this.cartdata.emit(this.carts)
        ////////console.log(this.carts)
    
      }
    }

  }
  else {
     //////console.log(event.target.value)
  let index = this.Array.indexOf(tagname);
    //////console.log(index)
    this.Array.splice(index,1);
    this.idarray.splice(index,1)
    this.length=  this.Array.length
    //////console.log( this.length)
    this.sendTextValue(tagdetails)
    this.sendarraynames(this.Arraynames)
    this.sendlength(this.length)
    this.sendselectedid(this.arrayid)

  }
}


sendTextValue(val){
  //////console.log(val,'val')
  this.service.passValue(val);
}
sendlength(len){
  //////console.log(len,'len')
  this.service.passlength(len);
}

sendselectedid(id){
  //console.log(id,'id')
  this.service.passid(id);
}
sendarraynames(names){
  //////console.log(names,'names')
  this.service.passnames(names);
}

}
