import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hrsMinPipe',
})
export class HrsMinPipePipe implements PipeTransform {
  transform(Minutes: number): any {
    var totalTimeInMinutes = Minutes;
    var hour = Math.floor(totalTimeInMinutes / 60); //
    var hr;
    if (hour < 10) hr = '0' + hour;
    else hr = hour;
    var minutes = totalTimeInMinutes - hour * 60; //30m
    var min;
    if (minutes < 10) min = '0' + minutes;
    else min = minutes;
    return hr + ' : ' + min;
  }
}
