import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service'
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = _moment;

const getNotifications = gql`
query($id:ID!,$since:DateTime!){
  notificationsByInstallation(installationId:$id, 

 since:$since) 

 { 
    id 
    tagId 
   tagName 
   installationId 
   installationName 
   isViolating 
   summary 
   description 
   priority 
   acknowledgedUser 
   acknowledgedTime 
   createTime 
   updateTime 
   position 
   reason 

 } 
}
`

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html',
  styleUrls: ['./right-panel.component.css'],
  providers: [DatePipe]
})
export class RightPanelComponent implements OnInit {

  rytPanel: boolean = false;
  installationId: any="";
  selectedDate: any='';
  notificationData: any=[];
  showNotifyImg :any=[];
  tempData:any=[];
  timeOffSet: any='';
  @Output() rightpanelCartdata = new EventEmitter<any>();
  @Output() notificationDate = new EventEmitter<any>();
  singlenotificationdata: any=[];
  constructor(private apollo: Apollo,private service: ApiServiceService,private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.service.getInstallationId().subscribe(data=>{
      this.installationId = data;
    });
    this.service.getMapcoordinates().subscribe((data:any) => {
        console.log(data);
        if(data.obj!='')
        this.timeOffSet = data.obj.timeZone.offset;
    });
    //this.selectedDate=moment(new Date(), 'EEEE, MMMM d, y');
    this.selectedDate = new Date();
   
  }
  close(){
    this.rytPanel =false;
    //this.selectedDate = moment(new Date(), 'EEEE, MMMM d, y');
    this.selectedDate = new Date();
  }

  openRytPanel(){
    this.notificationData=[];
    this.tempData=[];
    this.apollo.use('live').watchQuery({
      
      query: getNotifications,
      variables: {
        id: this.installationId,
        since :this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')+"T00:00:00.0000Z"
        //since : "2019-02-27T00:00:00.0000Z"
        
      }
      , fetchPolicy:'network-only',
      pollInterval:500000
    }).valueChanges.subscribe(({data,loading})=> {

     //this.selectedDate =this.datePipe.transform(this.selectedDate, 'EEEE, MMMM d, y');
       this.selectedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
       
        this.tempData = data["notificationsByInstallation"];
        console.log(this.tempData);
        this.notificationData = this.tempData.filter((item=>this.datePipe.transform(item.createTime, 'yyyy-MM-dd') == this.selectedDate));

    });

    this.rytPanel =true;
  }

  getTimeStamp(val){
    if(val != undefined){

      // var newdate = new Date(val.toLocaleString('en-US', {
      //   timeZone: this.timeZone
      // })); 
   // var newdate= new Date(val+this.timeZone);

   let newdate=new Date(moment(val).add(this.timeOffSet,'hours').format('YYYY-MM-DDTHH:mm:ss.000') + 'Z');
    
    var hrs = newdate.getUTCHours();
    let mnts = newdate.getUTCMinutes();
    // var dd = "AM";
    // var h = hrs;
    // if (h >= 12) {
    //     h = hrs-12;
    //     dd = "PM";
    // }
    // if (h == 0) {
    //     h = 12;
    // }
    // let minutes = mnts<10?"0"+mnts:mnts;
    
  
    // let hours = h<10?"0"+h:h;

   
    return (hrs+":"+mnts)
    }
 }
 onChange(e){

  this.selectedDate=e.target.value;
  this.openRytPanel();
 }

 showtrailzone(item){
  this.singlenotificationdata=[];
   console.log(item);
   let zonecoordinates = item.position.replace(/[^\d., -]/g, '').trim().split(' ');
   console.log(zonecoordinates);
  //  var ddd=moment(item.createTime,"hh:mm A");
  //  var xx = moment(item.createTime,"hh:mm A").add(10,'minutes').format('hh:mm');
  //  var ss = moment(item.createTime,"hh:mm A").add(10,'minutes').format('LTS');
  //  let hrs = item.createTime.getUTCHours()+1;
  //  let mnts = item.createTime.getUTCMinutes();
  let dd = new Date(item.createTime);

  //let sampledate=item.createTime.getUTCHours();

  var hrs = dd.getUTCHours();
    let mnts = dd.getUTCMinutes();

   //let addedhrs = moment().add(2, 'hours').format('hh:mm A');
   this.singlenotificationdata.push({'tagid': item.tagId,'pos':zonecoordinates,'time':item.createTime,'timeOffSet' : this.timeOffSet}) ;
   // this.rightpanelCartdata.emit(this.singlenotificationdata);
    this.notificationDate.emit(this.singlenotificationdata);

 }
 updateDate($event){
   console.log($event);
   this.selectedDate = new Date($event)
 }


}
