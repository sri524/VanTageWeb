import {  Component,  ElementRef,  OnInit,  ViewChild,  AfterViewInit,  Input,} from '@angular/core';
import {ApiServiceService} from '../../Core/Providers/api-service/api-service.service'
@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent implements OnInit  {
  mapName = 'dsg';

  @Input() cartdata:any[];
  @Input() StartRange:any;
  @Input() Range:any;
  @Input() VisibilityStatus:any
  @Input() TimeOffset:any;
  @Input() Reset:any;
  map: any;
  draw: any;
  value: any;
  binding: any;
  dragSource: any;
  coordinatesArray: any = [];
  result : any
  // data: any = this.countryList;

  @ViewChild('popupCoordinates') popupCoordinates!: ElementRef;
  @ViewChild('dgscomponent') DsgComponent ;

  data: any;
  marker: any;
  coords: any;
  lat: number;
  lng: number;
  clickMouse : any;
  @Input() notificationDate:any;
 

  
  constructor(private service: ApiServiceService) {
   
  }

  ngOnInit(): void {
    this.service.getMapName().subscribe((data) => {
      this.mapName = data;
    });
  }
 

}
