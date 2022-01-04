import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';


// AveragePaceReport Query
export const AveragePaceReport_Query = gql`
  query ($installationId: ID!, $start: DateTime!, $end: DateTime!) {
    averagePace(installationId: $installationId, start: $start, end: $end) {
      holeName
      averagePace
      targetPace
      rounds
      courseName
    }
  }
`;

export const VehicleUsgaeReport_Query=gql`
query ($installationId: ID!, $start: DateTime!, $end: DateTime!)
{
vehicleUsageReport(installationId: $installationId, start: $start, end: $end) {
     id
     installationName
     tagName
     serialNumber
     vehicleType
     distance
     usage
     rounds
    }
}
`;
// export const PaceDetailsReport_Query=gql`
// paceDetailReport(installationid: $installationId, fromDate: $fromDate, tagsFilter: $tagsFilter)
// {
//      name
//      startTime
//      endTime
//      playedTime
//      pace
//      holesPlayed
//      courseName
// }
// `;


export const validateUserDetails = gql`
  query ($username: String!, $password: String!) {
    validateUsers(username: $username, password: $password) {
      success
      userID
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  //Get Average Pace Report
  getAveragePaceReport(installationId, startDate, endDate): Observable<any>{
    return this.apollo.use('live').watchQuery<any>({
      query: AveragePaceReport_Query,
      variables: {
        installationId: installationId,
        start: startDate,
        end: startDate,
      },
    }).valueChanges;
  }

}
