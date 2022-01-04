import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service'
import { gql, Apollo } from 'apollo-angular';
import{FormGroup,FormBuilder,Validators} from '@angular/forms';
import { DatePipe } from '@angular/common'


const getTagInormation = gql`

query($id:ID)
{
tags(where:{
 id:{
 eq: $id
} 
  })
  {
 id
imei   
name
label
serialNumber
vehicleType
serialNumber
workgroup
coreState
{
  id
 externalVoltage
 sim
firmwareVersion
displayType
    }
  location
 {
 position
 time
    }
  }
}
`
let getNotificationByTagid = gql`
query($id:ID!,$start:DateTime!,$end:DateTime!){
  notificationsByTag(tagId:$id, 

 start:$start,  

 end:$end) 

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
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  tagId: any;
  result: any = []
  details:any=[]
  tagForm: FormGroup;
  tagGroup:any;
  myDate:any =new Date();
  vehicalTypeNames = [
{value : "UNDEFINED",name : "UNDEFINED"},
{value : "PLAYER_CART",name : "PLAYER_CART"},
{value : "UTILITY",name : "UTILITY"},
{value : "MARSHAL_CART",name : "MARSHAL_CART"},
{value : "FOOD_CART",name : "FOOD_CART"},
{value : "TURF_EQUIPMENT",name : "TURF_EQUIPMENT"},
{value : "WALKER",name : "WALKER"},
{value : "SHUTTLE",name : "SHUTTLE"},
{value : "MEMBER_CART",name : "MEMBER_CART"},
{value : "SPECIAL_PRIVILEGE",name : "SPECIAL_PRIVILEGE"},

]
trailopen: boolean;
trailclose: boolean;
  alertsData: any =[];

  constructor(private dialog: MatDialog, private service: ApiServiceService, private apollo: Apollo,private fb :FormBuilder, private datePipe : DatePipe,
    @Inject(MAT_DIALOG_DATA) public TagDetails: any) {

     }

  ngOnInit() {
    this.tagDetails();
    this.tagForm = this.fb.group({
      name:[''],
        label:[''],
        type:[''],
        group:['']
    })
   this.tagGroup=0;
  }


  close() {
    this.dialog.closeAll();
  }

  tagDetails() {
    if(this.TagDetails!= null ){

      if(this.TagDetails.cartdetails.flag==0){   
        this.trailopen=true;   
        this.trailclose=false   
      }   
    else{    
      this.trailopen=false;    
     this.trailclose=true   
    }   
    } 
    else{
      this.trailopen=true;
        this.trailclose=false

    }
    this.service.getTagId().subscribe(data => {
      //console.log(data);
      
      this.tagId = data.tagId
    })
    this.apollo.use('live').watchQuery({
      
      query: getTagInormation,
      variables: {
        id: this.tagId
      }
    }).valueChanges.subscribe(({data,loading})=> {
      console.log(data);
      
      this.result = data;
      this.details=this.result.tags[0]
      console.log("details",this.details)
    this.tagForm.controls.name.setValue(this.details.name)
    this.tagForm.controls.type.setValue(this.details.vehicleType)
    })
    this.tagForm=this.fb.group({
      name:this.details.name,
      label:this.details.label,
      type:this.details.vehicleType,
      group:this.details.workgroup
    })
    
    ////console.log('TagForm',this.tagForm)
    
  }
  locateTag()
  {
  
   this.service.setLocatonTagData({obj : this.details, value : 'tagLocation'})
  }

  getNotoficationByTagDetials(){

    this.apollo.use('live').watchQuery({
      
      query: getNotificationByTagid,
      variables: {
        id: this.tagId,
        start :this.datePipe.transform(this.myDate, 'yyyy-MM-dd')+"T00:00:00.0000Z",
        end :  this.datePipe.transform(this.myDate, 'yyyy-MM-dd')+"T23:59:00.0000Z"
      }
      , fetchPolicy:'network-only'
    }).valueChanges.subscribe(({data,loading})=> {
      //console.log(data);
      this.alertsData = data["notificationsByTag"];
  
    });
  }
  getTimeStamp(val:string){
     var newdate= new Date(val);
     
     var hrs = newdate.getUTCHours();
     var mnts = newdate.getUTCMinutes();
     var finalopt= hrs +':'+mnts;
     return finalopt;
  }

  onChange(e){
    this.myDate=e.target.value;
    this.getNotoficationByTagDetials();
  }


  Trail(val) {
    let cart: any = []
    if (val == 'T') {
      if (this.TagDetails.val.length > 0) {
        this.TagDetails.cartdetails.color = this.TagDetails.val.length
        this.TagDetails.val.forEach((val, i) => {
          cart.push(this.TagDetails.val[i])
        })
        if (cart.length < 6) {
          this.TagDetails.cartdetails.color = this.TagDetails.val.length
          this.TagDetails.cartdetails.flag = 1
          cart.push(this.TagDetails.cartdetails)
          this.service.SetTrailsRelatedCartData({
            obj: cart,
          })
        }
        //console.log(cart)
      }
      else {
        this.TagDetails.cartdetails.color = 0
        this.TagDetails.cartdetails.flag = 1
        if (cart.length < 6) {
          cart.push(this.TagDetails.cartdetails)
          this.service.SetTrailsRelatedCartData({
            obj: cart,
          })
          //console.log(cart)

        }
      }

    }
    if (val == 'C') {
      this.TagDetails.cartdetails.color = ''
      this.TagDetails.cartdetails.flag = 0
      this.TagDetails.val.forEach((val, i) => {
        if (val.id != this.TagDetails.cartdetails.id) {
          cart.push(this.TagDetails.val[i])
        }
      })
      cart.forEach((val, i) => { val.color = i })


      this.service.SetTrailsRelatedCartData({
        obj: cart,
      })
    }

    this.dialog.closeAll();

  }
 

}
