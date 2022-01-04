import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
// import { ServiceService } from 'src/app/service.service';

import Map from 'ol/Map';
import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { OSM, Stamen, XYZ } from 'ol/source';
import { Layer, Tile as TileLayer, Vector as VectorLayer, VectorImage } from 'ol/layer';
import Overlay from 'ol/Overlay';
import OverlayPositioning from 'ol/OverlayPositioning';
import DragBox from 'ol/interaction/DragBox';
import Interaction from 'ol/interaction/Interaction';
import VectorSource from 'ol/source/Vector';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults, FullScreen, MousePosition, OverviewMap } from 'ol/control';

// import coordinates from '../../layerdata/osm-world-airports.json';
import GeometryType from 'ol/geom/GeometryType';
import { add } from 'ol/coordinate';
import { Parser } from '@angular/compiler/src/ml_parser/parser';
import {ApiServiceService} from '../../../Core/Providers/api-service/api-service.service';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { style } from '@angular/animations';
import { Icon, Style } from 'ol/style';
import { features } from 'process';
declare const google : any;
@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  map: any;
  result : any;
  data : any;
  latitude1;
  longitude1;
  latitude2;
  longitude2;
  clickMouse : any;
  @ViewChild('mapElement') mapElement: any;
  dummy : any = []

  constructor(private service: ApiServiceService) { }

  ngOnInit(): void {
  }

  boundsData;
  bounds
  coordinatesarr
  ngAfterViewInit(): void {

    this.service.getMouseValue().subscribe(response=>{
      //console.log(response);
      this.clickMouse = response;
      if(this.clickMouse == 1)
      {
        //console.log("enter");
        
      this.initMap(); 
      }
    })

    this.service.getMapcoordinates().subscribe(data=>{
 
      // ////console.log(this.result)
  
        this.result = data;
        this.dummy = this.result.obj;
        ////console.log(this.dummy);
        this.dummy = this.result.obj;
        this.boundsData = this.dummy.region.bounds;
        this.bounds = this.boundsData.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
        ////console.log(this.bounds);
        
         this.coordinatesarr = this.bounds.split(" "); 
        ////console.log(this.coordinatesarr);
    this.initMap();
        
      });
  }
  zoomLat;
  zoomLng
  initMap()
  {
   
    this.latitude1 = this.coordinatesarr[1]
    this.longitude1 = this.coordinatesarr[2]
    this.latitude2 =this.coordinatesarr[3]
    this.longitude2 = this.coordinatesarr[4]
    // ////console.log(parseFloat(this.latitude1) + parseFloat(this.latitude2));
    this.zoomLat = (parseFloat(this.latitude1) + parseFloat(this.latitude2))/2;
    ////console.log(this.zoomLat);
    this.zoomLng = (parseFloat(this.longitude1) + parseFloat(this.longitude2))/2;
    ////console.log(this.zoomLng);
    ////console.log("enter",this.result);
    this.data = this.result.obj;
    const mapDiv = this.mapElement.nativeElement;
    this.map= new google.maps.Map(mapDiv,{
      center : [this.zoomLng,this.zoomLat],
      zoom : 17,
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      
    });
    this.map.setCenter(new google.maps.LatLng(this.zoomLng,this.zoomLat))

   if(this.clickMouse ==1)
   {
    const drawingManager = new google.maps.drawing.DrawingManager({

      
      drawingMode : google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      drawingControlOptions: {
        // position: google.maps.ControlPosition.RIGHT_CENTER,
        drawingModes: [
        
          google.maps.drawing.OverlayType.POLYGON,
        
        ],
      },

      
    })
     drawingManager.setMap(this.map)
  }
    
  }

}
