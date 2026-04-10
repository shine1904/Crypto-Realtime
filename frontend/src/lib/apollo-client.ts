import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://127.0.0.1:8000/graphql' }), // Địa chỉ Laravel của bạn
  cache: new InMemoryCache(),
});