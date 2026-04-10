'use client';

import { HttpLink } from "@apollo/client";
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
// In 0.144 ApolloNextAppProvider is exported from /ssr? Wait, actually we can just use regular ApolloProvider if we don't want to break things, but wait!
import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support/ssr";
import { ReactNode } from "react";

function makeClient() {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: "http://127.0.0.1:8000/graphql",
    }),
  });
}

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}