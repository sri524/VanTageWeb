import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input, OnChanges, SimpleChanges
} from '@angular/core';
// import { ServiceService } from 'src/app/service.service';

import Map from 'ol/Map';
import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { BingMaps, OSM, Stamen, XYZ } from 'ol/source';
import { Layer, Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import DragBox from 'ol/interaction/DragBox';
import Interaction from 'ol/interaction/Interaction';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults, FullScreen, MousePosition, OverviewMap } from 'ol/control';
import ImageLayer from 'ol/layer/Image';

// import coordinates from '../../layerdata/osm-world-airports.json';
import GeometryType from 'ol/geom/GeometryType';
import { add, Coordinate } from 'ol/coordinate';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
// import { ServiceService } from 'src/app/service.service';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { style } from '@angular/animations';
import { Icon, Style, Circle as CircleStyle, Fill, Stroke, } from 'ol/style';
import { features } from 'process';
import { isEmpty } from 'ol/extent';
import { ApiServiceService } from '../../../Core/Providers/api-service/api-service.service';
import MultiPoint from 'ol/geom/MultiPoint';
import { gql, Apollo } from 'apollo-angular';
import { Source } from 'graphql';
import { xml2json } from 'xml-js';
import Static from 'ol/source/ImageStatic';
import { transform, transformExtent, Projection } from 'ol/proj';
import { getCenter } from 'ol/extent';
import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../../Shared/popup/popup.component';
import { DatePipe } from '@angular/common'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxSpinnerService } from "ngx-spinner";
import DoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import * as moment from 'moment';
import WKT from 'ol/format/WKT';
import {
  Modify,
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction';
import { Vector } from 'ol/feature'
import "ol/ol.css";


const getZonesDetails = gql`
query($id :ID!){
  zonesActionZones(installationId :$id)
  {
     shape
      actionZoneType
      alertsPriority
      id
      enabled
      name
  }
}
 `
const getWorkDetails = gql`
query($id :ID!) 
{ 
   zonesWorkZones(installationId: $id) 
   { 
     shape
     alertPriority
     id
     enabled
     name
   } 
}`

const workZoneDetails = gql`
query($id :ID!) 

{ 

  workZoneById(zoneId:$id) 

  { 

    name 
     workZoneType
     alertPriority
     subNameAssociation
      vehicles
       workZoneType
        workgroups
         workingId
          __typename
        alerts{
           enabled
           parameter
            type
        }
         allgroups
          direction
           enabled
            name
             nameAssociation
              shape
              id
  } 

} 
`

const courseImage = gql`
query($id :ID!) 
{ 
installationContents(installationId:$id) 
{ 
installationId 
installationContentFnvId 
  } 
} 
`
const RestirctedZoneDetails = gql`
query($id :ID!) 

{ 

  zonesActionZoneById(zoneId:$id) 

  { 

    name 
     actionZoneType
    actions{ delaySeconds
     durationSeconds
      enabled
      metadata
       order
        type
        }
        direction
         alertsPriority
     alerts{ enabled
      parameter
       type
       }
     shape  
     association
     enabled
     id
     updateTime
     vehicles
     workingId
  } 

} 
`
const getCourses = gql`
query($id :ID!) 
{ 
  courses(installationId:$id) 
{ 
  holeCount
  id
  name
  } 
} 
`

const Trails = gql`
query ($tagId:ID!,$start:DateTime!,$end:DateTime!,$zoonLevel:Int!)
{ 
  trails(tagId:$tagId, 
         start:$start, 
        end:$end,
        zoonLevel:$zoonLevel) 
  { 
    tagId 
    time 
    position 
    sats
    hdop
    hpeCm
  } 
} `

const tagPosition = gql`
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

const getFecilityZones = gql`

query($id :ID!) 

{ 

  zonesFacilityZones(installationId: $id) 

   { 

    facilityZoneType

       enabled

        id

         label

          name

           shape

            workingId

   } 

}`

const zoneCreation = gql`
mutation ($installationID:ID!, $name:String, $shape:String, $updateTime :DateTime!, $enabled :Boolean!, $zoneType :ZoneType!, $zoneSubType:Int!, $label :String, $actionDirectionType : ActionDirectionType!,
  $alertPriorityType:AlertPriorityType!, $vechicleTypes : Int!, $location : String, $area: String, $allWorkGroups : Boolean!, $emailalert:ActionZoneAlertType!, $emailaddress:String, $isEmail :Boolean!, $smsalert:ActionZoneAlertType!,
  $isSMS:Boolean!, $notificationalert:ActionZoneAlertType!, $isNotification:Boolean!, $lockalert: ActionZoneAlertType! ,$isLock:Boolean!, $buzzeralert :ActionZoneAlertType!, $isBuzzer:Boolean!, $messagealert:ActionZoneAlertType!,
  $isMessage:Boolean!, $delaySec:Int!, $durationSec:Int!  )

{ 

  zoneCreate( 

    
     input:[
       {
          installationID:$installationID 
     name:$name

     shape:$shape 

     updateTime:$updateTime

     enabled:$enabled     

     zoneType:  $zoneType 

     zoneSubType: $zoneSubType

     label:$label

     actionDirectionType:$actionDirectionType 

     alertPriorityType:$alertPriorityType

     vechicleTypes:$vechicleTypes 

     location:$location

     area:$area

     allWorkGroups:$allWorkGroups 

     emailalert:$emailalert 

     emailaddress:$emailaddress

     isEmail:$isEmail 

     smsalert:$smsalert 

     isSMS:$isSMS 

     notificationalert:$notificationalert 

     isNotification:$isNotification 

     lockalert:$lockalert 

     isLock:$isLock 

     buzzeralert:$buzzeralert 

     isBuzzer:$isBuzzer 

     messagealert:$messagealert 

     isMessage:$isMessage 

     delaySec:$delaySec

     durationSec:$durationSec
       }
      ]

  )  

} 
`

const zoneUpdation = gql`
mutation ($id:ID!, $installationID:ID!, $name:String, $shape:String, $updateTime :DateTime!, $enabled :Boolean!, $zoneType :ZoneType!, $zoneSubType:Int!, $label :String, $actionDirectionType : ActionDirectionType!,
  $alertPriorityType:AlertPriorityType!, $vechicleTypes : Int!, $location : String, $area: String, $allWorkGroups : Boolean!, $emailalert:ActionZoneAlertType!, $emailaddress:String, $isEmail :Boolean!, $smsalert:ActionZoneAlertType!,
  $isSMS:Boolean!, $notificationalert:ActionZoneAlertType!, $isNotification:Boolean!, $lockalert: ActionZoneAlertType! ,$isLock:Boolean!, $buzzeralert :ActionZoneAlertType!, $isBuzzer:Boolean!, $messagealert:ActionZoneAlertType!,
  $isMessage:Boolean!, $delaySec:Int!, $durationSec:Int!  )

{ 

  zoneUpdate( 

    
     input:
       {
      id:$id

     installationID:$installationID 

     name:$name

     shape:$shape 

     updateTime:$updateTime

     enabled:$enabled     

     zoneType:  $zoneType 

     zoneSubType: $zoneSubType

     label:$label

     actionDirectionType:$actionDirectionType 

     alertPriorityType:$alertPriorityType

     vechicleTypes:$vechicleTypes 

     location:$location

     area:$area

     allWorkGroups:$allWorkGroups 

     emailalert:$emailalert 

     emailaddress:$emailaddress

     isEmail:$isEmail 

     smsalert:$smsalert 

     isSMS:$isSMS 

     notificationalert:$notificationalert 

     isNotification:$isNotification 

     lockalert:$lockalert 

     isLock:$isLock 

     buzzeralert:$buzzeralert 

     isBuzzer:$isBuzzer 

     messagealert:$messagealert 

     isMessage:$isMessage 

     delaySec:$delaySec

     durationSec:$durationSec
       }
      

  )  

}`



@Component({
  selector: 'app-dsg',
  templateUrl: './dsg.component.html',
  styleUrls: ['./dsg.component.css']
})
export class DsgComponent implements OnInit, OnChanges {
  map: any;
  draw: any;
  value: any;
  binding: any;
  dragSource: any;
  coordinatesArray: any = [];
  result: any = []
  // data: any = this.countryList;
  coordinates: any = []
  latitude1;
  longitude1;
  latitude2;
  longitude2;
  zoomLat;
  zoomLng;
  courseLngLat: any = []
  @ViewChild('popupCoordinates') popupCoordinates!: ElementRef;
  data: any;
  marker: any;
  coords: any;
  lat: number;
  lng: number;
  clickMouse: any;
  info: boolean = true;
  clickedCordinates: any;
  popup: Overlay;
  coordinatesarr: any;
  dummy: any = [];
  boundsData: any;
  bounds: any;
  tempZones: any = [];
  dataBounds: any = [];
  drawSource: any;
  drawLayer: any;
  test: any = [];
  installation_Id: any;
  zoneValue: any;
  sampleData: any = []
  layer: VectorLayer;
  geojsonObject: any;
  instId: any;
  courseImageData: any = []
  staticImageLayer: any;
  restrictLayer: VectorLayer
  workLayer: VectorLayer
  courseimageId: any;
  instContFnvId: any;
  hashId: any;
  imageUrl: any;
  stylepolygon: any = [];
  drawInteraction: any;
  showZone: boolean = false;
  featureInfo: any;
  selected = null;
  ZonesData: any;
  zoneForm: FormGroup;
  txtzonename: any;
  showimage: any;
  alertsselect: any;
  showhole: boolean;
  showVehicletime: boolean;
  loader: boolean = false
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
    { itemval: 2, itemimg: '../../../assets/VTAG_Images/player_badge.png', itemName: 'Players', isSelected: false }]
  tagPointArray: any;
  tagPoint: any;
  dummy1: any;
  totalClickedCordinates: any = [];
  drawWorkInteraction: any;
  drawWorkLayer: any;
  coursearray: any[];
  countarray: any[];
  restrictnewLayer: any;
  markersList: any = [];
  drawhomeLayer: any;
  drawHomeInteraction: any;
  drawGeoInteraction: any;
  drawGeoLayer: any;
  markerStyle: any;
  markerVectorLayer: any;
  iconFeature: any
  dummy2: any = [];
  iconFeatures: any[];

  //  TRAILS

  TrailDataArrow: any = [];
  TrailsData: any = [];
  TrailsCoordinates: VectorLayer;
  TrailsPlotting: VectorLayer
  @Input() cartdata: any[];
  @Input() StartRange: any;
  @Input() Range: any;

  @Input() VisibilityStatus: any;
  @Input() TimeOffset: any;
  @Input() Reset: any;
  markerTrailLayer: VectorLayer
  TrailSource: any;
  markerTrailLayerArrow: VectorLayer;
  TrailsCartData: any;
  Trailcart: any = [];
  TrailDataSourse: any;
  TrailDataLayer: VectorLayer;
  TrailDataSourseArrow: any;
  TrailDataLayerArrow: VectorLayer
  markerVectorLayerData: VectorLayer
  markerVectorLayerTrail: VectorLayer
  fecilityLayer: VectorLayer;
  ResetVal: any;
  markersTrailList: any = [];
  marks: any = [];
  finalCartArray: any[];
  totalTagsData: any[];
  cartsList: any[];
  totalTags: any[];
  tagsLayer: any;
  cartStyle: any;

  @Input() notificationDate: any;
  @Input() rightpanelCartdata: any = [];
  wktformat: any = "";
  vehicletypesVals: any = 0;
  dsgzoneId: any = '';
  editwktFormat: any = ""
  public finalpolygonresult: any;
  addwktformat: any = '';
  selectedcoordinates: any = [];
  select: any = '';
  modify: any = '';
  modifiedFeatures: any = [];
  TrailLayerArrow: VectorLayer
  TrailLayer: VectorLayer
  allTags: any = [];
  dummyLayer:VectorLayer;
  constructor(private service: ApiServiceService, private apollo: Apollo, private formBuilder: FormBuilder, private dialog: MatDialog, private datepipe: DatePipe, private spinner: NgxSpinnerService) {
    this.clearZonepopup();
    this.zoneValue = 0;

  }


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.Reset != undefined) {
      this.ResetVal = this.Reset
    }

    if (changes.Range != undefined && this.cartdata.length > 0) {
      this.loadingTrails(this.Range)
    }
    if (changes.VisibilityStatus != undefined) {
      if (changes.VisibilityStatus.currentValue == '0') {
        this.service.SetHideShowData({ obj: 'H' })
      }
      if (changes.VisibilityStatus.currentValue == '1') {
        this.service.SetHideShowData({ obj: 'S' })
      }
      if (changes.VisibilityStatus.currentValue == '2') {
        this.service.SetHideShowData({ obj: 'HO' })
      }
    }

    if (changes.notificationDate != undefined) {
      if (this.notificationDate != "")

        this.loadingrightPanelCart();
    }


    if (changes.closepace != undefined) {
      this.map.removeLayer(this.fecilityLayer);
      this.zoneValue = ""
    }
  }


  ngOnInit(): void {
    this.zoneValue = "";
  }
  ngAfterViewInit(): void {
    this.selectedcoordinates = [];
    this.service.getTagDetails().subscribe(data => {
      console.log(data);
      this.allTags = data.obj.tags;
      console.log(this.allTags);

    })
    this.tagLocation()
    this.installation_Id = '';
    this.service.getMouseValue().subscribe(response => {
      this.clickMouse = response;
      if (this.clickMouse == 1) {
        const drawSource = new VectorSource({ wrapX: false });
        this.drawLayer = new VectorLayer({
          source: drawSource,
          zIndex: 10
        });

        this.drawInteraction = new Draw({
          source: drawSource,
          type: GeometryType.POLYGON,
          freehand: false,
        });

        this.drawInteraction.on('drawend', (e) => {
          //console.log(e);
          this.popupCoordinates.nativeElement.style.display = 'block';
          const parser = new GeoJSON();
          const drawnFeatures = parser.writeFeaturesObject([e.feature]);
          this.coordinatesArray = parser.writeFeatureObject(e.feature);
          this.popupCoordinates.nativeElement.innerHTML = this.coordinatesArray.geometry.coordinates;
          for (var s = 0; s < this.coordinatesArray.geometry.coordinates[0].length; s++)
            this.selectedcoordinates.push(this.coordinatesArray.geometry.coordinates[0][s]);
          this.popup.setPosition(this.clickedCordinates);
          this.clearZonepopup();
          this.showZone = true;
          this.map.removeInteraction(this.drawInteraction)
        });
        this.map.addInteraction(this.drawInteraction);
        this.map.addLayer(this.drawLayer);
      }
      else if (this.clickMouse == 2) {
        const drawSource = new VectorSource({ wrapX: false });
        this.drawWorkLayer = new VectorLayer({
          source: drawSource,
          zIndex: 10
        });
        this.drawWorkInteraction = new Draw({
          source: drawSource,
          type: GeometryType.POLYGON,
          freehand: false,
        });

        this.drawWorkInteraction.on('drawend', (e) => {
          this.popupCoordinates.nativeElement.style.display = 'block';
          const parser = new GeoJSON();
          const drawnFeatures = parser.writeFeaturesObject([e.feature]);
          this.coordinatesArray = parser.writeFeatureObject(e.feature);
          this.popupCoordinates.nativeElement.innerHTML = this.coordinatesArray.geometry.coordinates;
          for (var s = 0; s < this.coordinatesArray.geometry.coordinates[0].length; s++)
            this.selectedcoordinates.push(this.coordinatesArray.geometry.coordinates[0][s]);
          this.popup.setPosition(this.clickedCordinates);
          this.clearZonepopup();
          this.getcourses();
          this.showZone = true;
          this.map.removeInteraction(this.drawWorkInteraction)
        });
        this.map.addInteraction(this.drawWorkInteraction);
        this.map.addLayer(this.drawWorkLayer)
      }

      else if (this.clickMouse == 3) {
        const drawGeoSource = new VectorSource({ wrapX: false });
        this.drawGeoLayer = new VectorLayer({
          source: drawGeoSource,
          zIndex: 10,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.9)'
            }),
            stroke: new Stroke({
              color: '#ccff33',
              width: 2
            })
          })
        });
        this.drawGeoInteraction = new Draw({
          source: drawGeoSource,
          type: GeometryType.POLYGON,
          freehand: false,
          style: new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.5)'
            }),
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffcc33'
              })
            })
          })
        });

        this.drawGeoInteraction.on('drawend', (e) => {
          this.popupCoordinates.nativeElement.style.display = 'block';
          const parser = new GeoJSON();
          const drawnFeatures = parser.writeFeaturesObject([e.feature]);
          this.coordinatesArray = parser.writeFeatureObject(e.feature);
          this.popupCoordinates.nativeElement.innerHTML = this.coordinatesArray.geometry.coordinates;
          this.popup.setPosition(this.clickedCordinates);
          this.clearZonepopup();
          this.getcourses();
          this.showZone = true;
          this.map.removeInteraction(this.drawGeoInteraction)
        });
        this.map.addInteraction(this.drawGeoInteraction);
        this.map.addLayer(this.drawGeoLayer)
      }
      else if (this.clickMouse == 4) {
        const drawSource = new VectorSource({ wrapX: false });
        this.drawhomeLayer = new VectorLayer({
          source: drawSource,
          zIndex: 10
        });
        this.drawHomeInteraction = new Draw({
          source: drawSource,
          type: GeometryType.POLYGON,
          freehand: false,
        });
        this.drawHomeInteraction.on('drawend', (e) => {
          this.popupCoordinates.nativeElement.style.display = 'block';
          const parser = new GeoJSON();
          const drawnFeatures = parser.writeFeaturesObject([e.feature]);
          this.coordinatesArray = parser.writeFeatureObject(e.feature);
          this.popupCoordinates.nativeElement.innerHTML = this.coordinatesArray.geometry.coordinates;
          this.popup.setPosition(this.clickedCordinates);
          this.clearZonepopup();
          this.getcourses();
          this.showZone = true;
          this.map.removeInteraction(this.drawHomeInteraction)
        });
        this.map.addInteraction(this.drawHomeInteraction);
        this.map.addLayer(this.drawhomeLayer)
      }
    })
    //  *****************************     Getting Map Coordinates Data  ************************* 
    this.service.getMapcoordinates().subscribe(data => {
      //console.log(data);
      if (this.map != undefined) {
        this.zoneValue = "";
        this.geojsonObject = '';
        this.result = data;
        if (this.result.obj != '') {
          this.dummy = this.result.obj;
          this.boundsData = this.dummy.region.bounds;
          this.bounds = this.boundsData.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
          this.coordinatesarr = this.bounds.split(" ");
          this.courseGetImage(this.result.obj.id);
        }
        this.map.removeLayer(this.restrictLayer)
        this.map.removeLayer(this.workLayer)
        this.ResetVal = 'Yes'
      }
      else {
        this.zoneValue = "";
        this.geojsonObject = '';
        this.result = data;
        if (this.result.obj != '') {
          this.dummy = this.result.obj;
          this.boundsData = this.dummy.region.bounds;
          this.bounds = this.boundsData.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
          this.coordinatesarr = this.bounds.split(" ");
          this.courseGetImage(this.result.obj.id);
        }
      }
    })
    // **********************************    Getting InstallationId for restricted and work Zones  *****************
    this.service.InsIdget().subscribe(data => {
      this.zoneValue = data['value']
      if (data['value'] == 1) {
        this.installation_Id = data['id'];
        this.clickMouse = 0
        this.zones();
      }
      else if (data['value'] == 2) {
        this.installation_Id = data['id'];
        this.clickMouse = 0
        this.zones();
      }
    })


    this.service.getShowTags().subscribe(data => {
      //console.log(data);
      if (data.value == 1) {
        this.finalCartArray = [];
        this.totalTagsData = [];
        this.totalTagsData = data.tags;
        this.cartsList = [];
        this.totalTags = []
        for (let i = 0; i < this.totalTagsData.length; i++) {
          this.totalTags[i] = this.totalTagsData[i].location.position.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
        }

        if (this.map) {
          this.map.removeLayer(this.tagsLayer)
        }

        //console.log(this.totalTags);
        this.cartStyle = new Style({

          image: new Icon({
            src: '../../../../assets/carts/cart-50.png',
            scale: 0.8,
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',

          })

        });
        //console.log(this.cartStyle);

        for (let i = 0; i < this.totalTags.length; i++) {
          this.cartsList[i] = new Feature({
            geometry: new Point(fromLonLat([this.totalTags[i][0][0], this.totalTags[i][0][1]], "EPSG:4326", "EPSG:3857")),
          });
          this.cartsList[i].setStyle(this.cartStyle);
        }
        //console.log(this.cartsList);

        var carts = new VectorSource({
          features: this.cartsList
        });
        this.tagsLayer = new VectorLayer({
          source: carts,
          zIndex: 10
        });
        if (this.map) {
          this.map.addLayer(this.tagsLayer);
        }
      }


    })

    this.service.getTagData().subscribe(data => {
      this.dummy1 = data;
      this.cartBinding();
    })
    this.service.GetTrailsRelatedCartData().subscribe(data => {
      this.TrailsCartData = data.obj;
      //console.log(this.TrailsCartData)
      if (this.TrailsCartData.length == 0) {
        if (this.TrailDataLayer != undefined) {
          this.map.removeLayer(this.TrailDataLayer)
          this.map.removeLayer(this.TrailDataLayerArrow)
          this.map.removeLayer(this.markerVectorLayerData)

        }
        this.markersTrailList = []
      }
      else {
        this.markersTrailList = []
        this.spinner.show();
        this.Trailcart = []
        this.loadingTrails(this.Range)
      }


    })

    this.service.getInsId().subscribe(data => {
      this.installation_Id = data;
    });

    this.service.getpaceClose().subscribe(data => {
      if (data.Open == 'close') {
        this.map.removeLayer(this.workLayer)
        this.map.removeLayer(this.restrictLayer);
        this.map.removeLayer(this.fecilityLayer);
        this.zoneValue = "";
        // this.paceClick="";
      }
      else if (data.Open == 'open') {
        if (this.installation_Id != '') {
          this.zoneValue = 3;

          this.zones();
        }

      }
    });
  }



  ResetMap() {
    this.ResetVal = 'Yes'
    let ResetTrail: any = []
    //console.log(this.cartdata)
    if (this.cartdata.length > 0) {
      // if(this.TrailLayer!=undefined){
      //   this.map.removeLayer(this.TrailLayer)
      //   this.map.removeLayer(this.TrailLayerArrow)
      //   this.map.removeLayer(this.markerVectorLayerTrail)
      // }
      if (this.TrailDataLayer != undefined) {
        this.map.removeLayer(this.TrailDataLayer)
        this.map.removeLayer(this.TrailDataLayerArrow)
        this.map.removeLayer(this.markerVectorLayerData);
      }
      this.apollo.use('live').watchQuery({
        query: tagPosition,
        variables: {
          id: this.cartdata[this.cartdata.length - 1].id
        }
      }).valueChanges.subscribe(data => {
        //console.log(data)
        this.service.SetHideShowData({ obj: 'H' })
        ResetTrail = data
        let res = ResetTrail.data.tags[0].location.position.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
        //console.log(res)   
        navigator.geolocation.getCurrentPosition((pos) => {
          this.map.getView().animate({
            center: [res[0][0], res[0][1]],
            layers: [
              new TileLayer({
                source: new BingMaps({
                  key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                  imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
                }),
              }),
            ],
          })
        })
      })
    }
  }
  markers: any = []
  loadingTrails(range) {
    console.log(range)
    this.markersList = []
    let trailconstant: any = []
    let trailconst: any = []
    let cartdata: any = []
    let TrailExitPoint: any = []
    this.Trailcart = []
    this.marks = []
    console.log(this.TrailsCartData)
    if (range == undefined) {
      var date = new Date()
      var time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
      var day = this.datepipe.transform(date, 'yyyy-MM-dd');
      const dt = day;
      const [yyyy, mm, dd] = dt.split('/')
      const etime = time;
      var edate = `${yyyy}T${etime}.0000Z`;
      console.log(edate);
      const stime = '00:00:00';
      var sdate = `${yyyy}T${stime}.0000Z`;
      console.log(sdate);
    }
    else {
      let startVariable = this.datepipe.transform(this.Range[0], 'yyyy-MM-dd');
      let startVariablet = this.Range[0].substring(10, 19)
      let endVariable = this.Range[1].substring(10, 19)
      const dt = startVariable;
      const [yyyy, mm, dd] = dt.split('/')
      const stime = startVariablet;
      var sdate = `${yyyy}T${stime}.0000Z`;
      console.log(sdate);
      const etime = endVariable;
      var edate = `${yyyy}T${etime}.0000Z`;
      console.log(edate);
    }
    this.Trailcart = []
    for (let i = 0; i < this.TrailsCartData.length; i++) {
      this.apollo.use('live').watchQuery({
        query: tagPosition,
        variables: {
          id: this.TrailsCartData[i].id
        }
      }).valueChanges.subscribe(data => {
        console.log(data)
        trailconst = data
        trailconstant.push(trailconst.data.tags)
        console.log(trailconstant)
      })
      this.apollo.use('live').watchQuery({ query: Trails, variables: { tagId: this.TrailsCartData[i].id, start: sdate, end: edate, zoonLevel: 2 } }).valueChanges.subscribe(({ data, loading }) => {
        // this.Trailcart=[]  
        console.log('id', this.TrailsCartData[i].id)
        console.log('startDate', sdate)
        console.log('endDate', edate)
        console.log(data)
        this.spinner.hide()

        cartdata = data
        let markersList: any = [];
        if (this.TrailDataLayer != undefined) {
          this.map.removeLayer(this.TrailDataLayer)
          this.map.removeLayer(this.TrailDataLayerArrow)
          markersList = []
          this.map.removeLayer(this.markerVectorLayerData)
        }
        if (cartdata.trails[0] != undefined) {
          if (cartdata.trails[0].tagId == this.TrailsCartData[i].id) {
            this.Trailcart.push(cartdata.trails)
            console.log(this.Trailcart)
            console.log(this.TrailsCartData.length)
            if (this.Trailcart.length == this.TrailsCartData.length) {
              let traildata: any = []
              let trailfinal: any = []
              let trailfinalArrow: any = []
              trailconstant.forEach((val, i) => {
                let res = val[0].location.position.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
                let cc = res[0].map(ele => parseFloat(ele))
                TrailExitPoint.push(cc)
                console.log(TrailExitPoint)
              })
              let cart = JSON.parse(JSON.stringify(this.Trailcart));
              console.log(this.Trailcart)
              cart.forEach((val, i) => {
                this.TrailsCartData.forEach((ele, j) => {
                  if (val.length != 0) {
                    if (val[i].tagId == ele.id) {
                      val.priority = ele.color
                    }
                  }
                  if (val.length == 0) {
                    val.priority = ''
                  }
                })
              })
              console.log(cart)
              this.Trailcart = cart
              let MultiTrail = { tagid: '', cor: [], priority: '', Arrowc: [], time: [], sats: [], hdop: [], hpeCm: [] }
              let res: any = []
              console.log(this.Trailcart)
              this.Trailcart.forEach((val, i) => {
                MultiTrail = { tagid: '', cor: [], priority: '', Arrowc: [], time: [], sats: [], hdop: [], hpeCm: [] }
                if (val.length > 0) {
                  val.forEach((ele, j) => {
                    let res = ele.position.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
                    let cc = res[0].map(ele => parseFloat(ele))
                    MultiTrail.cor.push(cc)
                    if (j % 20 == 0) {
                      MultiTrail.Arrowc.push(cc)
                      MultiTrail.time.push(ele.time)
                      MultiTrail.sats.push(ele.sats)
                      MultiTrail.hdop.push(ele.hdop)
                      MultiTrail.hpeCm.push(ele.hpeCm)
                    }
                  })
                  MultiTrail.tagid = val[i].tagId,
                    //  abc.time = val[i].time,
                    MultiTrail.priority = val.priority
                  traildata.push(MultiTrail)
                  console.log(traildata)
                }
              })
              traildata.forEach((val, i) => {
                TrailExitPoint.forEach((ele, j) => {
                  if (i == j) {
                    val.cor.push(ele)
                  }
                })
              })
              console.log(traildata)
              for (let i = 0; i < traildata.length; i++) {
                trailfinal.push({
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    coordinates:
                      traildata[i].cor
                  },
                  "properties": { "TagId": traildata[i].tagid, "suitability": traildata[i].priority }
                })
              }
              console.log(trailfinal)
              const geojsonObjectTrail = {
                type: 'FeatureCollection',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'EPSG:3857',
                  },
                },
                'features': trailfinal
              };
              console.log(geojsonObjectTrail)
              navigator.geolocation.getCurrentPosition((pos) => {
                this.map.getView().animate({
                  center: [traildata[0].cor[0][0], traildata[0].cor[0][1]],
                  layers: [
                    new TileLayer({
                      source: new BingMaps({
                        key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                        imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
                      }),
                    }),
                  ],
                })
              })
              this.TrailDataSourse = new VectorSource({
                features: new GeoJSON().readFeatures(geojsonObjectTrail, { dataProjection: 'EPSG: 3857' })
              });
              this.TrailDataLayer = new VectorLayer({
                source: this.TrailDataSourse,
                style: this.styleTrailFunction,
                zIndex: 10,
              });
              this.map.addLayer(this.TrailDataLayer)
              console.log(traildata)
              for (let i = 0; i < traildata.length; i++) {
                console.log(traildata)
                trailfinalArrow.push({
                  type: 'Feature',
                  geometry: {
                    type: 'LineString',
                    id: '1',
                    coordinates:
                      traildata[i].Arrowc
                  },
                  "properties": { "TagId": traildata[i].tagid, "suitability": traildata[i].priority, 'Range': 'B' }
                })
              }
              const geojsonObjectTrailArrow = {
                type: 'FeatureCollection',
                crs: {
                  type: 'name',
                  properties: {
                    name: 'EPSG:3857',
                  },
                },
                'features': trailfinalArrow
              };
              console.log(geojsonObjectTrailArrow)
              this.TrailDataSourseArrow = new VectorSource({
                features: new GeoJSON().readFeatures(geojsonObjectTrailArrow, { dataProjection: 'EPSG: 3857' })
              });
              this.TrailDataLayerArrow = new VectorLayer({
                source: this.TrailDataSourseArrow,
                style: this.styleTrailFunctionArrow,
                zIndex: 10,
              });
              this.map.addLayer(this.TrailDataLayerArrow)
              traildata.forEach(val => {
                this.marks.push({ 'mark': val.Arrowc, 'time': val.time, 'sats': val.sats, 'hdop': val.hdop, 'hpeCm': val.hpeCm })
              })
              console.log(this.marks)
              let count = 0
              for (var p = 0; p < this.marks.length; p++) {
                for (var j = 0; j < this.marks[p].mark.length; j++) {
                  let date = this.marks[p].time[j];
                  let offset = this.TimeOffset;
                  let LocaloffsetTime = moment(date, 'YYYY-MM-DDTHH:mm:ss.000').add(offset, 'hours').format('HH:mm:ss');
                  let utcTime = moment(date, 'HH:mm:ss').format('HH:mm:ss')
                  this.markersTrailList[count] = new Feature({
                    geometry: new Point(fromLonLat([this.marks[p].mark[j][0], this.marks[p].mark[j][1]], "EPSG:4326", "EPSG:3857")),
                    // Time: marks[p].time[j],
                    UTime: utcTime,
                    LTime: LocaloffsetTime,
                    Sats: this.marks[p].sats[j],
                    Hdop: this.marks[p].hdop[j],
                    HpeCm: this.marks[p].hpeCm[j],
                    'Range': 'A'
                  });
                  // console.log(markersList)
                  count++
                }
              }
              this.markers = new VectorSource({
                features: this.markersTrailList
              });
              this.markerVectorLayerData = new VectorLayer({
                source: this.markers,
                zIndex: 1
              });
              this.map.addLayer(this.markerVectorLayerData);
              const container = document.getElementById('popup');
              const content = document.getElementById('popup-content');
              this.map.on('pointermove', (e) => {
                this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '';
                overlay.setPosition(undefined)
                var featureinfo
                var featureInfo = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                  featureinfo = feature;
                  return feature;
                });
                if (featureInfo != undefined) {
                  if (featureInfo.values_.Range == 'A') {
                    let clickedCoordinate = e.coordinate;
                    overlay.setPosition(clickedCoordinate);
                    console.log(featureInfo)
                    content.innerHTML = '<p> [ UTC: ' + featureinfo.values_.UTime + ' ' + ' L: ' + featureinfo.values_.LTime + ' ]' + '<br>' + 'sats ' + ' [' + featureinfo.values_.Sats + '] ' + ' hdop ' + ' [' + featureinfo.values_.Hdop + ']' + ' ehpe ' + '[ ' + featureinfo.values_.HpeCm + ' ] ' + '</p>'
                  }
                }
              })
              const overlay = new Overlay({
                element: container,
                offset: [0, -50]
              });
              this.map.addOverlay(overlay)
            }
          }
        }
        if (cartdata.trails[0] == undefined || cartdata.trails.length == 0) {
          this.Trailcart.push(cartdata.trails)
        }
      })
    }
    this.Trailcart = []
  }




  styleTrailFunction(feature) {
    var styles = ""
    if (feature.get('suitability') == 0) {
      styles = new Style({
        type: 'LineString',
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
      })

    }
    else if (feature.get('suitability') == 2) {

      styles = new Style({
        type: 'LineString',

        stroke: new Stroke({
          color: 'rgb(236, 118, 8)',
          width: 2,
        }),
      })

    }

    else if (feature.get('suitability') == 1) {
      styles = new Style({
        type: 'LineString',

        stroke: new Stroke({
          color: 'blue',
          width: 2,
        }),
      })
    }
    else if (feature.get('suitability') == 3) {

      styles = new Style({
        type: 'LineString',

        stroke: new Stroke({
          color: 'magenta',
          width: 2,
        }),
      })

    }

    else if (feature.get('suitability') == 4) {
      styles = new Style({
        type: 'LineString',

        stroke: new Stroke({
          color: 'pink',
          width: 2,
        }),
      })
    }
    else if (feature.get('suitability') == 5) {
      styles = new Style({
        type: 'LineString',

        stroke: new Stroke({
          color: 'orange',
          width: 2,
        }),
      })
    }
    return styles
  }
  styleTrailFunctionArrow(feature) {

    var stylesArrow = [];

    if (feature.get('suitability') == 0) {
      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'red',
              //  size: [90, 50],

            }),
          })
        );
      });

    }
    else if (feature.get('suitability') == 2) {

      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'rgb(236, 118, 8)',
              //  size: [90, 50],

            }),
          })
        );
      });

    }

    else if (feature.get('suitability') == 1) {
      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'blue',
              //  size: [90, 50],

            }),
          })
        );
      });
    }
    else if (feature.get('suitability') == 3) {

      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'magenta',
              //  size: [90, 50],

            }),
          })
        );
      });

    }

    else if (feature.get('suitability') == 4) {
      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'pink',
              //  size: [90, 50],

            }),
          })
        );
      });
    }
    else if (feature.get('suitability') == 5) {
      const geometry = feature.getGeometry();
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const rotation = Math.atan2(dy, dx);
        // arrows
        stylesArrow.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: '../../../assets/carts/arrow.png',
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
              color: 'orange',
              //  size: [90, 50],

            }),
          })
        );
      });
    }
    return stylesArrow
  }


  tagLocation() {
    this.service.getLocationTagData().subscribe(data => {
      //console.log(data);
      if (data.value == "tagLocation") {
        const cartData = data;
        const currentLocation = cartData.obj.location.position;
        const currentTagCoordinates = currentLocation.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        //console.log(currentTagCoordinates);
        const cartLngLat = currentTagCoordinates.split(" ");
        //console.log(cartLngLat);


        if (this.map) {
          navigator.geolocation.getCurrentPosition((pos) => {
            this.map.getView().animate({
              center: [cartLngLat[1], cartLngLat[2]],
              layers: [
                new TileLayer({
                  source: new BingMaps({
                    key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                    imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
                  }),
                }),

              ],
            })
          })
        }

      }

    })
  }


  // Clear Zones Details


  clearZonepopup() {
    this.alertsselect = false;
    var zonetype = 1;
    if (this.zoneValue == 1)
      zonetype = 2;
    else
      zonetype = 1;
    this.zoneForm = this.formBuilder.group({
      txtzonename: [''],
      ddltype: [zonetype],
      txthole: [''],
      ddlgraceperiod: ['0'],
      ddlunlock: ['0'],
      chkEnable: [false],
      chkbuzzer: [false],
      chkenter: [false],
      chkexit: [false],
      rdpriority: [false],
      chkalarm: [false],
      chkemail: [false],
      txtemail: [''],
      chkstopveh: [false],
      chkallvh: [false],
      ddllocation: ['0'],
      ddlarea: ['0'],
      chkallgrs: [false],

    });
    this.uncheckAll();
    this.wktformat = "";
    this.dsgzoneId = "";
  }


  // ********************************    Restricted And Work Zones Function    ****************************
  zones() {
    this.showZone = false;
    this.map.removeInteraction(this.select);
    this.map.removeInteraction(this.modify);

    this.sampleData = []
    this.showZone = false;
    if (this.zoneValue == 1) {
      this.map.removeLayer(this.workLayer)
      this.map.removeLayer(this.restrictLayer)
      this.apollo.watchQuery({ query: getZonesDetails, variables: { id: this.installation_Id }, fetchPolicy: 'network-only' }).valueChanges.subscribe(({ data, loading }) => {

        //  this.zones = data['zones'];

        this.sampleData = data['zonesActionZones'];
        //console.log(this.sampleData);

        this.initilizeMap();
      });
    }
    else if (this.zoneValue == 2) {
      this.map.removeLayer(this.workLayer)
      this.map.removeLayer(this.restrictLayer)

      this.apollo.watchQuery({ query: getWorkDetails, variables: { id: this.installation_Id }, fetchPolicy: 'network-only' }).valueChanges.subscribe(({ data, loading }) => {

        //  this.zones = data['zones'];

        this.sampleData = data['zonesWorkZones'];
        //console.log(this.sampleData);

        this.initilizeMap();
      });
    }

    else if (this.zoneValue == 3) {
      this.map.removeLayer(this.workLayer)
      this.map.removeLayer(this.restrictLayer);
      this.map.removeLayer(this.fecilityLayer);

      this.apollo.use('live').watchQuery({ query: getFecilityZones, variables: { id: this.installation_Id } }).valueChanges.subscribe(({ data, loading }) => {

        //  this.zones = data['zones'];
        this.sampleData = data['zonesFacilityZones'];
        //console.log(this.sampleData);

        this.initilizeMap();
      });
    }
  }

  // *****************************************   Getting Course Image and Coordinates  ***************************
  courseGetImage(id) {
    this.spinner.show()
    this.apollo.use('live').watchQuery({ query: courseImage, variables: { id: id } }).valueChanges.subscribe(({ data, loading }) => {
      this.courseimageId = data['installationContents']
      this.instContFnvId = this.courseimageId[0].installationContentFnvId;
      this.service.getHoleImage(this.instContFnvId).subscribe(data => {

        this.courseImageData = xml2json(data, { compact: true, spaces: 4 });
        this.courseImageData = JSON.parse(this.courseImageData);

        if (this.courseImageData.SmartDisplayInstallationManifest.Course[0]) {

          this.hashId = this.courseImageData.SmartDisplayInstallationManifest.Course[0].CourseAreaPicture._attributes.Hash;
        }
        else {
          this.hashId = this.courseImageData.SmartDisplayInstallationManifest.Course.CourseAreaPicture._attributes.Hash;

        }

        this.setHashId(this.hashId);
      })
    });


  }
  setHashId(value) {

    this.service.getImage(value).subscribe(data => {
      const blob = new Blob([data], { type: 'image/png' })
      this.imageUrl = URL.createObjectURL(blob);
      this.initilizeMap();
    })
  }

  cartBinding() {
    const view = new View({});

    if (this.dummy1.value == 1) {
      //console.log(this.dummy1);
      for (let i = 0; i < this.dummy1.obj.length; i++) {
        this.tagPoint = this.dummy1.obj[i].data.tags[0].location.position;
        this.tagPoint = this.tagPoint.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        //console.log(this.tagPoint);
        this.tagPointArray = this.tagPoint.split(" ");
        this.dummy2.push(this.tagPointArray);
        //console.log(this.dummy2);
      }

      this.iconFeatures = [];
      for (let i = 0; i < this.dummy2.length; i++) {
        this.iconFeature =
          new Feature({
            // labelPoint: new Point([this.dummy2[i][1], this.dummy2[i][2]]),
            geometry: new Point([this.dummy2[i][1], this.dummy2[i][2]]),
          })
        const iconStyle = new Style({
          image: new Icon({
            scale: 0.8,
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: '../../../assets/carts/yCart.png',

          }),
        });
        this.iconFeatures.push(this.iconFeature);
        this.iconFeatures.forEach(function (feature) {
          feature.setStyle(iconStyle);
        });
        // this.iconFeatures.setStyle(iconStyle)
      }
      //   //console.log(this.tagPointArray);
      navigator.geolocation.getCurrentPosition((pos) => {
        this.map.getView().animate({
          center: [this.tagPointArray[1], this.tagPointArray[2]],
          layers: [
            new TileLayer({
              source: new BingMaps({
                key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
              }),
            }),

          ],
        })
      })

      const vectorSource = new VectorSource({
        features: this.iconFeatures
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 10

      });

      this.map.addLayer(vectorLayer)
    }
    // if (this.TrailsPlotting.length != 0) {
    //   //  this.tagPoint = this.dummy1.obj.data.tags[0].location.position
    //   //  //console.log(this.tagPoint.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' ')))
    //   //  let cc = this.tagPoint.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))[0].map(ele =>parseFloat(ele))
    //   ////console.log(cc)
    //   // if (this.TrailLayer != undefined) {
    //   //   this.map.removeLayer(this.TrailLayer)
    //   //   this.map.removeLayer(this.TrailLayerArrow)
    //   //   this.map.removeLayer(this.markerVectorLayerTrail)
    //   // }
    //   const stylefun = function (feature) {
    //     const geometry = feature.getGeometry();
    //     const styles = [
    //       // linestring
    //       new Style({
    //         stroke: new Stroke({
    //           color: '#ffcc33',
    //           width: 2,
    //         }),
    //       }),
    //     ]; return styles;
    //   };

    //   var cordinates: any = []
    //   // this.TrailsPlotting.push(cc)
    //   const geojsonObject = {
    //     'type': 'FeatureCollection',
    //     'crs': {
    //       'type': 'name',
    //       'properties': {
    //         'name': 'EPSG:3857',
    //       },
    //     },
    //     'features': [
    //       {
    //         'type': 'Feature',
    //         'geometry': {
    //           'type': 'LineString',
    //           'coordinates': this.TrailsPlotting
    //         },
    //       },
    //     ],
    //   };
    //   //console.log(geojsonObject)
    //   navigator.geolocation.getCurrentPosition((pos) => {
    //     this.map.getView().animate({
    //       center: [this.TrailsPlotting[0][0], this.TrailsPlotting[0][1]],
    //       layers: [
    //         new TileLayer({
    //           source: new BingMaps({
    //             key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
    //             imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
    //           }),
    //         }),

    //       ],
    //     })
    //   })
    //   const TrailSource = new VectorSource({
    //     features: new GeoJSON().readFeatures(geojsonObject),
    //   });
    //   this.TrailLayer = new VectorLayer({
    //     source: TrailSource,
    //     style: stylefun,
    //   });

    //   this.map.addLayer(this.TrailLayer)

    //   let TrailArrow: any = []

    //   for (let i = 0; i < this.TrailDataArrow.length; i++) {
    //     if (i % 10 == 0) {
    //       cordinates.push(this.TrailsPlotting[i])
    //       TrailArrow.push({ 'Marker': this.TrailDataArrow[i].cor, 'Time': this.TrailDataArrow[i].time, 'sats': this.TrailDataArrow[i].sats, 'hdop': this.TrailDataArrow[i].hdop, 'hpeCm': this.TrailDataArrow[i].hpeCm })
    //     }
    //   }
    //   //console.log(TrailArrow)
    //   const styleArrowfun = function (feature) {
    //     const geometry = feature.getGeometry();
    //     const stylesArrow = [];
    //     geometry.forEachSegment(function (start, end) {
    //       const dx = end[0] - start[0];
    //       const dy = end[1] - start[1];
    //       const rotation = Math.atan2(dy, dx);
    //       // arrows
    //       stylesArrow.push(
    //         new Style({
    //           geometry: new Point(end),
    //           image: new Icon({
    //             src: '../../../assets/carts/arrow.png',
    //             anchor: [0.75, 0.5],
    //             rotateWithView: true,
    //             rotation: -rotation,
    //             color: '#ffcc33',
    //           }),
    //         })
    //       );
    //     });
    //     return stylesArrow;
    //   };
    //   const geojsonArrowObject = {
    //     'type': 'FeatureCollection',
    //     'crs': {
    //       'type': 'name',
    //       'properties': {
    //         'name': 'EPSG:3857',
    //       },
    //     },
    //     'features': [
    //       {
    //         'type': 'Feature',
    //         'geometry': {
    //           'type': 'LineString',
    //           'coordinates': cordinates
    //         },
    //         "properties": { "Range": 'B' }

    //       },
    //     ],
    //   };
    //   //console.log(geojsonArrowObject)
    //   const TrailSourceArrow = new VectorSource({
    //     features: new GeoJSON().readFeatures(geojsonArrowObject),
    //   });
    //   this.TrailLayerArrow = new VectorLayer({
    //     source: TrailSourceArrow,
    //     style: styleArrowfun,
    //   });

    //   this.map.addLayer(this.TrailLayerArrow)
    //   let MarkerTrail: any = []
    //   for (var k = 0; k < TrailArrow.length; k++) {
    //     // //console.log(TrailArrow[0].Marker)
    //     let date = TrailArrow[k].Time;
    //     // //console.log(date);
    //     let offset = this.TimeOffset;
    //     // //console.log(offset);
    //     let LocaloffsetTime = moment(date, 'YYYY-MM-DDTHH:mm:ss.000').add(offset, 'hours').format('HH:mm:ss');
    //     let utcTime = moment(date, 'HH:mm:ss').format('HH:mm:ss')
    //     // //console.log(LocaloffsetTime);
    //     // //console.log(utcTime)
    //     MarkerTrail[k] = new Feature({
    //       geometry: new Point(fromLonLat([TrailArrow[k].Marker[0], TrailArrow[k].Marker[1]], "EPSG:4326", "EPSG:3857")),
    //       UTime: utcTime,
    //       LTime: LocaloffsetTime,
    //       Sats: TrailArrow[k].sats,
    //       Hdop: TrailArrow[k].hdop,
    //       HpeCm: TrailArrow[k].hpeCm,
    //       'Range': 'A'
    //     });
    //   }
    //   // //console.log(MarkerTrail)
    //   var markerstrail = new VectorSource({
    //     features: MarkerTrail
    //   });

    //   this.markerVectorLayerTrail = new VectorLayer({
    //     source: markerstrail,
    //     zIndex: 0
    //   });

    //   this.map.addLayer(this.markerVectorLayerTrail);
    //   const container = document.getElementById('popup');
    //   const content = document.getElementById('popup-content');
    //   this.map.on('pointermove', (e) => {
    //     this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(e.pixel) ? 'pointer' : '';
    //     overlay.setPosition(undefined)
    //     var featureinfo
    //     var featureInfo = this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    //       featureinfo = feature;
    //       return feature;
    //     });
    //     if (featureInfo != undefined) {
    //       if (featureInfo.values_.Range == 'A') {
    //         let clickedCoordinate = e.coordinate;
    //         overlay.setPosition(clickedCoordinate);
    //         // content.innerHTML = featureinfo.values_.Time
    //         // content.innerHTML ='<p>' +featureinfo.values_.Time+ '<br>' +'sats '+' ['+featureinfo.values_.Sats+'] '+ ' hdop '+' ['+ featureinfo.values_.Hdop+']'+ ' ehpe ' + '[ ' + featureinfo.values_.HpeCm+ ' ] '+'</p>'
    //         content.innerHTML = '<p> [ UTC: ' + featureinfo.values_.UTime + ' ' + ' L: ' + featureinfo.values_.LTime + ' ]' + '<br>' + 'sats ' + ' [' + featureinfo.values_.Sats + '] ' + ' hdop ' + ' [' + featureinfo.values_.Hdop + ']' + ' ehpe ' + '[ ' + featureinfo.values_.HpeCm + ' ] ' + '</p>'


    //       }
    //     }
    //   })
    //   const overlay = new Overlay({
    //     element: container,
    //     offset: [0, -50]
    //   });
    //   this.map.addOverlay(overlay)


    // }
  }
  vectorLayer(vectorLayer: any) {
    throw new Error('Method not implemented.');
  }
  //   **********************************    Initialize Map   **************************************
  priority: any = []
  dummydata: any = []
  initilizeMap() {

    this.priority = []
    this.test = [];
    this.dummydata = []
    this.geojsonObject = '';
    if (this.zoneValue == 1) {
      for (let i = 0; i < this.sampleData.length; i++) {

        const result = this.sampleData[i].shape.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
        const enable = this.sampleData[i].enabled

        const zonename = this.sampleData[i].name;

        // const prtype = this.sampleData[i].alertsPriority;
        const zoneId = this.sampleData[i].id;
        if (result[0][0] == "") {
          //console.log("if condition")
        }
        else if (this.sampleData[i].actionZoneType == "GEOFENCE") {//console.log("geofence");
        }

        else {
          const prtype = this.sampleData[i].alertsPriority;
          this.test.push({ 'coordinates': result, 'priority': prtype, 'ZoneId': zoneId, 'enabled': enable, 'zoneName': zonename });
        }
      }
      for (let i = 0; i < this.test.length; i++) {
        this.dummydata.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates:
              [this.test[i].coordinates]
          },
          "properties": { "zoneId": this.test[i].ZoneId, "suitability": this.test[i].priority, 'enabled': this.test[i].enabled, 'zoneName': this.test[i].zoneName }

        })
      }
      this.geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3857',
          },
        },
        features:
          this.dummydata
      };
      this.drawSource = new VectorSource({
        features: new GeoJSON().readFeatures(this.geojsonObject, { dataProjection: 'EPSG: 3857', featureProjection: 'EPSG: 3857' })
      });
      this.restrictLayer = new VectorLayer({
        source: this.drawSource,
        zIndex: 210,
        style: this.styleFunction
      });
      this.map.addLayer(this.restrictLayer)
    }
    else if (this.zoneValue == 2) {
      //alert("workZones")
      for (let i = 0; i < this.sampleData.length; i++) {
        const result = this.sampleData[i].shape.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '));
        const prtype = this.sampleData[i].alertPriority;
        const enable = this.sampleData[i].enabled
        const zonename = this.sampleData[i].name;
        const zoneId = this.sampleData[i].id;
        if (result[0][0] == "") {
          //console.log("if condition")
        }
        else {
          this.test.push({ 'coordinates': result, 'priority': prtype, 'ZoneId': zoneId, 'enabled': enable, 'zoneName': zonename });
        }
      }
      for (let k = 0; k < this.test.length; k++) {
        this.dummydata.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates:

              [this.test[k].coordinates]

          },
          "properties": { "zoneId": this.test[k].ZoneId, "suitability": this.test[k].priority, 'enabled': this.test[k].enabled, 'zoneName': this.test[k].zoneName }

        })
      }
      this.geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3857',
          },
        },
        features: this.dummydata
      };
      //console.log(this.dummydata, this.geojsonObject);
      this.drawSource = new VectorSource({
        features: new GeoJSON().readFeatures(this.geojsonObject, { dataProjection: 'EPSG: 3857', featureProjection: 'EPSG: 3857' })
      });

      this.workLayer = new VectorLayer({
        source: this.drawSource,
        zIndex: 10,
        style: this.styleFunction
      });
      this.map.addLayer(this.workLayer)
    }

    else if (this.zoneValue == 3) {
      for (let i = 0; i < this.sampleData.length; i++) {
        const result = this.sampleData[i].shape.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
        // const prtype = this.sampleData[i].alertsPriority;
        const zoneId = this.sampleData[i].id;
        if (result[0][0] == "") {
          //console.log("if condition")
        }
        else {
          const zonetype = this.sampleData[i].facilityZoneType;
          this.test.push({ 'coordinates': result, 'zonetype': zonetype, 'ZoneId': zoneId });
        }
      }
      for (let i = 0; i < this.test.length; i++) {
        this.dummydata.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates:
              [this.test[i].coordinates]
          },
          "properties": { "zoneId": this.test[i].ZoneId, "zoneType": this.test[i].zonetype }
        })
      }
      this.geojsonObject = {
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:3857',
          },
        },
        features:
          this.dummydata
      };
      this.drawSource = new VectorSource({
        features: new GeoJSON().readFeatures(this.geojsonObject, { dataProjection: 'EPSG: 3857', featureProjection: 'EPSG: 3857' })
      });
      this.fecilityLayer = new VectorLayer({
        source: this.drawSource,
        zIndex: 210,
        style: this.fecilityStyleFunction
      });
      this.map.addLayer(this.fecilityLayer)
    }


    // --------------------   Bounds Data   ------------------ 
    this.latitude1 = this.coordinatesarr[1];
    this.longitude1 = this.coordinatesarr[2]
    this.latitude2 = this.coordinatesarr[3]
    this.longitude2 = this.coordinatesarr[4]
    this.zoomLat = (parseFloat(this.latitude1) + parseFloat(this.latitude2)) / 2;
    this.zoomLng = (parseFloat(this.longitude1) + parseFloat(this.longitude2)) / 2;
    // -----------------------main Map starts------------------------
    const view = new View({});
    if (this.map) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.coords = fromLonLat([this.coordinates[0], this.coordinates[1]]);
        this.map.getView().animate({
          center: [this.zoomLat, this.zoomLng],
          layers: [
            this.restrictLayer, this.workLayer
          ]
        })
      })
      view.animate(
        {
          center: [this.zoomLat, this.zoomLng],
        },
      );
    }

    else {
      this.map = new Map({
        view: new View({
          center: [this.zoomLat, this.zoomLng],
          zoom: 16,
          projection: 'EPSG:4326',
        }),
        // --------------------- Layer Starts -----------------------
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              //attributions : 'abc'            
            }),
            // source: new BingMaps({
            // key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
            // imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
            // }),          
          }),
        ],
        // --------------------- Layer End -----------------------
        target: 'map',
        keyboardEventTarget: document,
      });
    }  // -----------------------main Map Ends------------------------
    //  ************************   Static Image  Starts   *************************

    if (this.courseImageData.SmartDisplayInstallationManifest.Course.length >= 1) {
      this.courseLngLat = this.courseImageData.SmartDisplayInstallationManifest.Course[0];
    }
    else {
      this.courseLngLat = this.courseImageData.SmartDisplayInstallationManifest.Course;
    }
    const extent = [this.courseLngLat.CourseBottomLeft._attributes.Longitude, this.courseLngLat.CourseBottomLeft._attributes.Latitude, this.courseLngLat.CourseTopRight._attributes.Longitude, this.courseLngLat.CourseTopRight._attributes.Latitude]
    const projection = new Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent,
    });
    this.staticImageLayer = new ImageLayer({
      source: new Static({
        // attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
        url: this.imageUrl,
        projection: projection,
        imageExtent: extent,
      }),
      // zIndex: 200,
    });
    this.popup = new Overlay({
      element: this.popupCoordinates.nativeElement,
      positioning: OverlayPositioning.CENTER_CENTER,
    });

    let zoneselected = null;
    this.map.on('click', (evt) => {
      if (this.zoneValue == 1 && (this.clickMouse == 1 || this.clickMouse == 3 || this.clickMouse == 0)) {
        if (zoneselected !== null) {
          zoneselected.setStyle(undefined);
          zoneselected = null;
        }
        var featureinfo;
        var featureInfo = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          //this.showZone=true;
          console.log(feature);
          featureinfo = feature;
          zoneselected = feature;
          //feature.setStyle(highlightStyle);
          return feature;
        });
        // displayFeatureInfo(evt.pixel);
        if (featureInfo) {
          this.markerStyle = new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffffff'
              }),
              stroke: new Stroke({
                color: 'red',
                width: 4
              })

            }),
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          });

          var gg = featureinfo.getGeometry();
          var coord = gg.getCoordinates();
          if (featureinfo.getGeometry().getType() == 'Point') {
            let i = 0;
            this.markersList.forEach((feature) => {

              if ((coord[0] == feature.values_.geometry.flatCoordinates[0]) && (coord[1] == feature.values_.geometry.flatCoordinates[1])) {
                this.markersList.splice(i, 1);
                const fnalresult = this.wktformat.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '));
                fnalresult.splice(i, 1);

                var format = new WKT();


                let finalpolygon = '';
                let orderedresult = [];
                for (var y = 0; y < fnalresult.length; y++) {
                  orderedresult.push({ 0: parseFloat(fnalresult[y][0]), 1: parseFloat(fnalresult[y][1]) });
                }

                for (var x = 0; x < orderedresult.length; x++) {
                  finalpolygon = finalpolygon + orderedresult[x][0] + ' ' + orderedresult[x][1] + ','
                }


                // this.editwktFormat = format.writeGeometry(fnalresult);
                this.finalpolygonresult = "POLYGON((" + finalpolygon.replace(/,(\s+)?$/, '') + "))";

              }
              i++;
            })

          }

          this.map.removeLayer(this.markerVectorLayer);

          if (featureinfo.getGeometry().getType() == "Polygon") {
            this.markersList = [];
            for (var i = 0; i < coord[0].length; ++i) {
              // add the marker
              this.markersList[i] = new Feature({
                geometry: new Point(fromLonLat([coord[0][i][0], coord[0][i][1]], "EPSG:4326", "EPSG:3857")),
                //namesList: pointList[i].mediaNameList
              });

              // apply the style to the marker
              this.markersList[i].setStyle(this.markerStyle);
            }
          }
          var markers = new VectorSource({
            features: this.markersList
          });

          this.markerVectorLayer = new VectorLayer({
            source: markers,
            zIndex: 11
          });
          this.map.addLayer(this.markerVectorLayer);


          this.selected = zoneselected;
          let zval, Indirection = false, Outdirection = false, priority = false;
          let lowpriority = false, highpriority = false, mediumpriority = false;
          var vehicleSelectedValues = [], vehicleTypeVal;
          if (featureinfo.values_.zoneId != "" && featureinfo.values_.zoneId != undefined) {

            this.select = new Select({
              // style : this.overlayStyle,
              wrapX: false,
              //type:'Point'
            });
            this.map.addInteraction(this.select);

            this.modify = new Modify({
              features: this.select.getFeatures(),
              //style : this.overlayStyle,
              // insertVertexCondition: function() {
              //   // prevent new vertices to be added to the polygons
              //   return !this.select.getFeatures().getArray().every(function(feature) {
              //     return feature.getGeometry().getType().match(/Polygon/);
              //   });
              // }
            });


            this.map.addInteraction(this.modify);

            this.clearZonepopup();

            this.dsgzoneId = featureinfo.values_.zoneId

            this.apollo.watchQuery({ query: RestirctedZoneDetails, variables: { id: featureinfo.values_.zoneId }, fetchPolicy: 'network-only' }).valueChanges.subscribe(({ data, loading }) => {
              console.log(data["zonesActionZoneById"][0])
              this.ZonesData = data["zonesActionZoneById"][0];
              this.showZone = true;

              this.wktformat = this.ZonesData.shape;
              if (this.ZonesData.actionZoneType == "RESTRICTED")
                zval = 3;
              else
                zval = 2;

              if (this.ZonesData.direction == "IN" || this.ZonesData.direction == "IN_OUT") {
                Indirection = true;
                this.alertsselect = true;
              }
              if (this.ZonesData.direction == "OUT") {
                Outdirection = false;
                this.alertsselect = true;
              }
              if (this.ZonesData.alertsPriority == "LOW")
                lowpriority = true;
              else if (this.ZonesData.alertsPriority == "HIGH")
                highpriority = true;
              else if (this.ZonesData.alertsPriority == "NORMAL")
                mediumpriority = true;
              this.uncheckAll();
              if (this.ZonesData.vehicles != 0) {
                var l = 0;
                var item;
                var vehtotalValue = this.ZonesData.vehicles;
                if (vehtotalValue == 1022) {
                  this.zoneForm.patchValue({
                    chkallvh: true
                  });
                  this.checkAll()
                }
                else {
                  this.zoneForm.patchValue({
                    chkallvh: false
                  });
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
              if (this.ZonesData.actions[0].enabled == true)
                this.showVehicletime = true;
              this.zoneForm.patchValue({
                txtzonename: this.ZonesData.name,
                txthole: this.ZonesData.label,
                chkEnable: this.ZonesData.enabled,
                ddltype: zval,
                ddlgraceperiod: this.ZonesData.actions[0].delaySeconds,
                ddlunlock: this.ZonesData.actions[0].durationSeconds,
                chkbuzzer: this.ZonesData.actions[1].enabled,
                chkenter: Indirection,
                chkexit: Outdirection,
                rdpriority: this.ZonesData.alertsPriority,
                chkalarm: this.ZonesData.alerts[2].enabled,
                chkemail: this.ZonesData.alerts[0].enabled,
                txtemail: this.ZonesData.alerts[0].parameter,
                chkstopveh: this.ZonesData.actions[0].enabled
              });
            });
            var that = this;

            this.modify.on('modifyend', function (e) {


              setTimeout(() => {
                var features = e.features.getArray();
                this.modifiedFeatures = []

                for (var i = 0; i < features.length; i++) {
                  var rev = features[i].getRevision();
                  if (rev > 1) {
                    // console.log("feature with revision:" + rev + " has been modified");
                    this.modifiedFeatures.push(features[i]);
                  }
                }

                var modifycoordinates = this.modifiedFeatures[0].getGeometry();
                var modifiedlist = modifycoordinates.getCoordinates();

                let finalmodifiedpolygon = "";
                for (var m = 0; m < modifiedlist[0].length; m++) {
                  finalmodifiedpolygon = finalmodifiedpolygon + parseFloat(modifiedlist[0][m][0]) + ' ' + parseFloat(modifiedlist[0][m][1]) + ','
                }


                that.finalpolygonresult = "POLYGON((" + finalmodifiedpolygon.replace(/,(\s+)?$/, '') + "))";
              }, 1000);

              //console.log(this.finalpolygonresult);


            })

            //console.log(that.finalpolygonresult);


          }

        }


      }
      else if (this.zoneValue == 2 && (this.clickMouse == 4 || this.clickMouse == 2 || this.clickMouse == 0)) {
        if (zoneselected !== null) {
          zoneselected.setStyle(undefined);
          zoneselected = null;
        }
        var featureinfo;
        this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          //this.showZone=true;
          console.log(feature);
          featureinfo = feature;
          zoneselected = feature;
          // feature.setStyle(highlightStyle);
          return true;
        });
        if (featureinfo) {
          this.markerStyle = new Style({
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#ffffff'
              }),
              stroke: new Stroke({
                color: 'red',
                width: 4
              })

            }),
            stroke: new Stroke({
              color: 'red',
              width: 2
            })
          });

          var gg = featureinfo.getGeometry();
          var coord = gg.getCoordinates();
          this.markersList = [];
          this.map.removeLayer(this.markerVectorLayer);
          for (var i = 0; i < coord[0].length; ++i) {
            // add the marker
            this.markersList[i] = new Feature({
              geometry: new Point(fromLonLat([coord[0][i][0], coord[0][i][1]], "EPSG:4326", "EPSG:3857")),
              //namesList: pointList[i].mediaNameList
            });
            // apply the style to the marker
            this.markersList[i].setStyle(this.markerStyle);
          }
          var markers = new VectorSource({
            features: this.markersList
          });
          this.markerVectorLayer = new VectorLayer({
            source: markers,
            zIndex: 11
          });
          this.map.addLayer(this.markerVectorLayer);





          this.selected = zoneselected;
          let zval, Indirection = false, Outdirection = false, priority = false;
          let lowpriority = false, highpriority = false, mediumpriority = false;
          if (featureinfo.values_.zoneId != '' && featureinfo.values_.zoneId != undefined) {

            this.select = new Select({
              // style : this.overlayStyle,
              wrapX: false,
              //type:'Point'
            });

            this.map.addInteraction(this.select);
            this.modify = new Modify({
              features: this.select.getFeatures(),
              // style : this.overlayStyle,
              // insertVertexCondition: function() {
              //   // prevent new vertices to be added to the polygons
              //   return !this.select.getFeatures().getArray().every(function(feature) {
              //     return feature.getGeometry().getType().match(/Polygon/);
              //   });
              // }
            });


            this.map.addInteraction(this.modify);

            this.clearZonepopup();

            this.dsgzoneId = featureinfo.values_.zoneId

            this.apollo.watchQuery({ query: workZoneDetails, variables: { id: featureinfo.values_.zoneId }, fetchPolicy: 'network-only' }).valueChanges.subscribe(({ data, loading }) => {
              console.log(data["workZoneById"][0])
              this.ZonesData = data["workZoneById"][0];
              this.showZone = true;
              if (this.ZonesData.workZoneType == "RESTRICTED")
                zval = 2;
              else
                zval = 1;
              if (this.ZonesData.direction == "IN" || this.ZonesData.direction == "IN_OUT") {
                Indirection = true;
                this.alertsselect = true;
              }
              if (this.ZonesData.direction == "OUT") {
                Outdirection = false;
                this.alertsselect = true;
              }
              if (this.ZonesData.alertPriority == "LOW")
                lowpriority = true;
              else if (this.ZonesData.alertPriority == "HIGH")
                highpriority = true;
              else if (this.ZonesData.alertPriority == "NORMAL")
                mediumpriority = true;
              this.uncheckAll();
              if (this.ZonesData.vehicles != 0) {
                var l = 0;
                var item;
                var vehtotalValue = this.ZonesData.vehicles;
                if (vehtotalValue == 1022) {
                  this.zoneForm.patchValue({
                    chkallvh: true
                  });
                  this.checkAll()
                }
                else {
                  this.zoneForm.patchValue({
                    chkallvh: false
                  });
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
              if (this.ZonesData.actions != undefined)
                if (this.ZonesData.actions[0].enabled == true)
                  this.showVehicletime = true;
              var zonemnmame = '';
              if (this.clickMouse == 0) {
                zonemnmame = this.ZonesData.nameAssociation
              }
              else
                zonemnmame = this.ZonesData.name
              this.zoneForm.patchValue({
                txtzonename: zonemnmame,
                txthole: this.ZonesData.label,
                chkEnable: this.ZonesData.enabled,
                ddltype: zval,
                //ddlgraceperiod: this.ZonesData.actions[0].delaySeconds,
                //ddlunlock: this.ZonesData.actions[0].durationSeconds,
                // chkbuzzer: this.ZonesData.actions[1].enabled,
                chkenter: Indirection,
                chkexit: Outdirection,
                rdpriority: this.ZonesData.alertPriority,
                chkalarm: this.ZonesData.alerts[2].enabled,
                chkemail: this.ZonesData.alerts[0].enabled,
                txtemail: this.ZonesData.alerts[0].parameter,
                //chkstopveh: this.ZonesData.actions[0].enabled
              });
            });



            var that = this;

            this.modify.on('modifyend', function (e) {


              setTimeout(() => {
                var features = e.features.getArray();
                this.modifiedFeatures = []

                for (var i = 0; i < features.length; i++) {
                  var rev = features[i].getRevision();
                  if (rev > 1) {
                    // console.log("feature with revision:" + rev + " has been modified");
                    this.modifiedFeatures.push(features[i]);
                  }
                }

                var modifycoordinates = this.modifiedFeatures[0].getGeometry();
                var modifiedlist = modifycoordinates.getCoordinates();

                let finalmodifiedpolygon = "";
                for (var m = 0; m < modifiedlist[0].length; m++) {
                  finalmodifiedpolygon = finalmodifiedpolygon + parseFloat(modifiedlist[0][m][0]) + ' ' + parseFloat(modifiedlist[0][m][1]) + ','
                }


                that.finalpolygonresult = "POLYGON((" + finalmodifiedpolygon.replace(/,(\s+)?$/, '') + "))";
              }, 1000);

              //console.log(this.finalpolygonresult);


            })


          }

        }
      }
      else {
        this.clickedCordinates = evt.coordinate;
        this.totalClickedCordinates.push(this.clickedCordinates);

      }
    });


    // zone feature hover 
    const container = document.getElementById('zonepopup');
    const content = document.getElementById('zonepopup-content');


    const overlay = new Overlay({
      element: container
    });

    this.map.on('pointermove', (evt) => {

      overlay.setPosition(undefined);
      var feature_hover;
      feature_hover = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        // console.log(feature);
        feature_hover = feature;
        return feature;
      });
      if (feature_hover != undefined) {
        const coordinate = evt.coordinate;
        if (feature_hover.values_.geometry.getType() == 'Polygon') {
          if (content != null) {
            content.innerHTML = '<p>' + feature_hover.values_.zoneName + '</p>';
            overlay.setPosition(coordinate);

            this.map.addOverlay(overlay);
          }
        }

      }

    });

    // zone feature hover ends


    this.map.on('click', (evt) => {
      if (this.dsgzoneId == null || this.dsgzoneId == undefined || this.dsgzoneId == "") {
     
// this.map.removeLayer(this.dummyLayer);

    
        var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature
        });
        if (feature == undefined) {
       
        this.map.removeLayer(this.dummyLayer);
          this.iconFeatures;
          console.log("if");
          console.log(this.iconFeatures);        
        }

        else {

          for (let i = 0; i < this.allTags.length; i++) {
            //console.log(this.dummy1);
            if (this.allTags[i].location != null) {
              let dataBounds = this.allTags[i].location.position
              let bounds = dataBounds.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
              const coordinatesarr = bounds.split(" ");
              //console.log(coordinatesarr)
              if (coordinatesarr[1] == feature.values_.geometry.flatCoordinates[0]) {
                //console.log(this.dummy1.obj[i]);
              
                
                this.iconFeatures=[];
                this.map.removeLayer(this.dummyLayer);
              console.log("else");
                this.iconFeature =
                  new Feature({
                    // labelPoint: new Point([this.dummy2[i][1], this.dummy2[i][2]]),
                    geometry: new Point([feature.values_.geometry.flatCoordinates[0], feature.values_.geometry.flatCoordinates[1]]),
                  });
                  const iconStyle = new Style({
                    image: new Icon({ 
                      scale: 0.8,
                      anchor: [0.5, 46],
                      anchorXUnits: 'fraction',
                      anchorYUnits: 'pixels',
                      src: '../../../assets/carts/yCart.png',
                    }),
                  }); 
                  this.iconFeatures.push(this.iconFeature); 
                  this.iconFeatures.forEach(function (feature) { 
                    feature.setStyle(iconStyle);
                  })
                  console.log(this.iconFeatures); 
               
              }
            }
    
          }
         
          }
          const vectorSource = new VectorSource({
            features: this.iconFeatures 
          });  
          this.dummyLayer = new VectorLayer({ 
            source: vectorSource, 
            zIndex: 10
          }); 
          this.map.addLayer(this.dummyLayer);
      }
    })

    this.map.on('dblclick', (evt) => {
      this.dialog.closeAll();
      var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature
      });
      // //console.log(feature == this.iconFeature);
      //  //console.log(feature.values_.geometry.flatCoordinates);
      console.log(this.allTags);

      for (let i = 0; i < this.allTags.length; i++) {
        //console.log(this.dummy1);
        if (this.allTags[i].location != null) {
          let dataBounds = this.allTags[i].location.position
          let bounds = dataBounds.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
          const coordinatesarr = bounds.split(" ");
          //console.log(coordinatesarr)
          if (coordinatesarr[1] == feature.values_.geometry.flatCoordinates[0]) {
            //console.log(this.dummy1.obj[i]);
            this.service.setTagId({
              tagId: this.allTags[i].id
            });

            this.dialog.open(PopupComponent, {
              width: '32%',
              height: '79%'
            });
          }
        }

      }


    })

    const dblClickInteraction = this.map
      .getInteractions()
      .getArray()
      .find(interaction => {
        return interaction instanceof DoubleClickZoom;
      });
    this.map.removeInteraction(dblClickInteraction);

    const drawSource = new VectorSource();
    const drawLayer = new VectorLayer({
      source: drawSource,
    });
    this.map.addLayer(drawLayer)
    this.map.addLayer(this.staticImageLayer);
    this.spinner.hide()
  }




  cancelZone() {
    this.showZone = false;
    if (this.totalClickedCordinates.length == 0)
      this.selected.setStyle(undefined);
    //this.totalClickedCordinates=[];
    if (this.zoneValue == 1) {
      if (this.clickMouse == 1)
        this.map.removeLayer(this.drawLayer);

      else if (this.clickMouse == 3)
        this.map.removeLayer(this.drawGeoLayer);
    }

    else if (this.zoneValue == 2) {
      if (this.clickMouse == 2)
        this.map.removeLayer(this.drawWorkLayer);
      else if (this.clickMouse == 4)
        this.map.removeLayer(this.drawhomeLayer);
    }
    this.markersList = [];
    this.map.removeLayer(this.markerVectorLayer);

  }

  ZoneOk() {
    this.showZone = false;
    if (this.totalClickedCordinates.length == 0)
      this.selected.setStyle(undefined);
    //this.totalClickedCordinates=[];

    if (this.clickMouse == 1 || this.clickMouse == 0)
      this.map.removeLayer(this.drawLayer);
    else if (this.clickMouse == 2)
      this.map.removeLayer(this.drawWorkLayer);
    else if (this.clickMouse == 4)
      this.map.removeLayer(this.drawhomeLayer);
    else if (this.clickMouse == 3)
      this.map.removeLayer(this.drawGeoLayer);

    let Actiontype = '';
    let zonesubType: Number = 0;
    if (this.zoneValue == 1) {
      Actiontype = 'ACTION';
      zonesubType = parseInt(this.zoneForm.value.ddltype);
    }
    else if (this.zoneValue == 2) {
      Actiontype = 'WORK';
      zonesubType = 1;
    }
    // else if(this.zoneValue == 3){
    //   Actiontype = 'ACTION';
    //   zonesubType = 1;
    // }
    // else if(this.zoneValue == 4){
    //   Actiontype = 'HOME';
    //   zonesubType = 4;
    // }

    if (this.zoneValue == 1 || this.zoneValue == 2) {


      let nowdate = new Date();
      let directionval = "";
      if (this.zoneForm.controls["chkenter"].value == true && this.zoneForm.controls["chkexit"].value == true)
        directionval = "IN_OUT"
      else if (this.zoneForm.controls["chkenter"].value == true)
        directionval = "IN";
      else if (this.zoneForm.controls["chkexit"].value == true)
        directionval = "OUT";

      console.log(
        this.zoneForm)

      //  const fnalresult=  this.wktformat.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '));
      //  console.log(fnalresult);
      console.log(this.editwktFormat);




      if (this.dsgzoneId == '') {


        this.finalpolygonresult = '';
        // changes coordinate to wkt format
        let addfinalresult = '';
        for (var x = 0; x < this.selectedcoordinates.length; x++) {
          addfinalresult = addfinalresult + this.selectedcoordinates[x][0] + ' ' + this.selectedcoordinates[x][1] + ','
        }


        // this.editwktFormat = format.writeGeometry(fnalresult);
        this.finalpolygonresult = "POLYGON((" + addfinalresult.replace(/,(\s+)?$/, '') + "))";






        this.apollo.mutate({
          mutation: zoneCreation,
          variables: {
            installationID: this.installation_Id,
            name: this.zoneForm.value.txtzonename,

            shape: this.finalpolygonresult,

            updateTime: new Date(nowdate.getTime() + (nowdate.getTimezoneOffset() * 60000)),

            enabled: this.zoneForm.value.chkEnable,

            zoneType: Actiontype,

            zoneSubType: zonesubType,

            label: "9",

            actionDirectionType: directionval,

            alertPriorityType: this.zoneForm.value.rdpriority,

            vechicleTypes: this.vehicletypesVals,

            location: "xxx",

            area: "2",

            allWorkGroups: false,

            emailalert: "EMAIL",

            emailaddress: this.zoneForm.value.txtemail,

            isEmail: this.zoneForm.value.chkemail,

            smsalert: "SMS",

            isSMS: false,

            notificationalert: "NOTIFICATION",

            isNotification: this.zoneForm.value.chkalarm,

            lockalert: "LOCK",

            isLock: this.zoneForm.value.chkstopveh,

            buzzeralert: "BUZZER",

            isBuzzer: this.zoneForm.value.chkbuzzer,

            messagealert: "MESSAGE",

            isMessage: false,

            delaySec: parseInt(this.zoneForm.value.ddlgraceperiod),

            durationSec: parseInt(this.zoneForm.value.ddlunlock)

          },
        }).subscribe(({ data }) => {
          console.log(data);
          if (data["zoneCreate"] == true) {
            this.map.removeLayer(this.workLayer)
            this.map.removeLayer(this.restrictLayer)
            this.zones();
          }
        },
          (error) => {
            console.log(error);

          }

        );
      }
      else if (this.dsgzoneId != '') {
        this.apollo.mutate({
          mutation: zoneUpdation,
          variables: {
            id: this.dsgzoneId,
            installationID: this.installation_Id,
            name: this.zoneForm.value.txtzonename,

            shape: this.finalpolygonresult,

            updateTime: new Date(nowdate.getTime() + (nowdate.getTimezoneOffset() * 60000)),

            enabled: this.zoneForm.value.chkEnable,

            zoneType: Actiontype,

            zoneSubType: zonesubType,

            label: "9",

            actionDirectionType: directionval,

            alertPriorityType: this.zoneForm.value.rdpriority,

            vechicleTypes: this.vehicletypesVals,

            location: "xxx",

            area: "2",

            allWorkGroups: false,

            emailalert: "EMAIL",

            emailaddress: this.zoneForm.value.txtemail,

            isEmail: this.zoneForm.value.chkemail,

            smsalert: "SMS",

            isSMS: false,

            notificationalert: "NOTIFICATION",

            isNotification: this.zoneForm.value.chkalarm,

            lockalert: "LOCK",

            isLock: this.zoneForm.value.chkstopveh,

            buzzeralert: "BUZZER",

            isBuzzer: this.zoneForm.value.chkbuzzer,

            messagealert: "MESSAGE",

            isMessage: false,

            delaySec: parseInt(this.zoneForm.value.ddlgraceperiod),

            durationSec: parseInt(this.zoneForm.value.ddlunlock)

          },
        }).subscribe(({ data }) => {
          console.log(data);
          if (data["zoneUpdate"] == true) {
            this.map.removeLayer(this.workLayer)
            this.map.removeLayer(this.restrictLayer)
            this.zones();
          }
        },
          (error) => {
            console.log(error);

          }
        );
      }

    }


    this.markersList = [];
    this.map.removeLayer(this.markerVectorLayer);
  }

  deleteZone() {

  }
  imgShow() {
    this.showimage = !this.showimage;
  }
  alerTs(event) {
    if ((event.target.value == "IN" || event.target.value == "OUT") && event.target.checked == true) {
      this.alertsselect = true;
    }
    else
      this.alertsselect = false;
    //this.alertsselect = !this.alertsselect;
  }
  zoneTypeChange(event) {
    if (event.target.value == 1) {
      this.showhole = true;
    }
    else
      this.showhole = false;
  }
  changeVehicle(e) {
    if (e.target.checked)
      this.showVehicletime = true;
    else
      this.showVehicletime = false
  }

  uncheckAll() {
    this.vehicleValues.forEach((element) => {
      element.isSelected = false;
    });
  }
  checkAll() {
    this.vehicleValues.forEach((element) => {
      element.isSelected = true;
    });
  }

  getcourses() {
    this.coursearray = [];
    this.apollo.use('live').watchQuery({ query: getCourses, variables: { id: this.installation_Id } }).valueChanges.subscribe((data: any) => {
      this.coursearray = data.data.courses;
      this.locationChange(this.coursearray[0].name, 1);

    });

  }
  counter(i: number) {
    return new Array(i);
  }

  locationChange(e, val) {

    var crsname = '';
    //console.log(e);
    if (val == 0)
      crsname = e.target.value;
    else
      crsname = e;
    this.countarray = this.coursearray.filter(item => item.name == crsname);

  }

  getCheckValues(isChecked, e) {
    let val = e.target.value;
    if (isChecked == true) {

      this.vehicletypesVals += parseInt(val);
    }
    else {
      this.vehicletypesVals -= parseInt(val);
    }
  }
  styleFunction(feature) {
    var styleToReturn = ""
    if (feature.get('suitability') == "HIGH" && feature.get('enabled') == true) {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgba(255,255,0,0.5)'
        })
      })
    }
    else if (feature.get('suitability') == "LOW" && feature.get('enabled') == true) {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 71, 0.5)'
        })
      })

    }

    else if (feature.get('suitability') == "NORMAL" && feature.get('enabled') == true) {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgba(255, 99, 71, 0.4)'
        })
      })
    }
    else {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgba(0,0,0,0.6)'
        })
      })
    }
    return styleToReturn
  }

  fecilityStyleFunction(feature) {
    var styleToReturn = ""
    if (feature.get('zoneType') == "TEE") {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgb(75,0,130)'
        })
      })
    }
    else if (feature.get('zoneType') == "GREEN") {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'green'
        })
      })

    }

    else if (feature.get('suitability') == "NORMAL") {
      styleToReturn = new Style({
        fill: new Fill({
          color: 'rgba(255, 99, 71, 0.4)'
        })
      })
    }
    return styleToReturn
  }


  loadingrightPanelCart() {
    let startVariable = this.datepipe.transform(this.notificationDate[0].time, 'yyyy-MM-dd');
    let hrs = new Date(this.notificationDate[0].time).getUTCHours();
    // let startVariablet = new Date(this.notificationDate[0].time).getUTCHours()+':'+new Date(this.notificationDate[0].time).getUTCMinutes();
    // let endVariable = new Date(this.notificationDate[0].time).getUTCHours()+':'+(new Date(this.notificationDate[0].time).getUTCMinutes()+10);



    let newdate = moment(this.notificationDate[0].time).add(this.notificationDate[0].timeOffSet, 'hours').format('YYYY-MM-DDTHH:mm:ss.000') + 'Z';

    let beforenewdate = moment(newdate, 'YYYY-MM-DDTHH:mm:ss.000').add('-10', 'minutes').format('YYYY-MM-DDTHH:mm:ss.000') + 'Z';
    let afternewdate = (moment(newdate, 'YYYY-MM-DDTHH:mm:ss.000').add('10', 'minutes').format('YYYY-MM-DDTHH:mm:ss.000') + 'Z');

    var orgstarttime = this.datepipe.transform(beforenewdate, 'yyyy-MM-dd HH:MM:SS');
    var orgendtime = this.datepipe.transform(afternewdate, 'yyyy-MM-dd HH:MM:SS');


    let startVariablet = beforenewdate.substring(11, 19);
    let endVariable = afternewdate.substring(11, 19);

    const dt = startVariable;
    const [yyyy, mm, dd] = dt.split('/')
    const stime = startVariablet;
    const sdate = `${yyyy}T${stime}.0000Z`;
    console.log(sdate);
    const etime = endVariable;
    const edate = `${yyyy}T${etime}.0000Z`;
    console.log(edate);
    this.TrailsPlotting = []; this.TrailsCoordinates = []; this.TrailsData = []
    this.apollo.use('live').watchQuery({ query: Trails, variables: { tagId: this.notificationDate[0].tagid, start: sdate, end: edate, zoonLevel: 5 } }).valueChanges.subscribe(({ data, loading }) => {
      // this.apollo.watchQuery({ query: Trails, variables: { tagId: 'CB335404-0104-4A4A-B4F8-0030B3BB4C92',start:"2021-08-31T22:20:42.7174Z" ,end:'2021-08-31T22:42:42.7174Z',zoonLevel:2} }).valueChanges.subscribe(({ data, loading }) => {
      this.TrailsData = data
      console.log(this.TrailsData)
      let trailplots = this.TrailsData.trails.filter(item => item.position != null)
      for (let i = 0; i < trailplots.length; i++) {
        this.TrailsCoordinates = trailplots[i].position.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))
        let cc = this.TrailsCoordinates[0].map(ele => parseFloat(ele))
        this.TrailsPlotting.push(cc)
      }
      console.log(this.TrailsPlotting)

      this.rightcartBinding(this.notificationDate[0].pos);
    });
  }

  rightcartBinding(position) {
    const view = new View({});


    if (this.TrailsPlotting.length != 0) {
      //  this.tagPoint = this.dummy1.obj.data.tags[0].location.position
      //  console.log(this.tagPoint.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' ')))
      //  let cc = this.tagPoint.split(',').map((s) => s.replace(/[^\d., -]/g, '').trim().split(' '))[0].map(ele =>parseFloat(ele))
      //console.log(cc)
      const stylefun = function (feature) {
        const geometry = feature.getGeometry();
        const styles = [
          // linestring
          new Style({
            stroke: new Stroke({
              color: '#ffcc33',
              width: 2,
            }),
          }),
        ]; return styles;
      };

      var cordinates: any = []
      // this.TrailsPlotting.push(cc)
      const geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857',
          },
        },
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': this.TrailsPlotting
            },
          },
        ],
      };
      console.log(geojsonObject)
      navigator.geolocation.getCurrentPosition((pos) => {
        this.map.getView().animate({
          center: [position[0], position[1]],
          layers: [
            new TileLayer({
              source: new BingMaps({
                key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
                imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
              }),
            }),

          ],
          zoom: this.map.getView().getZoom() + 1
        })
      })
      const TrailSource = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonObject),
      });
      this.TrailLayer = new VectorLayer({
        source: TrailSource,
        style: stylefun,
      });

      this.map.addLayer(this.TrailLayer)
      for (let i = 0; i < this.TrailsPlotting.length; i++) {
        if (i % 6 == 0) {
          cordinates.push(this.TrailsPlotting[i]);
        }
      }
      const styleArrowfun = function (feature) {
        const geometry = feature.getGeometry();
        const stylesArrow = [];
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0];
          const dy = end[1] - start[1];
          const rotation = Math.atan2(dy, dx);
          // arrows
          stylesArrow.push(
            new Style({
              geometry: new Point(end),
              image: new Icon({
                src: '../../../assets/carts/arrow.png',
                anchor: [0.75, 0.5],
                rotateWithView: true,
                rotation: -rotation,
                color: '#ffcc33',
              }),
            })
          );
        });
        return stylesArrow;
      };
      const geojsonArrowObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:3857',
          },
        },
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': cordinates
            },
          },
        ],
      };
      console.log(geojsonArrowObject)
      const TrailSourceArrow = new VectorSource({
        features: new GeoJSON().readFeatures(geojsonArrowObject),
      });
      this.TrailLayerArrow = new VectorLayer({
        source: TrailSourceArrow,
        style: styleArrowfun,
      });

      this.map.addLayer(this.TrailLayerArrow)
    }
  }

}
