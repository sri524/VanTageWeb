import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  showTagsMenu = new EventEmitter();
  data=new EventEmitter();

  subsVar: Subscription;
  constructor() { }
  onLeftPanelTagsClick(){
    this.showTagsMenu.emit();
  }

  refresh(){
    this.data.emit();
  }
}
