import { Component, OnInit, Inject, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service';
import { gql, Apollo,QueryRef} from 'apollo-angular';
import { EventEmitterService } from '../../Core/Providers/event-emitter-service/event-emitter.service';


let tagLock = gql`

mutation  ($tagid: ID!,  $islock:Byte! ,$time: DateTime!)
{ 
  tagLock(tagId:$tagid, isLock:$islock, time:$time) 
   
  
} 
`;


let tagLockandUnlockAll = gql`

mutation  ($insid: ID!,  $islock:Byte! ,$time: DateTime!)
{ 
  tagLockandUnlockAll(installationId:$insid, isLock:$islock, time:$time) 
   
  
} 
`;
const getDetails = gql`

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
    }
  }   
  }
}
`
const LOCK_SCHEDULE = gql`
  mutation (
    $installationId: ID!
    $lockoperationType: OperationTypes! 
    $unlockoperationType: OperationTypes!
    $lockscheduleTime: String!
    $unlockscheduleTime: String!
    $enabled: Boolean!
    $vehicleType: Int!
    $vehicleTypes: VehicleTypesBitMap!
  ) {
    lockScheduleUpdate(
      installationId: $installationId
      input: [
        {
          installationId: $installationId
          operationType: $lockoperationType
          scheduleTime: $lockscheduleTime
          enabled: $enabled
          vehicleType: $vehicleType
          vehicleTypes: $vehicleTypes
        }
        {
          installationId: $installationId
          operationType: $unlockoperationType
          scheduleTime: $unlockscheduleTime
          enabled: $enabled
          vehicleType: $vehicleType
          vehicleTypes: $vehicleTypes
        }
      ]
    )
  }
`;


const getscheduleDetails = gql`
query($id: ID!)
{
  lockSchedule(installationId:$id)
  {
     installationId
      operationType
       scheduleTime
        vehicleType
  }

}

`


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  startTime = false;
  endTime = false;
  installationid: any;
  name: string;
  length: any;
  id: any = [];
  tagDetails: any;

  schedule:any=[]

scheduletime:any=[]

  @Input() names: any = []
  private query: QueryRef<any>;

  
vehicleValues = [
  //{ itemval: 1022,itemimg : '',itemName: 'All Vehicles'},
  { itemval: 512, itemimg: '../../../assets/VTAG_Images/sppriv_badge.png', itemName: 'Special Privilega', isSelected: false },
  { itemval: 256, itemimg: '../../../assets/VTAG_Images/member_badge.png', itemName: 'Members', isSelected: false },
  { itemval: 128, itemimg: '../../../assets/VTAG_Images/shuttle_badge.png', itemName: 'Shuttles', isSelected: false }
  , { itemval: 64, itemimg: '../../../assets/VTAG_Images/walker_badge.png', itemName: 'Walkers', isSelected: false },
  { itemval: 32, itemimg: '../../../assets/VTAG_Images/turf_badge.png', itemName: 'Turf Equipment', isSelected: false },
  { itemval: 16, itemimg: '../../../assets/VTAG_Images/fb_badge.png', itemName: 'Food and Beverage', isSelected: false },
  { itemval: 8, itemimg: '../../../assets/VTAG_Images/utility_badge.png', itemName: 'Utility Vehicles', isSelected: false },
  { itemval: 4, itemimg: '../../../assets/VTAG_Images/marshal_badge.png', itemName: 'Player Assistants', isSelected: false },
  { itemval: 2, itemimg: '../../../assets/VTAG_Images/player_badge.png', itemName: 'Players', isSelected: false }
]

starttime:any;
endtime:any
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<GeneralComponent>,
    private service: ApiServiceService, private apollo: Apollo, 


    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.service.getvalue().subscribe(
      data => {
        // //console.log('next subscribed value: ' + data.coreState.isLocked);
        this.name = data['data'];
        // this.id=data.id
        //console.log(this.name)
        // //console.log(this.id)
 
      }
    );

    this.service.getlength().subscribe(
      data => {
        //console.log('length: ' + data);
        this.length = data;
        //console.log(this.length)
      }
    );

    this.service.getid().subscribe(
      data => {
        //console.log('id: ' + data);
        this.id = data;
        //console.log(this.id)
      }
    );
    this.service.getnames().subscribe(
      data => {
        //console.log('names: ' + data);
        this.names = data;
        //console.log(this.names)
      }
    );

    this.service.getInsId().subscribe(
      data => {
        //console.log('namesASADSA: ' + data);
        this.installationid = data;
        //console.log(...this.installationid)
      }
    );


    this.query= this.apollo.use('live').watchQuery({
      query: getscheduleDetails,
      variables : {
      id :this.installationid
    },
    fetchPolicy:'network-only'
  });
    this.query.valueChanges.subscribe(result =>{
this.schedule=result
      //console.log('getscheduleDetails',this.schedule)
      this.starttime=this.schedule.data.lockSchedule[0].scheduleTime
this.endtime=this.schedule.data.lockSchedule[1].scheduleTime
      if (this.schedule.data.lockSchedule[0].vehicleType != 0) {
        var l = 0;
        var item;
        var vehtotalValue = this.schedule.data.lockSchedule[0].vehicleType;
        if (vehtotalValue == 1022) {
          // this.zoneForm.patchValue({
          //   chkallvh: true
          // });
          this.checkAll()
        }
        else {
          // this.zoneForm.patchValue({
          //   chkallvh: false
          // });
          for (l = 0; l < this.vehicleValues.length; l++) {
            if (this.vehicleValues[l].itemval <= vehtotalValue) {
              if (vehtotalValue == 2)
                //vehicleSelectedValues.push(vehtotalValue);
                this.vehicleValues[l].isSelected = true;
              else {
                item = vehtotalValue - this.vehicleValues[l].itemval;
                //vehicleSelectedValues.push(item);
                vehtotalValue = item;
                this.vehicleValues[l].isSelected = true;
              }
            }
          }
        }
      }
    })

  }
  senddata(ref) {
   
    this.query= this.apollo.use('live').watchQuery({
        query: getDetails,
        variables : {
        id : ref
      },
      fetchPolicy:'network-only'
    });
  
      this.query.valueChanges.subscribe(result =>{
        //console.log('Send Reference',result)
      })
    }
  
    // lock code start
    islock: number = 1;
    lock(tagid: any) {
      const time = new Date().toISOString()
      //console.log(tagid, this.islock, time)
      for (var i = 0; i < this.id.length; i++) {
        //console.log(this.id.length)
        //console.log(this.id[i])
        this.apollo.mutate({
          mutation: tagLock,
          variables: {
            tagid: this.id[i],
            islock: this.islock,
            time: time
          },
        }).subscribe(({ data }) => {
          //console.log('got data', data);
  
          this.dialog.closeAll();
          this.dialogRef.afterClosed().subscribe(() => {
            // setTimeout(() => {     }, 10000);
          this.senddata(this.installationid)
          this.service.passempty("emptyarray")
  
            });
        }, (error) => {
          //console.log('there was an error sending the query', error);
        });
      }
    }
  
    
  
    isunlock: number = 0;
    unlock(tagid: string, lock: number) {
  
      const time = new Date().toISOString()
  
      //console.log(tagid, this.isunlock, time)
      for (var i = 0; i < this.id.length; i++) {
        this.apollo.mutate({
          mutation: tagLock,
          variables: {
            tagid: this.id[i],
            islock: this.isunlock,
            time: time
          },
        }).subscribe(({ data }) => {
          //console.log('got data', data);
          this.dialog.closeAll()
          this.senddata(this.installationid)
          this.service.passempty("emptyarray")
  
        }, (error) => {
          //console.log('there was an error sending the query', error);
        });
      }
    }
  
  
    close() {
      this.dialog.closeAll()
    }
  
  
    // lockschedule code starts
  
    start() {
      this.startTime = !this.startTime
    }
    end() {
      this.endTime = !this.endTime
    }
    addtime() {
      //console.log('clicked')
    }
  
    islockall: number = 1;
    // lockall code 
    lockall() {
      const time = new Date().toISOString()
      //console.log(this.installationid, this.islockall, time)
  
      this.apollo.mutate({
        mutation: tagLockandUnlockAll,
        variables: {
          insid: this.installationid,
          islock: this.islockall,
          time: time
        },
      }).subscribe(({ data }) => {
        //console.log('got data', data);
        this.dialog.closeAll();
        this.senddata(this.installationid)
  
      }, (error) => {
        //console.log('there was an error sending the query', error);
      });
    }
  
    isunlockall: number = 0;
    // lockall code 
    unlockall() {
      
      const time = new Date().toISOString()
      //console.log(this.installationid, this.isunlockall, time)
  
      this.apollo.mutate({
        mutation: tagLockandUnlockAll,
        variables: {
          insid: this.installationid,
          islock: this.isunlockall,
          time: time
        },
      }).subscribe(({ data }) => {
        //console.log('got data', data);
        this.dialog.closeAll()
        this.senddata(this.installationid)
  
      }, (error) => {
        //console.log('there was an error sending the query', error);
      });
    }


    checkAll() {
      this.vehicleValues.forEach((element) => {
        element.isSelected = true;
      });
    }
    checkedStrings:any
    totalcheeckedStrings:number=0
    getVehicles(){
      this.checkedStrings = this.vehicleValues.reduce((acc, eachGroup) => {
        if (eachGroup.isSelected) {
          acc.push(eachGroup.itemval)
        }
        return acc
      }, [])
      //console.log(this.checkedStrings);
      for (let i = 0; i < this.checkedStrings.length; i++) {    
        this.totalcheeckedStrings += this.checkedStrings[i];    }
  //console.log( this.totalcheeckedStrings)
    }
    lckscheduletime:any
    unlckscheduletime:any
    updatelockschedule() {
      this.lckscheduletime = (document.getElementById('start-time') as HTMLInputElement).value;
      this.unlckscheduletime=(document.getElementById('end-time')as HTMLInputElement).value;
      this.apollo
        .mutate({
          mutation: LOCK_SCHEDULE,
          variables: {
            installationId: this.installationid,
            lockoperationType: "LOCK_ALL",
            lockscheduleTime: this.lckscheduletime,
            enabled: true,
            vehicleType: this.totalcheeckedStrings,
            vehicleTypes: "FOOD_CART",
            unlockscheduleTime: this.unlckscheduletime,
            unlockoperationType: "UNLOCK_ALL",
          },
        })
        .subscribe(
          ({ data }) => {
            //console.log(" Lock Schedule", data);
            this.dialog.closeAll();
          },
          (error) => {
            //console.log("there was an error sending the query", error);
          }
        );
    }

}