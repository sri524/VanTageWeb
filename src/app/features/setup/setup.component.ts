import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';


import { Component, ElementRef, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { xml2json } from 'xml-js';
import { FormBuilder, FormGroup } from '@angular/forms';
const Courses = gql`

query
{ 
 courses(installationId:"E3FA8924-CCF9-4882-A8E1-07B42B8D74AD") 
{ 
id 
name 
holes{ 
id 
name 
mensPar 
mensHandicap 
womensPar 
womensHandicap
order 
} 
holeCount      
} 
} 
`
const courseRule = gql`

query($id: ID!)
{ 
  courseRules(installationId:$id) 
{ 
  languageCode
  text     
} 
} 
`
const welcomeScreens = gql`

query($id: ID!)
{ 
  welcomeTexts(installationId:$id) 
{ 
  languageCode
  text     
} 
} 
`
const welcomeImage = gql`
query ($id: ID!)

{ 
welcomeImages(installationId:$id)
{ 
contentFnvId 
installationId 
order 
  } 
} 
`
const holeImage = gql`
query
{ 
installationContents(installationId:"E3FA8924-CCF9-4882-A8E1-07B42B8D74AD") 
{ 
installationId 
installationContentFnvId 
} 
} 
`
const protipsQuery = gql`
query ($id: ID!)

{ 

protips(holeId:$id) 
{ 
holeId 
languageCode 
text 
} 
} 

`

const getBatterylevels =gql`
query ($id: ID!)

{ 

  installationBatteryLimit(installationId:$id) 
{ 
  max12V
  max24V
  max36V
  max48V
  min12V
  min24V
  min36V
  min48V
} 
} 

`
let  submitBatterylevels = gql`

mutation($installationId:ID!,$min12V:Float!,$max12V:Float!,$min24V:Float!,$max24V:Float!,$min36V:Float!,$max36V:Float!,$min48V:Float!,$max48V:Float!){ 

  installationSetBatteryLimits(input:{ 

    installationId:$installationId

    min12V:$min12V

    max12V:$max12V

    min24V:$min24V

    max24V:$max24V

    min36V:$min36V

    max36V:$max36V

    min48V:$min48V

    max48V:$max48V

  }) 

} 

`

let  tagOnOff = gql`
mutation  ($tagid:ID!,$input:SeasonState!)
{ 
  tagOnOff(tagId:$tagid,input:[{ 
    onOff:$input 
  }]) 
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
      seasonState
    }
  }   
  }
}
`



@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  alertsselect: any;

  // COURSE DECLARATIONS


  @ViewChild('mapElement') mapElement: ElementRef;
  private query: QueryRef<any>;
  savedBatterylevels:any=[];
  batteryLevels:any=[];
  optionvalues:any=[];
  // COURSE MANAGMENT
  addcourse = false;
  courserules = false;
  welcomescreen = false;
  scorecard = false;
  protip: boolean;
  result: any;
  installationID: any;
  coursesData: any = []
  courseName: any
  filtererdArray: any = []
  holes: any = [];
  total: any;
  courseRulesData: any = [];
  rules: any[] = [];
  // final: any = []
  welcomeText: any = [];
  welcomeData: any = []
  welcomeImages: any = [];
  imageId: number;
  installationContentFnvId: any;
  holeData: any = [];
  imagesData: any = [];
  firstHolePictureId: any;
  holePicId: any;
  greenPicId: any;
  courseImgId: any = [];
  imageUrl: any;
  abc: any = [];
  holeId: any;
  currentPosition: any;
  protipValue: any = [];
  protipValues: any = [];
  srchst: string = 'F'
  holeInstaId: any;
  firstGreenPictureId: any;
  staicCourseRules: any = [
    { language: 'en', text: '', name: 'English' },
    { language: 'de', text: '', name: 'German' },
    { language: 'es', text: '', name: 'Spanish' },
    { language: 'fr', text: '', name: 'French' },
    { language: 'ja', text: '', name: 'Japanese' },
    { language: 'ko', text: '', name: 'Korean' },
    { language: 'zh-cn', text: '', name: 'Chinese(Simplified,China)' }

  ];
  staticProtip: any = [
    { language: 'en', text: '', name: 'English' },
    { language: 'de', text: '', name: 'German' },
    { language: 'es', text: '', name: 'Spanish' },
    { language: 'fr', text: '', name: 'French' },
    { language: 'ja', text: '', name: 'Japanese' },
    { language: 'ko', text: '', name: 'Korean' },
    { language: 'zh-cn', text: '', name: 'Chinese(Simplified,China)' }

  ];

  staicWelcomeData: any = [
    { language: 'en', text: '' },
    { language: 'de', text: '' },
    { language: 'es', text: '' },
    { language: 'fr', text: '' },
    { language: 'ja', text: '' },
    { language: 'ko', text: '' },
    { language: 'zh-cn', text: '' }
  ];
  schedule: any = [
    { value: 0, name: "None" },
    { value: 1, name: "1 Day" },
    { value: 2, name: "2 Days" },
    { value: 3, name: "3 Days" },
    { value: 4, name: "4 Days" },
    { value: 5, name: "5 Days" },
    { value: 6, name: "6 Days" },
    { value: 7, name: "7 Days" },
    { value: 8, name: "8 Days" },
    { value: 9, name: "9 Days" }
  ];
  items = 0;
  current = 1;
  installationid: any;
  TotalCourses : any = []
  paceFormGroup: FormGroup;
  holetotaltime: any;
  CoursetotalTime: string;

  constructor(private dialog: MatDialog, private service: ApiServiceService, private apollo: Apollo, public dialogRef: MatDialogRef<SetupComponent>,
    @Inject(MAT_DIALOG_DATA) public RefVariable: any, private sanitizer: DomSanitizer,private fb: FormBuilder,

    ) { 
      this.paceFormGroup = this.fb.group({
        chkpacealert : [false],
        chkamberalert :[false],
        amberalertmints :[0],
        chkamberaudible : [false],
        chkredalert:[false],
        redalertmints:[0],
        chkredaudible:[false],
       chkpacemessage:[false],
        pacemessagemints:[0],
        chkemail:[false],
        txtemail:[''],
        emailmints :[0]
      });
    }

  ngOnInit() {

    this.service.getInsId().subscribe(

      data => {

        //console.log('installation id: ' + data);

        this.installationid = data;

        //console.log(this.installationid)

      }

    );
    this.holeId = 0;
    this.service.getMapcoordinates().subscribe(data => {
      this.result = data;
      this.installationID = this.result.obj.id
      //console.log(this.result);
      //console.log(this.installationID);

    });
    this.apollo.use('live').watchQuery({
      query: Courses,
      // variables: {
      //   id: this.installationID
      // }
    }).valueChanges.subscribe(data => {
      this.coursesData = data;
      //console.log(this.coursesData.data.courses);
      // this.TotalCourses = this.coursesData.data.courses
      this.courseName = this.coursesData.data.courses[0].name
      // this.holeInstaId=this.coursesData.data.courses[0].holes[0].id
      // //console.log(this.holeInstaId);

      //console.log(this.courseName);
      this.onChange(this.courseName)

    })

    if(this.RefVariable == 'BL'){
      this.getBatterylevels();
      
    }
  }




  onChange(name) {
    this.currentPosition = null;
    // const element = document.getElementById("myimage1");
    // element?.setAttribute("src", this.imageUrl);
    this.holeId = 0;
    //console.log(name);
    for (let i = 0; i < this.coursesData.data.courses.length; i++) {

      this.filtererdArray = this.coursesData.data.courses.filter(item => item.name == name)
    }
    //console.log(this.filtererdArray[0]);
    this.holes = this.filtererdArray[0].holes
    this.holes = this.holes.slice().sort((a, b) => a.order - b.order)
    this.holeInstaId = this.holes[0].id
    //console.log(this.holeInstaId);
    this.total = this.filtererdArray[0].holeCount;
    //console.log(this.holes);
    this.apollo.use('live').watchQuery({
      query: holeImage,
      // variables: {
      //   id: this.installationID
      // }
    }).valueChanges.subscribe(data => {
      //console.log("holeId", data)
      this.holeData = data;
           // Pace POPup Values start
  //   this.paceFormGroup.patchValue({
  //     chkpacealert : this.filtererdArray[0].pace.enabled,
  //     chkamberalert: this.filtererdArray[0].pace.alerts.amber.enabled,
  //     amberalertmints : this.filtererdArray[0].pace.alerts.amber.minutes,
  //     chkamberaudible: this.filtererdArray[0].pace.alerts.amber.audible,
  //     chkredalert : this.filtererdArray[0].pace.alerts.red.enabled,
  //     redalertmints :  this.filtererdArray[0].pace.alerts.red.minutes,
  //     chkredaudible : this.filtererdArray[0].pace.alerts.red.audible,
  //     chkpacemessage : this.filtererdArray[0].pace.behindPaceNotificationEnabled,
  //     pacemessagemints : this.filtererdArray[0].pace.behindPaceNotificationMinutes,
  //     chkemail : this.filtererdArray[0].notificationEnabled,
  //     txtemail : this.filtererdArray[0].notificationMail,
  //     emailmints : this.filtererdArray[0].notificationMinutes
  //   })
  // this.holes = this.filtererdArray[0].holes;
  //   this.holetotaltime = this.holes.map(a=> a.popMinutes).reduce((x,y)=>x+y,0);
  //   var hours = Math.floor(this.holetotaltime/60);
  //   var minutes = this.holetotaltime%60;
  //   this.CoursetotalTime = hours +':'+minutes

// Pace POPup Values end

      //console.log(this.holeData);
      this.installationContentFnvId = this.holeData.data.installationContents[0].installationContentFnvId;
      // //console.log(this.holeImageID);
      this.service.getHoleImage(this.installationContentFnvId).subscribe(
        data => {
          this.imagesData = xml2json(data, { compact: true, spaces: 4 });
          this.imagesData = JSON.parse(this.imagesData);
          //console.log(this.imagesData);
          //console.log(name);
          for (let i = 0; i < this.imagesData.SmartDisplayInstallationManifest.Course.length; i++) {
            this.courseImgId = this.imagesData.SmartDisplayInstallationManifest.Course.filter(item => item._attributes.Name == name
            );
          }
          //console.log(this.courseImgId);
          //console.log(name);
          if (this.RefVariable == 'C') {
            this.firstHolePictureId = this.courseImgId[0].Hole[0].HolePicture._attributes.Hash

            //console.log(this.firstHolePictureId);
            this.getImage(this.firstHolePictureId)
          }
          if (this.RefVariable == 'P') {
            this.firstGreenPictureId = this.courseImgId[0].Hole[0].GreenAreaPicture._attributes.Hash

            //console.log(this.firstGreenPictureId);
            this.getImage(this.firstGreenPictureId)
          }

        }
      )
    });
  }
  dayCall(value) {
    this.items = value;
    this.current = 1;
  }

  onPrev() {
    if (this.current == 1) {
      this.current = this.items
    }
    else {
      this.current--
    }
  }

  onNext() {
    if (this.current == this.items) {
      this.current = 1
    }
    else {
      this.current++
    }
  }
  holeImages(data) {
    console.log(data);
    this.holeId = data.order;
    this.currentPosition = data.order;
    this.holeInstaId = data.id;
    //console.log(this.holeInstaId);
    //console.log(this.currentPosition);
    this.holePicture(this.holeId)
  }
  pinHoleImages(data) {
    this.currentPosition = data.order;
    this.holeId = data.order;
    this.greenAreaPicture(this.holeId)
  }

  holePicture(num) {
    this.protip = false;
    this.srchst = 'F'

    //console.log("Hello", num);
    for (let i = 0; i < this.courseImgId[0].Hole.length; i++) {
      if (this.courseImgId[0].Hole[i]._attributes.Number == num + 1) {
        this.holePicId = this.courseImgId[0].Hole[i].HolePicture._attributes.Hash
        //console.log(this.holePicId);
        this.getImage(this.holePicId)
      }
    }
  }
  greenAreaPicture(num) {
    this.srchst = 'G'
    this.protip = false;
    //console.log("haa", num);
    for (let i = 0; i < this.courseImgId[0].Hole.length; i++) {
      if (this.courseImgId[0].Hole[i]._attributes.Number == num + 1) {
        this.greenPicId = this.courseImgId[0].Hole[i].GreenAreaPicture._attributes.Hash
        this.getImage(this.greenPicId)
        //console.log("green", this.greenPicId);

      }
    }
  }
  getImage(id) {
    this.service.getImage(id).subscribe(
      blob => {
        blob = new Blob([blob], { type: 'image/png' })
        this.imageUrl = URL.createObjectURL(blob);
        const element = document.getElementById("myimage1");
        element?.setAttribute("src", this.imageUrl);
      }
    )
  }
  showProtip() {
    this.srchst = 'P'
    const element = document.getElementById("myimage1");
    element?.setAttribute("src", '');
    this.protip = true;
    //console.log(this.holeInstaId);

    this.apollo.use('live').watchQuery({
      query: protipsQuery,
      variables: {
        id: this.holeInstaId
      }
    }).valueChanges.subscribe(data => {
      this.protipValue = data.data;
      this.protipValues = this.protipValue.protips;
      //console.log(data);
      this.staticProtip.forEach(ele => {
        this.protipValues.forEach(val => {
          if (ele.language == val.languageCode) {
            ele.text = val.text
          }
        })
      })
      //console.log(this.staticProtip);
    })
  }

  close() {
    this.dialog.closeAll()
    this.service.setpaceclose({'Open':'close'});
  }
  course() {
    this.addcourse = true;
    this.scorecard = false;
    this.courserules = false;
    this.welcomescreen = false;
  }
  courseRules() {
    this.addcourse = false;
    this.scorecard = false;
    this.courserules = true;
    this.welcomescreen = false;
    this.apollo.use('live').watchQuery({
      query: courseRule,
      variables: {
        id: this.installationID
      }
    }).valueChanges.subscribe(data => {
      this.courseRulesData = data;
      //console.log(this.courseRulesData.data.courseRules);
      this.rules = this.courseRulesData.data.courseRules;
      this.staicCourseRules.forEach(ele => {
        this.rules.forEach(val => {
          if (ele.language == val.languageCode) {
            ele.text = val.text
          }
        })
      })
      //console.log(this.staicCourseRules)
    });

  }
  ok() {
    this.courserules = false;

  }
  welcomeScreen() {
    this.addcourse = false;
    this.scorecard = false;
    this.courserules = false;
    this.welcomescreen = true;
    this.apollo.use('live').watchQuery({
      query: welcomeScreens,
      variables: {
        id: this.installationID
      }
    }).valueChanges.subscribe(data => {
      this.welcomeText = data;
      //console.log(this.welcomeText);
      this.welcomeData = this.welcomeText.data.welcomeTexts;
      //console.log(this.welcomeData);
      this.staicWelcomeData.forEach(ele => {
        this.welcomeData.forEach(val => {
          if (ele.language == val.languageCode) {
            ele.text = val.text
          }
        })
      })
      //console.log(this.staicWelcomeData)
    })
    this.apollo.use('live').watchQuery({
      query: welcomeImage,
      variables: {
        id: this.installationID
      }
    }).valueChanges.subscribe(data => {
      this.welcomeImages = data;
      //console.log(this.welcomeImages);
      this.imageId = this.welcomeImages.data.welcomeImages[0].contentFnvId;
      //console.log(this.imageId);
      this.service.getImage(this.imageId).subscribe(
        blob => {
          blob = new Blob([blob], { type: 'image/png' })
          const imageUrl = URL.createObjectURL(blob);
          const element = document.getElementById("myimage");
          element?.setAttribute("src", imageUrl);
        }
      )

    })

  }
  scoreCard() {
    this.addcourse = false;
    this.scorecard = true;
    this.courserules = false;
    this.welcomescreen = false;

  }

  welcomeOk() {
    this.welcomescreen = false;
  }
  scoreBoardOk() {
    this.scorecard = false;
  }
  protipOk() {
    this.protip = false;
  }

  resetpin() {
  }

  alerTs() {
    this.alertsselect = !this.alertsselect;
  }


  changeVal(min,max,bid){

    ////console.log(min,max);
    this.savedBatterylevels.splice(bid,1);
    if(bid == 0)
      {
        this.savedBatterylevels.splice(0,0, [min, max])
      
      }
    else   if(bid == 1)
    {
      this.savedBatterylevels.splice(1,0,[min,max])
     
    }
    else   if(bid == 2)
    {
      this.savedBatterylevels.splice(2,0,[min,max])
     
    }
    //console.log(this.savedBatterylevels)
  }

 getBatterylevels(){
    this.apollo.use('live').watchQuery({query : getBatterylevels,variables : {id : this.installationID}, fetchPolicy:'network-only'}).valueChanges.subscribe(({data,loading})=>{
  
      //console.log(data);
      this.savedBatterylevels=[]
      this.batteryLevels = data["installationBatteryLimit"][0]
      this.optionvalues =[
       { 
         minValue:this.batteryLevels.min12V,
         maxValue:this.batteryLevels.max12V,
         Label:"12",
       Options : {
         floor: 11,
         ceil: 13,
         step:0.01,
         hideLimitLabels: true,
       }},
       {
         minValue:this.batteryLevels.min36V,
         maxValue:this.batteryLevels.max36V,
         Label:"36",
       Options : {
         floor: 34,
         ceil: 38,
         step:0.01,
         hideLimitLabels: true,
       }},
       { 
         minValue:this.batteryLevels.min48V,
         maxValue:this.batteryLevels.max48V,
         Label:"48",
       Options : {
         floor: 45,
         ceil: 51,
         step:0.01,
         hideLimitLabels: true,
       }}];
       this.savedBatterylevels.push([this.optionvalues[0].minValue,this.optionvalues[0].maxValue]);
      
       this.savedBatterylevels.push([this.optionvalues[1].minValue,this.optionvalues[1].maxValue]);
    
       this.savedBatterylevels.push([this.optionvalues[2].minValue,this.optionvalues[2].maxValue]);


      
   });
  }
  submitBatterylevels(){

    this.apollo.mutate({
      mutation : submitBatterylevels,
      variables:{
        installationId: this.installationID,
        min12V : this.savedBatterylevels[0][0],
        max12V : this.savedBatterylevels[0][1],
        min24V:0,
        max24V : 0,
        min36V : this.savedBatterylevels[1][0],
        max36V : this.savedBatterylevels[1][1],
        min48V : this.savedBatterylevels[2][0],
        max48V : this.savedBatterylevels[2][1],

      },
    }).subscribe(({data})=>{
      //console.log(data);
      if(data["installationSetBatteryLimits"] == true)
      this.dialog.closeAll();
             
    })
    
  }
  CancelBatterylevels(){
    this.dialog.closeAll();
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
  
  TagOn(){
    for (var i = 0; i < this.RefVariable.cartdetails.length; i++) {
      //console.log(this.RefVariable.cartdetails.length)
    this.apollo.mutate({
    mutation:   tagOnOff,
    variables: {
     tagid:this.RefVariable.cartdetails[i].id,
     input:"ON"
    },
  
    }).subscribe(({data} ) => {
    //console.log('got data', data);
    this.dialog.closeAll();
    this.senddata(this.installationid)
  }, (error) => {
  //console.log('there was an error sending the query', error);
  });
}
    }


    TagOff(){
      for (var i = 0; i < this.RefVariable.cartdetails.length; i++) {
      this.apollo.mutate({
      mutation:   tagOnOff,
      variables: {
       tagid:this.RefVariable.cartdetails[i].id,
       input:"OFF"
      },
    
      }).subscribe(({data} ) => {
      //console.log('got data', data);
      this.dialog.closeAll();
      this.senddata(this.installationid)
    }, (error) => {
    //console.log('there was an error sending the query', error);
    });
  }
      }
 

      
      TagOffMonitored(){
        for (var i = 0; i < this.RefVariable.cartdetails.length; i++) {
      this.apollo.mutate({
      mutation:   tagOnOff,
      variables: {
       tagid:this.RefVariable.cartdetails[i].id,
       input:"OFF_MONITORED"
      },
    
      }).subscribe(({data} ) => {
      //console.log('got data', data);
      this.dialog.closeAll();
      this.senddata(this.installationid)
    }, (error) => {
    //console.log('there was an error sending the query', error);
    });
  }
      }

    tagClose()
    {
      this.dialog.closeAll();
    }

}
