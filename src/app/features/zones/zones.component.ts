import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialog ,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {
  holecount: boolean;
  holecount1: boolean;
  holecount2: boolean;

  constructor( private dialog: MatDialog , public dialogRef: MatDialogRef<ZonesComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  close(){
    this.dialog.closeAll()
  }

  // Cart Path Manager code starts
  accordian(){
    this.holecount = !this.holecount;
  }
  accordian1(){
    this.holecount1 = !this.holecount1;
  }
  accordian2(){
    this.holecount2 = !this.holecount2;
  }
  // Cart Path Manager code ends
}
