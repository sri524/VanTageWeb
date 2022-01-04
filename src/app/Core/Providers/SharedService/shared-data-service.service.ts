import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataServiceService {
  constructor() {}

  //For Getting and Setting UserId
  private userId = new BehaviorSubject<any>({
    userId: '',
  });

  setUserId(id) {
    this.userId.next(id);
  }
  getUserId() {
    return this.userId.asObservable();
  }
  private userInstallations = new BehaviorSubject<any>({ obj: '' });
  setUserInstallations(data: any) {
    this.userInstallations.next(data);
  }

  getUserInstallations() {
    return this.userInstallations.asObservable();
  }
}
