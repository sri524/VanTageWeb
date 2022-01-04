import {NgModule} from '@angular/core';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';

// const uri = 'https://vtagdemoapi.azaz.com/graphql/'; // <-- add the URL of the GraphQL server here
// export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
//   return {
//     link: httpLink.create({uri}),
//     cache: new InMemoryCache(),
//   };
// }

@NgModule({
  providers: [
    // {
    //   provide: APOLLO_OPTIONS,
    //   useFactory: createApollo,
    //   deps: [HttpLink],
    // },
  ],
})
export class GraphQLModule {
  private readonly URI: string = 'https://vtagapi.azaz.com/graphql/';
  private readonly LIVEURI: string = 'https://vtagdemoapi.azaz.com/graphql/';

  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const options1: any = { uri: this.URI };
    apollo.createDefault({
      link: httpLink.create(options1),
      cache: new InMemoryCache(),
    });

    const options2: any = { uri: this.LIVEURI };
    apollo.createNamed('live', {
      link: httpLink.create(options2),
      cache: new InMemoryCache() 
    });
  }
}

