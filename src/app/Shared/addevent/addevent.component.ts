import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css']
})
export class AddeventComponent implements OnInit {
  dropdown: boolean;

  constructor(private dialog: MatDialog,public dialogRef: MatDialogRef<AddeventComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
  }
  close(){
    this.dialog.closeAll()
  }

  // impression report code
  savedd() {
    this.dropdown = !this.dropdown;
  }
}
