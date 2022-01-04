import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { BingMaps, OSM, Stamen } from 'ol/source';
import {
  Graticule,
  Tile as TileLayer,
  Vector as VectorLayer,
  VectorImage,
} from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import DragBox from 'ol/interaction/DragBox';
import Interaction from 'ol/interaction/Interaction';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults, FullScreen, MousePosition, OverviewMap } from 'ol/control';
import GeometryType from 'ol/geom/GeometryType';
import { add } from 'ol/coordinate';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
import { register } from 'ol/proj/proj4';
// import coordinates1 from '../../layerdata/airports.geojson';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
// import Style from 'ol/style/Style';
import { Fill, Stroke, Circle, Style, Icon } from 'ol/style';
import LayerGroup from 'ol/layer/Group';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';
import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
// import { ServiceService } from 'src/app/service.service';
import {ApiServiceService} from '../../../Core/Providers/api-service/api-service.service'
import {Attribution, defaults as defaultControls} from 'ol/control';

import Rotate from 'ol/control/Rotate'
@Component({
  selector: 'app-bing',
  templateUrl: './bing.component.html',
  styleUrls: ['./bing.component.css']
})
export class BingComponent implements OnInit {

  map: any;
  draw: any;
  value: any;
  binding: any;
  dragSource: any;
  coordinatesArray: any = [];
  result : any =[]
  // data: any = this.countryList;
  coordinates : any =[]
  latitude1;
  longitude1;
  latitude2;
  longitude2;
  zoomLat;
zoomLng;
  @ViewChild('popupCoordinates') popupCoordinates!: ElementRef;
  data: any;
  marker: any;
  coords: any;
  lat: number;
  lng: number;
  clickMouse : any;
  info: boolean = true;
  clickedCordinates: any;
  popup: Overlay;
  coordinatesarr : any;
  dummy : any =[];
  boundsData : any;
  bounds : any;

  constructor(private service: ApiServiceService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.service.getMouseValue().subscribe(response=>{
    //   //console.log(response);
    //   this.clickMouse = response;
    //   if(this.clickMouse == 1)
    //   {
    //     //console.log("enter");
        
    //   this.initilizeMap(); 
    //   }
    // })
    
    this.service.getMapcoordinates().subscribe(data=>{
      this.result = data;
      ////console.log(this.result);
      if(this.result.obj != '')
      {  
        this.dummy = this.result.obj;
        this.boundsData = this.dummy.region.bounds;
        this.bounds = this.boundsData.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        // ////console.log(this.bounds);
        this.coordinatesarr = this.bounds.split(" "); 
        // ////console.log(this.coordinatesarr); 
         this.initilizeMap();       
      } 
                
    }) 
  }
  initilizeMap() {

    //console.log("enter");
    
  // --------------------   Bounds Data   ------------------ 
this.latitude1 = this.coordinatesarr[1]
this.longitude1 = this.coordinatesarr[2]
this.latitude2 =this.coordinatesarr[3]
this.longitude2 = this.coordinatesarr[4]
this.zoomLat = (parseFloat(this.latitude1) + parseFloat(this.latitude2))/2;
this.zoomLng = (parseFloat(this.longitude1) + parseFloat(this.longitude2))/2;

    // -----------------------main Map starts------------------------


    const view =  new View({ });
    if(this.map)
    {
      navigator.geolocation.getCurrentPosition((pos)=>{
        this.coords = fromLonLat([this.coordinates[0],this.coordinates[1]]);
        this.map.getView().animate({
          center: [this.zoomLat, this.zoomLng],
       
        })
      })
      view.animate(       
        {         
          center:  [this.zoomLat, this.zoomLng],
        },
      );
    }
    
else
{

  
   this.map= new Map({
     view : new View({
       center : [this.zoomLat,this.zoomLng],    
       zoom: 17,
      projection: 'EPSG:4326',
     }),
  
      // --------------------- Layer Starts -----------------------
      layers: [
       
        new TileLayer({
          
          source: new BingMaps({
            key: 'AnXQxrydF_O4T36aFtIygX8AvI-y-lUEK8R_aoa5ObqxU8VOusKbpWVtPFLkNZmD',
            imagerySet: 'Aerial', // Road, ConvasDark, CanvasGray, OrdnanceSurvey
          }),
          
        }),
      ],

      // --------------------- Layer End -----------------------
      controls: [defaultControls({attribution: false,zoom : false}),
                  new Rotate({autoHide :false})
                ],
      target: 'map',
      keyboardEventTarget: document,    
   
    });
  }  // -----------------------main Map Ends------------------------

   
  }


}
