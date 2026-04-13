'use client';

import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { getMainDefinition } from "@apollo/client/utilities";
import { ReactNode, useMemo } from "react";
import Pusher from "pusher-js";
import { PusherLink } from "./pusherLink";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  // Sử dụng useMemo để đảm bảo Apollo Client và Pusher chỉ được tạo 1 lần 
  // trong suốt vòng đời của 1 phiên làm việc trên trình duyệt (tránh rò rỉ bộ nhớ).
  const client = useMemo(() => {
    // 1. Cấu hình HTTP Link (Cho Query và Mutation)
    const httpLink = new HttpLink({
      uri: "http://127.0.0.1:8000/graphql",
      // Chống cache để dữ liệu luôn tươi mới
      fetchOptions: { cache: "no-store" },
    });

    let link: any = httpLink;

    // 2. Cấu hình Pusher Link (Chỉ khởi tạo trên trình duyệt cho Subscriptions)
    if (typeof window !== "undefined") {
      const pusher = new Pusher("app-key", { // Thay app-key bằng PUSHER_APP_KEY của Soketi
        wsHost: "127.0.0.1",
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ["ws", "wss"],
        cluster: "mt1",
        authEndpoint: "http://127.0.0.1:8000/graphql/subscriptions/auth",
      });

      const pusherLink = new PusherLink({ pusher });

      link = split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        pusherLink as any, // Ép kiểu an toàn ở tầng config Apollo
        httpLink
      );
    }

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: link,
    });
  }, []);

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}