import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddeventComponent } from '../../Shared/addevent/addevent.component';
// import { ImpressionsComponent } from '../../Shared/';

@Component({
  selector: 'app-advertising',
  templateUrl: './advertising.component.html',
  styleUrls: ['./advertising.component.css']
})
export class AdvertisingComponent implements OnInit {
  coursetag: boolean;
  style:any;
avgpace: boolean =false;
chatbx: boolean;
  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }

  // holes code
  course(){
    this.coursetag = !this.coursetag;
  }
  addevent(ref){
    this.dialog.open(AddeventComponent,{
      width:'auto',
      height: 'auto',
      data:ref
    });
  }
  impressionsreport(ref){
    this.dialog.open(AddeventComponent,{
      width:'auto',
      height: 'auto',
      data:ref
    });
  }

  // images show code

  advertising(){
    this.avgpace = !this.avgpace;
    // this.chatbx = !this.chatbx;
    this.style = this.avgpace==true?{ 'height': 'calc(100vh - 275px)','margin-bottom': '0%'}:{'height': 'calc(100vh - 112px)'};
  }
}
