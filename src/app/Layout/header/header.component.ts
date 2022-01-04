import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReportsComponent } from '../../features/reports/reports.component';
import { SetupComponent } from '../../features/setup/setup.component';
import { GeneralComponent } from '../../features/general/general.component';
import { ZonesComponent } from '../../features/zones/zones.component';
import { ApiServiceService } from '../../Core/Providers/api-service/api-service.service';
import { gql, Apollo } from 'apollo-angular';

import { Subscription } from 'rxjs';
import { SharedDataServiceService } from 'src/app/Core/Providers/SharedService/shared-data-service.service';

const getMapArea = gql`
  query ($id: ID!) {
    installations(where: { id: { eq: $id } }) {
      id
      name
      region {
        id
        name
        bounds
        zoomLevel
        zoomPoint
      }
    }
  }
`;
const getTagDetails = gql`
  query ($id: ID!) {
    installations(where: { id: { eq: $id } }) {
      id
      name
      region {
        id
        name
        bounds
        zoomLevel
        zoomPoint
      }

      timeZone {
        code
        offset
      }

      tags {
        id
        name
        imei
        vehicleType
        coreState {
          isLocked
          seasonState
          externalVoltageType
          externalVoltage
        }
        location {
          position
          time
        }
        pace {
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
`;
const userInstallations = gql`
  query ($userId: String!) {
    userById(userId: $userId) {
      installations {
        id
        name
      }
    }
  }
`;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAllopen: boolean;
  isActive: boolean = false;
  result: any = [];
  tagDetails: any;
  installationId: any;
  installationsDetails: any='3F044F3C-D5D2-4DFE-9050-C9D9F3D9760F';
  zones: any = [];
  general: boolean;
  tabmenu: string;
  rightpanel: boolean;
  isOn: boolean;
  subscribtion: Subscription;
  panelmessage: any;
  srchst: string;
  cartdata: any = [];
  StartRange: any;
  Range: any;
  loader: boolean = true;
  VisibilityStatus: any;
  TimeOffset: any;
  Reset: any;
  activeTagArray: any = [];
  inActiveTagArray: any = [];
  totalTagData: any = [];
  tagsCheckArray: any = [];
  finalArray: any = [];
  notificationDate: any = '';
  userSubscribtion: Subscription;
  userId: any;
  constructor(
    private route: Router,
    private service: ApiServiceService,
    private dialog: MatDialog,
    private router: Router,
    private apollo: Apollo,
    private dataService: SharedDataServiceService
  ) {}
  ngOnInit() {
    // alert("enter")
    console.log('header');

    this.toggleButton();

    this.userSubscribtion = this.service.getUserId().subscribe((u) => {
      this.getUserInstallations(u);
    });
    this.subscribtion = this.service.getInstallationId().subscribe((instId) => {
      if (instId.instId != '') {
        this.installationId = instId;
      }
    });
    this.getInstallations(this.installationId);
    this.Tabclick('G');
  }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  toggleButton() {
    this.service.getToggleButton().subscribe((res) => {
      if (res == 1) {
        this.isAllopen = false;
      }
    });
  }

  meNuclick() {
    this.service.setToggleButton(2);
    this.isAllopen = !this.isAllopen;
    this.isActive = !this.isActive;
  }

  // Getting User Installations
  getinsltions: any = [];

  getUserInstallations(instId) {
    this.userId = instId;
    this.apollo
      .use('live')
      .query({
        query: userInstallations,
        variables: {
          userId: this.userId.userId,
        },
      })
      .subscribe(({ data }) => {
        this.installationsDetails = data['userById'].installations;
        console.log(this.installationsDetails[0].id);
        this.service.setUserInstallations({ obj: this.installationsDetails });
        this.service.setInstallationId(this.installationsDetails[0].id);
      });
  }
  filteredArray: any = [];
  zonesData: any = [];
  getInstallations(event) {
    console.log(event);
    this.service.setInsId(event);
    this.service.setInstallationId(event);
    this.apollo
      .use('live')
      .watchQuery({
        query: getTagDetails,
        variables: {
          id: event,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        ////console.log(data['installations']);
        if (data['installations'].length == 0) {
          alert(
            `Selected Course is not available.Please Select another course`
          );
        } else {
          this.result = data['installations'][0];
          ////console.log(data, this.result);
          this.TimeOffset = this.result.timeZone.offset;
          this.service.setMapcoordinates({
            obj: this.result,
          });
        }
        this.apollo
          .use('live')
          .watchQuery({
            query: getTagDetails,
            variables: {
              id: event,
            },
          })
          .valueChanges.subscribe(({ data, loading }) => {
            //////console.log(data['installations'][0]);
            this.tagDetails = data['installations'][0];

            for (let i = 0; i < this.tagDetails.tags.length; i++) {
              if (this.tagDetails.tags[i].pace != null) {
                this.totalTagData.push(this.tagDetails.tags[i]);
                if (this.tagDetails.tags[i].pace.inGame == true) {
                  this.activeTagArray.push(this.tagDetails.tags[i]);
                  //console.log(this.activeTagArray);
                } else if (this.tagDetails.tags[i].pace.inGame == false) {
                  this.inActiveTagArray.push(this.tagDetails.tags[i]);
                  //console.log(this.inActiveTagArray);
                }
              }
            }

            this.service.getShowTagsCheck().subscribe((data) => {
              if (data.value == 1) {
                this.tagsCheckArray = data.data;
              }
              if (this.tagsCheckArray.length == 0) {
                //console.log("hai length 0");
                this.finalArray = [];
              }
              if (this.tagsCheckArray[0] == 'active') {
                this.finalArray = [];
                this.finalArray = this.activeTagArray;
              }
              if (this.tagsCheckArray[0] == 'idle') {
                this.finalArray = [];
                this.finalArray = this.inActiveTagArray;
              }
              if (this.tagsCheckArray.length == 2) {
                //console.log("hai length 2");
                this.finalArray = [];
                this.finalArray = this.totalTagData;
                //console.log(this.finalArray);
              }

              //console.log(this.finalArray);

              this.service.setShowTags({
                tags: this.finalArray,
                totalTags: this.tagDetails,
                value: 1,
              });
            });

            this.service.setTagDetails({
              obj: this.tagDetails,
            });
          });
      });

    // this.apollo.watchQuery({query : getZonesDetails,variables : {id : event}}).valueChanges.subscribe(({data,loading})=>{
    //   //////console.log("Zoness",data);
    //   this.zones = data['zones'];
    //   //////console.log(this.zones.enabled);

    //   this.service.setZonesDetails(this.zones);
    //   for(let i=0;i<this.zones.length; i++)
    //   {
    //     this.filteredArray.push(this.zones[i]);
    //   }
    //   //////console.log(this.filteredArray);

    //   this.zonesData = this.filteredArray.filter(t=>t.enabled ==true);
    //   //////console.log(this.zonesData);

    // })
  }

  tournament() {
    this.isAllopen = false;
    this.router.navigate(['/Tournament']);
  }
  advertising() {
    this.isAllopen = false;
    this.router.navigate(['/Advertising']);
  }
  fleet() {
    this.isAllopen = false;
    this.router.navigate(['/Fleet']);
  }
  Tabclick(e) {
    this.isOn = true;
    this.tabmenu = e;
  }
  generalTab() {
    this.general = !this.general;
  }
  mapPanel() {
    this.isOn = true;
    this.service.setToggleButton(1);
  }

  Reports(ref) {
    if (ref == 'II' || ref == 'I') {
      this.dialog.open(ReportsComponent, {
        width: 'auto',
        height: 'auto',
        data: ref,
      });
    } else {
      this.dialog.open(ReportsComponent, {
        width: '50vw',
        height: 'auto',
        data: ref,
      });
    }
  }

  Setup(ref) {
    this.dialog.open(SetupComponent, {
      width: 'auto',
      height: 'auto',
      data: ref,
    });
  }

  General(REF) {
    this.dialog.open(GeneralComponent, {
      width: 'auto',
      height: 'auto',
      data: REF,
    });
  }
  zoness(ref) {
    this.dialog.open(ZonesComponent, {
      width: 'auto',
      height: 'auto',
      data: ref,
    });
  }
  msgToMappanel($event) {
    this.panelmessage = $event;
  }
  cartdetails($event) {
    let cartinfo = $event;
    this.cartdata = [...cartinfo];
  }

  SRMapping($event) {
    this.StartRange = $event;
  }
  TimeRange($event) {
    this.Range = $event;
  }
  visibilityStatus($event) {
    this.VisibilityStatus = $event;
  }
  reset($event) {
    this.Reset = $event;
  }
  getNotificationDate(e) {
    this.notificationDate = e;
  }
}
