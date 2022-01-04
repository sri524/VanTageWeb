import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrsMinPipePipe } from './NumberToHrsMins/hrs-min-pipe.pipe';



@NgModule({
  declarations: [
    HrsMinPipePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    HrsMinPipePipe
  ]
})
export class PipesModule { }
