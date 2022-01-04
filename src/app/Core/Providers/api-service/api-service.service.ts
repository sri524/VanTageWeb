import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import{HttpClient, HttpHeaders, HttpParams, HttpParamsOptions} from '@angular/common/http'

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private htttpOptions() {
    let httpOptions: any;

    return (httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  apiUrl = 'https://vttapi.azaz.com/api/';
  private mapName = new BehaviorSubject<any>('dsg');
  private mapcoordinates = new BehaviorSubject({
    obj: '',
  });
  private mouseIcon = new BehaviorSubject<any>({
    obj: '',
  });

  private Course = new BehaviorSubject<any>({
    courseId: 'ee97be63-0bae-47a0-8820-006ceaf99226',
  });

  private tourcart = new BehaviorSubject<any>({
    courseId: '',
  });
  private tagDetails = new BehaviorSubject<any>({
    obj: '',
  });
  private tagId = new BehaviorSubject<any>({
    tagId: '',
  });

  private tagData = new BehaviorSubject<any>({
    obj: '',
  });

  private locationTagId = new BehaviorSubject<any>({
    obj: '',
  });

  private closePace = new BehaviorSubject<any>({ obj: '' });

  private toggle = new BehaviorSubject<any>(1);
  private userInstallations = new BehaviorSubject<any>({ obj: '' });

  private zonesDetails = new BehaviorSubject<any>({ obj: '' });
  private installationId = new BehaviorSubject<any>({ instId: '' });
  private insid = new BehaviorSubject<any>({ obj: '' });
  private setinsid = new BehaviorSubject<any>({ obj: '' });
  private showTagsCheckValue = new BehaviorSubject<any>({ obj: '' });
  private showTags = new BehaviorSubject<any>({ obj: '' });
  private userId = new BehaviorSubject<any>({
    userId: '',
  });
  constructor(private http: HttpClient) {}

  setUserId(id) {
    this.userId.next(id);
  }
  getUserId() {
    return this.userId.asObservable();
  }
  setToggleButton(value) {
    this.toggle.next(value);
  }

  getToggleButton() {
    return this.toggle.asObservable();
  }

  setInsId(value) {
    this.insid.next(value);
  }

  getInsId() {
    return this.insid.asObservable();
  }

  insIdSet(value) {
    this.setinsid.next(value);
  }

  InsIdget() {
    return this.setinsid.asObservable();
  }

  setUserInstallations(data: any) {
    this.userInstallations.next(data);
  }

  getUserInstallations() {
    return this.userInstallations.asObservable();
  }

  setTagId(id) {
    this.tagId.next(id);
  }
  getTagId() {
    return this.tagId.asObservable();
  }
  setInstallationId(instId: string) {
    this.installationId.next(instId);
  }
  getInstallationId() {
    return this.installationId.asObservable();
  }

  setMapName(name) {
    this.mapName.next(name);
  }

  getMapName() {
    return this.mapName.asObservable();
  }

  setMapcoordinates(data: any) {
    ////console.log(data);
    this.mapcoordinates.next(data);
  }

  setZonesDetails(data: any) {
    //console.log(data);

    this.zonesDetails.next(data);
  }
  getZonesDetails() {
    return this.zonesDetails.asObservable();
  }

  setTagData(data: any) {
    this.tagData.next(data);
  }

  getTagData() {
    return this.tagData.asObservable();
  }

  setTagDetails(data: any) {
    this.tagDetails.next(data);
  }

  getTagDetails() {
    return this.tagDetails.asObservable();
  }
  getMapcoordinates() {
    return this.mapcoordinates.asObservable();
  }
  selectMouse(data: any) {
    ////console.log(data);
    this.mouseIcon.next(data);
  }

  getMouseValue() {
    return this.mouseIcon.asObservable();
  }

  getGolfCourses() {
    return this.http.post(this.apiUrl + 'GetGolfCourses', this.htttpOptions());
  }

  setCourseId(id: any) {
    //////console.log(id)
    this.Course.next(id);
  }

  getCourseId() {
    return this.Course.asObservable();
  }

  getTournamentDetails(obj) {
    return this.http.post(
      this.apiUrl + 'getTournaments',
      obj,
      this.htttpOptions()
    );
  }

  getCourseCarts(obj) {
    return this.http.post(
      this.apiUrl + 'getCourseTags',
      obj,
      this.htttpOptions()
    );
  }

  getCourseHoles(obj) {
    return this.http.post(
      this.apiUrl + 'getcourseHoles',
      obj,
      this.htttpOptions()
    );
  }
  CUDTournament(obj) {
    return this.http.post(
      this.apiUrl + 'CUDTournament',
      obj,
      this.htttpOptions()
    );
  }
  saveRiderInfo(obj) {
    ////console.log(obj);
    // const headers = { 'responseType': 'blob' as 'json'};

    return this.http.post(this.apiUrl + 'SaveTournamentDetails', obj, {
      responseType: 'text',
    });
  }

  getRiderInfo(obj1) {
    return this.http.post(
      this.apiUrl + 'gettournamentdetails',
      obj1,
      this.htttpOptions()
    );
  }

  tournmtcartInformation(value) {
    ////console.log(value);

    this.tourcart.next(value);
  }
  gettournmtcartInformation() {
    ////console.log(this.tourcart);

    return this.tourcart.asObservable();
  }

  startTournament(obj) {
    return this.http.post(this.apiUrl + 'startTournament', obj, {
      responseType: 'text',
    });
  }

  endTournament(obj) {
    return this.http.post(this.apiUrl + 'endTournament', obj, {
      responseType: 'text',
    });
  }

  getImage(id) {
    return this.http.get(
      'https://vtagdemoapi.azaz.com/api/0/content/data/' + id,
      { responseType: 'blob' }
    );
  }

  getHoleImage(id) {
    return this.http.get(
      'https://vtagdemoapi.azaz.com/api/0/content/data/' + id,
      { responseType: 'text' }
    );
  }

  public stringSubject = new BehaviorSubject<any>('');
  public length = new BehaviorSubject<any>('');
  public names = new BehaviorSubject<any>('');
  public id = new BehaviorSubject<any>('');
  public data = new BehaviorSubject<any>('');
  public empty = new BehaviorSubject<any>('');
  passValue(data: any) {
    this.stringSubject.next(data);
    //console.log(data)
  }
  getvalue() {
    // //console.log(this.stringSubject)
    return this.stringSubject.asObservable();
  }

  passlength(dataa: any) {
    this.length.next(dataa);
    //console.log(dataa)
  }
  getlength() {
    // //console.log(this.stringSubject)
    return this.length.asObservable();
  }

  passid(dataa: any) {
    this.id.next(dataa);
    //console.log(dataa)
  }
  getid() {
    // //console.log(this.stringSubject)
    return this.id.asObservable();
  }

  passnames(dataa: any) {
    this.names.next(dataa);
    //console.log(dataa)
  }
  getnames() {
    // //console.log(this.stringSubject)
    return this.names.asObservable();
  }

  passdata(dataa: any) {
    this.data.next(dataa);
    //console.log(dataa)
  }
  getdata() {
    // //console.log(this.stringSubject)
    return this.data.asObservable();
  }

  passempty(dataa: any) {
    this.empty.next(dataa);

    //console.log(dataa)
  }

  getempty() {
    // //console.log(this.stringSubject)

    return this.empty.asObservable();
  }

  setLocatonTagData(tagId) {
    this.locationTagId.next(tagId);
  }

  getLocationTagData() {
    return this.locationTagId.asObservable();
  }

  private TrailData = new BehaviorSubject<any>({
    obj: '',
  });

  SetTrailsRelatedCartData(data: any) {
    this.TrailData.next(data);
  }

  GetTrailsRelatedCartData() {
    return this.TrailData.asObservable();
  }

  setpaceclose(data: any) {
    this.closePace.next(data);
  }
  getpaceClose() {
    return this.closePace.asObservable();
  }
  private HideShowID = new BehaviorSubject<any>({
    obj: '',
  });

  SetHideShowData(data: any) {
    this.HideShowID.next(data);
  }

  GetHideShowData() {
    return this.HideShowID.asObservable();
  }

  setShowTagsCheck(value) {
    this.showTagsCheckValue.next(value);
  }

  getShowTagsCheck() {
    return this.showTagsCheckValue.asObservable();
  }

  setShowTags(value) {
    this.showTags.next(value);
  }

  getShowTags() {
    return this.showTags.asObservable();
  }
}
